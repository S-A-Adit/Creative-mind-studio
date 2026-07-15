from __future__ import annotations

import json
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.schemas.granite import GraniteResponse

# Mock response helpers
_FOLLOWUP_REPLY = {"reply": "Great follow up!"}
_REFINE_REPLY = {"refined_idea": "Highly refined music tool"}
_PRODPACK_REPLY = {
    "title": "Emotion Studio",
    "elevator_pitch": "Musician tool",
    "social_tags": ["music", "ai"],
}

# 3-agent & 7-agent mocks
_CD = {
    "originality_score": 8,
    "emotional_direction": "inspiring",
    "key_themes": ["AI"],
    "suggestions": ["share"],
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
    "rationale": "gap",
    "ai_engine": "IBM Granite",
}
_AA = {
    "audience_reactions": [
        {"segment": "Hikers", "reaction": "positive", "confusion_points": ["Offline"]}
    ],
    "potential_confusion_points": ["Offline"],
    "perceived_value_proposition": "Safety",
    "ai_engine": "IBM Granite",
}
_MS = {
    "primary_hook": "Safety hook",
    "positioning_statement": "Safety app",
    "distribution_channels": ["App Store"],
    "recommended_marketing_tactics": ["Ads"],
    "ai_engine": "IBM Granite",
}
_EA = {
    "safety_rating": "green",
    "ethical_concerns": [],
    "brand_safety_issues": [],
    "compliance_suggestions": [],
    "ai_engine": "IBM Granite",
}
_EP = {
    "mvp_scope": ["GPS"],
    "key_milestones": [{"milestone": "Beta", "target_period": "Month 1"}],
    "estimated_timeline": "2 months",
    "ai_engine": "IBM Granite",
}
_SY = {
    "strengths": ["originality"],
    "weaknesses": ["risks"],
    "scored_dimensions": [{"dimension": "Originality", "score": 8, "reason": "novel"}],
    "synthesis_summary": "Promising AI app.",
    "overall_recommendation": "Build",
    "ai_engine": "IBM Granite",
}


def _make_gr(content: dict) -> GraniteResponse:
    raw = json.dumps(content)
    return GraniteResponse(content=raw, raw=raw, fallback_used=False, ai_engine="IBM Granite")


def _mock_generate_all():
    return AsyncMock(
        side_effect=[
            _make_gr(_CD),
            _make_gr(_RC),
            _make_gr(_TM),
            _make_gr(_AA),
            _make_gr(_MS),
            _make_gr(_EA),
            _make_gr(_EP),
            _make_gr(_SY),
        ]
    )


@pytest.mark.asyncio
async def test_sprint2_endpoints_flow(test_app):
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        # 1. Create project
        create_resp = await client.post(
            "/api/projects",
            json={"title": "Sprint 2 Test", "raw_idea": "Musician AI tool"},
        )
        assert create_resp.status_code == 201
        pid = create_resp.json()["id"]

        # 2. Run boardroom debate
        with patch("app.agents.base.generate", _mock_generate_all()):
            boardroom_resp = await client.post(f"/api/projects/{pid}/boardroom")
        assert boardroom_resp.status_code == 200

        # 3. Follow-up endpoint
        with patch("app.api.endpoints_sprint2.generate", return_value=_make_gr(_FOLLOWUP_REPLY)):
            fu_resp = await client.post(
                f"/api/projects/{pid}/follow-up",
                json={"user_input": "How much does it cost?"},
            )
        assert fu_resp.status_code == 200
        assert fu_resp.json()["agent_responses"]["reply"] == "Great follow up!"

        # 4. Audience simulation
        aud_resp = await client.post(f"/api/projects/{pid}/audience-simulation")
        assert aud_resp.status_code == 200
        assert "virality_twin_match" in aud_resp.json()

        # 5. Scorecard
        score_resp = await client.post(f"/api/projects/{pid}/scorecard")
        assert score_resp.status_code == 200
        assert "overall_score" in score_resp.json()

        # 6. Refine
        with patch("app.api.endpoints_sprint2.generate", return_value=_make_gr(_REFINE_REPLY)):
            refine_resp = await client.post(f"/api/projects/{pid}/refine")
        assert refine_resp.status_code == 200
        assert refine_resp.json()["version_number"] > 0

        # 7. Roadmap
        map_resp = await client.post(f"/api/projects/{pid}/roadmap")
        assert map_resp.status_code == 200
        assert "mvp_scope" in map_resp.json()

        # 8. Production package
        with patch("app.api.endpoints_sprint2.generate", return_value=_make_gr(_PRODPACK_REPLY)):
            pkg_resp = await client.post(f"/api/projects/{pid}/production-package")
        assert pkg_resp.status_code == 200
        assert pkg_resp.json()["title"] == "Emotion Studio"

        # 9. Pivot (re-runs specific agents)
        with patch("app.agents.base.generate", _mock_generate_all()):
            pivot_resp = await client.post(
                f"/api/projects/{pid}/pivot",
                json={
                    "raw_idea": "Musician AI tool V2",
                    "pivot_agents": ["risk_critic", "technical_market"],
                },
            )
        assert pivot_resp.status_code == 200

        # 10. Report
        report_resp = await client.get(f"/api/projects/{pid}/report")
        assert report_resp.status_code == 200
        assert len(report_resp.json()["idea_versions"]) > 0
