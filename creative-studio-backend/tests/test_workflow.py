"""
tests/test_workflow.py
------------------------------
Tests for Sub-Task 9: Conditional Stage & Handoff Logic.

Covers:
- Stage generation per workflow profile
- Conditional rule injection (factual claims, third-party clips, legal review)
- Solo mode auto-approval
- Handoff gate validation (valid, missing gates, skip attempt, wrong current stage)
- Stage advancement mutations
- API integration: /workflow/initialize, /workflow, /workflow/handoff
"""
from __future__ import annotations

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.client import get_db
from app.db.models import Base
from app.services.workflow_engine import (
    advance_stage,
    generate_stages,
    validate_handoff,
)

# ---------------------------------------------------------------------------
# DB fixture
# ---------------------------------------------------------------------------

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def test_app():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    async def override_get_db():
        async with session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    from app.main import create_app

    application = create_app()
    application.dependency_overrides[get_db] = override_get_db

    yield application

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def client(test_app):
    async with AsyncClient(
        transport=ASGITransport(app=test_app), base_url="http://test"
    ) as c:
        yield c


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------


async def create_project(client, title="Test Project", idea="A creative idea for testing workflow."):
    resp = await client.post(
        "/api/projects", json={"title": title, "raw_idea": idea}
    )
    assert resp.status_code == 201, resp.text
    return resp.json()["id"]


# ===========================================================================
# Unit tests — workflow_engine.py
# ===========================================================================


class TestGenerateStages:
    def test_quick_creator_skips_research_and_review(self):
        stages = generate_stages("Quick Creator", "solo", None)
        names = [s["name"] for s in stages]
        assert "Research" not in names
        assert "Review" not in names
        assert "Script" in names
        assert "Publish" in names

    def test_standard_production_includes_research_and_review(self):
        stages = generate_stages("Standard Production", "team", None)
        names = [s["name"] for s in stages]
        assert "Research" in names
        assert "Review" in names

    def test_evidence_heavy_includes_analytics(self):
        stages = generate_stages("Evidence-Heavy", "team", None)
        names = [s["name"] for s in stages]
        assert "Analytics" in names

    def test_first_stage_is_active(self):
        stages = generate_stages("Standard Production", "solo", None)
        assert stages[0]["status"] == "active"
        assert all(s["status"] == "pending" for s in stages[1:])

    def test_solo_mode_marks_auto_approved(self):
        stages = generate_stages("Standard Production", "solo", None)
        assert all(s["auto_approved"] for s in stages)

    def test_team_mode_not_auto_approved(self):
        stages = generate_stages("Standard Production", "team", None)
        assert all(not s["auto_approved"] for s in stages)


class TestConditionalRules:
    def test_factual_claims_injects_research_in_quick_creator(self):
        stages = generate_stages(
            "Quick Creator", "solo", {"has_factual_claims": True}
        )
        names = [s["name"] for s in stages]
        assert "Research" in names
        # Research must come before Script
        assert names.index("Research") < names.index("Script")

    def test_legal_review_injects_review_in_quick_creator(self):
        stages = generate_stages(
            "Quick Creator", "solo", {"legal_review_required": True}
        )
        names = [s["name"] for s in stages]
        assert "Review" in names
        assert names.index("Review") < names.index("Publish")

    def test_third_party_clips_appends_analytics(self):
        stages = generate_stages(
            "Standard Production", "team", {"has_third_party_clips": True}
        )
        names = [s["name"] for s in stages]
        assert "Analytics" in names


class TestValidateHandoff:
    def _make_stages(self, names, active_idx=0):
        return [
            {
                "name": n,
                "status": "active" if i == active_idx else ("completed" if i < active_idx else "pending"),
                "completed_at": None,
                "gates_passed": [],
                "auto_approved": False,
            }
            for i, n in enumerate(names)
        ]

    def test_solo_auto_approves_all_gates(self):
        stages = self._make_stages(["Strategy", "Research", "Script"])
        ok, gates, err = validate_handoff(stages, "solo", "Strategy", "Research", {})
        assert ok
        assert err == ""

    def test_team_mode_passes_with_correct_gates(self):
        stages = self._make_stages(["Strategy", "Research", "Script"])
        ok, gates, err = validate_handoff(
            stages,
            "team",
            "Strategy",
            "Research",
            {"approved_brief": True, "scorecard": {"score": 80}},
        )
        assert ok
        assert "approved_brief" in gates
        assert "scorecard" in gates

    def test_team_mode_fails_missing_gates(self):
        stages = self._make_stages(["Strategy", "Research", "Script"])
        ok, gates, err = validate_handoff(
            stages, "team", "Strategy", "Research", {"approved_brief": True}
        )  # missing scorecard
        assert not ok
        assert "scorecard" in err

    def test_fails_when_from_stage_not_active(self):
        stages = self._make_stages(["Strategy", "Research", "Script"], active_idx=0)
        ok, _, err = validate_handoff(stages, "team", "Research", "Script", {})
        assert not ok
        assert "not currently active" in err

    def test_fails_when_skipping_a_stage(self):
        stages = self._make_stages(["Strategy", "Research", "Script"])
        ok, _, err = validate_handoff(stages, "solo", "Strategy", "Script", {})
        assert not ok
        assert "skip" in err.lower() or "directly follow" in err.lower()

    def test_fails_when_to_stage_not_in_workflow(self):
        stages = self._make_stages(["Strategy", "Research"])
        ok, _, err = validate_handoff(stages, "solo", "Strategy", "Analytics", {})
        assert not ok
        assert "not part of this project" in err


class TestAdvanceStage:
    def test_advances_correctly(self):
        stages = [
            {"name": "Strategy", "status": "active", "completed_at": None, "gates_passed": [], "auto_approved": False},
            {"name": "Research", "status": "pending", "completed_at": None, "gates_passed": [], "auto_approved": False},
        ]
        updated = advance_stage(stages, "Strategy", "Research", ["approved_brief", "scorecard"], False)
        strategy = next(s for s in updated if s["name"] == "Strategy")
        research = next(s for s in updated if s["name"] == "Research")
        assert strategy["status"] == "completed"
        assert strategy["completed_at"] is not None
        assert strategy["gates_passed"] == ["approved_brief", "scorecard"]
        assert research["status"] == "active"


# ===========================================================================
# Integration tests — API endpoints
# ===========================================================================


@pytest.mark.anyio
async def test_initialize_workflow(client):
    pid = await create_project(client)
    resp = await client.post(
        f"/api/projects/{pid}/workflow/initialize",
        json={"workflow_profile": "Standard Production", "team_mode": "solo"},
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["current_stage"] == "Strategy"
    assert data["workflow_profile"] == "Standard Production"
    assert any(s["name"] == "Research" for s in data["stages"])


@pytest.mark.anyio
async def test_initialize_invalid_profile_returns_422(client):
    pid = await create_project(client)
    resp = await client.post(
        f"/api/projects/{pid}/workflow/initialize",
        json={"workflow_profile": "NonExistent Profile", "team_mode": "solo"},
    )
    assert resp.status_code == 422


@pytest.mark.anyio
async def test_get_workflow_before_init_returns_404(client):
    pid = await create_project(client)
    resp = await client.get(f"/api/projects/{pid}/workflow")
    assert resp.status_code == 404


@pytest.mark.anyio
async def test_get_workflow_after_init(client):
    pid = await create_project(client)
    await client.post(
        f"/api/projects/{pid}/workflow/initialize",
        json={"workflow_profile": "Quick Creator", "team_mode": "solo"},
    )
    resp = await client.get(f"/api/projects/{pid}/workflow")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_stage"] == "Strategy"


@pytest.mark.anyio
async def test_solo_handoff_advances_without_gates(client):
    pid = await create_project(client)
    # Quick Creator: Strategy -> Script (no Research)
    await client.post(
        f"/api/projects/{pid}/workflow/initialize",
        json={"workflow_profile": "Quick Creator", "team_mode": "solo"},
    )
    resp = await client.post(
        f"/api/projects/{pid}/workflow/handoff",
        json={"from_stage": "Strategy", "to_stage": "Script", "handoff_data": {}},
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["success"] is True
    assert data["current_stage"] == "Script"
    assert data["auto_approved"] is True


@pytest.mark.anyio
async def test_team_handoff_fails_without_required_gates(client):
    pid = await create_project(client)
    await client.post(
        f"/api/projects/{pid}/workflow/initialize",
        json={"workflow_profile": "Standard Production", "team_mode": "team"},
    )
    resp = await client.post(
        f"/api/projects/{pid}/workflow/handoff",
        json={
            "from_stage": "Strategy",
            "to_stage": "Research",
            "handoff_data": {},  # missing approved_brief and scorecard
        },
    )
    assert resp.status_code == 422


@pytest.mark.anyio
async def test_team_handoff_succeeds_with_gates(client):
    pid = await create_project(client)
    await client.post(
        f"/api/projects/{pid}/workflow/initialize",
        json={"workflow_profile": "Standard Production", "team_mode": "team"},
    )
    resp = await client.post(
        f"/api/projects/{pid}/workflow/handoff",
        json={
            "from_stage": "Strategy",
            "to_stage": "Research",
            "handoff_data": {
                "approved_brief": "Approved by Creative Director.",
                "scorecard": {"overall_score": 82},
            },
        },
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["success"] is True
    assert data["current_stage"] == "Research"
    assert data["auto_approved"] is False


@pytest.mark.anyio
async def test_handoff_on_uninitialised_workflow_returns_400(client):
    pid = await create_project(client)
    resp = await client.post(
        f"/api/projects/{pid}/workflow/handoff",
        json={"from_stage": "Strategy", "to_stage": "Research", "handoff_data": {}},
    )
    assert resp.status_code == 400


@pytest.mark.anyio
async def test_get_workflow_status_reflects_stage_advance(client):
    pid = await create_project(client)
    await client.post(
        f"/api/projects/{pid}/workflow/initialize",
        json={"workflow_profile": "Standard Production", "team_mode": "solo"},
    )
    await client.post(
        f"/api/projects/{pid}/workflow/handoff",
        json={"from_stage": "Strategy", "to_stage": "Research", "handoff_data": {}},
    )
    resp = await client.get(f"/api/projects/{pid}/workflow")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_stage"] == "Research"
    strategy_stage = next(s for s in data["stages"] if s["name"] == "Strategy")
    assert strategy_stage["status"] == "completed"
