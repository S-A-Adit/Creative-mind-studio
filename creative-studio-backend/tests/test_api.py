"""
Integration tests for Sprint 1 API endpoints.
Uses TestClient + in-memory SQLite. Granite is mocked.
"""

from __future__ import annotations

import json
import uuid
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.client import get_db
from app.db.models import Base
from app.schemas.granite import GraniteResponse

# ---------------------------------------------------------------------------
# Mock Granite responses
# ---------------------------------------------------------------------------
_CD = {
    "originality_score": 8,
    "emotional_direction": "inspiring",
    "key_themes": ["AI"],
    "suggestions": ["iterate"],
    "ai_engine": "IBM Granite",
}
_RC = {
    "risks": [{"risk": "competition", "severity": "medium", "mitigation": "niche"}],
    "critical_assumptions": ["data sharing"],
    "overall_risk_level": "medium",
    "ai_engine": "IBM Granite",
}
_TM = {
    "feasibility_score": 7,
    "cost_estimate": "$100k",
    "market_size": "$10B",
    "competitors": ["Google"],
    "recommendation": "Build",
    "rationale": "market gap",
    "ai_engine": "IBM Granite",
}
_SY = {
    "strengths": ["Strong originality", "Clear gap"],
    "weaknesses": ["High competition"],
    "scored_dimensions": [
        {"dimension": "Originality", "score": 8, "reason": "novel"},
        {"dimension": "Feasibility", "score": 7, "reason": "achievable"},
        {"dimension": "Market Opportunity", "score": 8, "reason": "large TAM"},
        {"dimension": "Risk Profile", "score": 6, "reason": "medium risk"},
        {"dimension": "Execution Readiness", "score": 7, "reason": "clear MVP"},
    ],
    "synthesis_summary": "Promising AI app with clear market gap.",
    "overall_recommendation": "Build",
    "ai_engine": "IBM Granite",
}


def _mock_generate():
    responses = [
        GraniteResponse(
            content=json.dumps(_CD),
            raw=json.dumps(_CD),
            fallback_used=False,
            ai_engine="IBM Granite",
        ),
        GraniteResponse(
            content=json.dumps(_RC),
            raw=json.dumps(_RC),
            fallback_used=False,
            ai_engine="IBM Granite",
        ),
        GraniteResponse(
            content=json.dumps(_TM),
            raw=json.dumps(_TM),
            fallback_used=False,
            ai_engine="IBM Granite",
        ),
        GraniteResponse(
            content=json.dumps(_SY),
            raw=json.dumps(_SY),
            fallback_used=False,
            ai_engine="IBM Granite",
        ),
    ]
    return AsyncMock(side_effect=responses)


# ---------------------------------------------------------------------------
# Test DB fixture — in-memory SQLite, overrides get_db dependency
# ---------------------------------------------------------------------------
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
async def test_app():
    """Creates a fresh test app with an in-memory DB for each test."""
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

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


# ---------------------------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_health_endpoint(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["ai_engine"] == "IBM Granite"
    assert "status" in data
    assert "version" in data


# ---------------------------------------------------------------------------
# Project endpoints
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_create_project(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post(
            "/api/projects",
            json={
                "title": "My AI App",
                "raw_idea": "An app that uses AI to help people find hiking trails",
            },
        )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "My AI App"
    assert data["status"] == "active"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_project_validates_short_idea(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post(
            "/api/projects",
            json={
                "title": "Test",
                "raw_idea": "short",  # less than 10 chars
            },
        )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_get_project(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        create_resp = await client.post(
            "/api/projects",
            json={
                "title": "Test Project",
                "raw_idea": "An innovative app concept using AI",
            },
        )
        pid = create_resp.json()["id"]

        get_resp = await client.get(f"/api/projects/{pid}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == pid


@pytest.mark.asyncio
async def test_get_project_not_found(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.get(f"/api/projects/{uuid.uuid4()}")
    assert resp.status_code == 404


# ---------------------------------------------------------------------------
# Boardroom endpoints
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_run_boardroom_returns_boardroom_result(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        # Create project
        create_resp = await client.post(
            "/api/projects",
            json={
                "title": "Boardroom Test",
                "raw_idea": "An AI-powered tool that helps musicians compose songs using emotion analysis",
            },
        )
        pid = create_resp.json()["id"]

        # Run boardroom with mocked Granite
        with patch("app.agents.base.generate", _mock_generate()):
            boardroom_resp = await client.post(f"/api/projects/{pid}/boardroom")

    assert boardroom_resp.status_code == 200
    data = boardroom_resp.json()
    assert data["ai_engine"] == "IBM Granite"
    assert data["project_id"] == pid
    assert data["overall_recommendation"] == "Build"
    assert len(data["debate"]) == 4
    assert len(data["scored_dimensions"]) == 5
    assert data["fallback_used"] is False


@pytest.mark.asyncio
async def test_run_boardroom_stores_and_retrieves(test_app):
    """POST boardroom → GET boardroom should return identical result."""
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        create_resp = await client.post(
            "/api/projects",
            json={
                "title": "Store Test",
                "raw_idea": "A platform that connects freelance artists with local businesses",
            },
        )
        pid = create_resp.json()["id"]

        with patch("app.agents.base.generate", _mock_generate()):
            post_resp = await client.post(f"/api/projects/{pid}/boardroom")

        get_resp = await client.get(f"/api/projects/{pid}/boardroom")

    assert post_resp.status_code == 200
    assert get_resp.status_code == 200
    post_data = post_resp.json()
    get_data = get_resp.json()
    assert post_data["session_id"] == get_data["session_id"]
    assert post_data["synthesis_summary"] == get_data["synthesis_summary"]
    assert post_data["ai_engine"] == "IBM Granite"


@pytest.mark.asyncio
async def test_get_boardroom_not_found(test_app):
    """GET boardroom for project with no sessions returns 404."""
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        create_resp = await client.post(
            "/api/projects",
            json={
                "title": "Empty Project",
                "raw_idea": "An idea that has not been debated yet",
            },
        )
        pid = create_resp.json()["id"]
        resp = await client.get(f"/api/projects/{pid}/boardroom")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_run_boardroom_for_nonexistent_project(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post(f"/api/projects/{uuid.uuid4()}/boardroom")
    assert resp.status_code == 404
