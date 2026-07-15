"""
Tests for Sub-Task 6: Synthesis Agent and BoardroomResult validation.
All Granite calls are mocked.
"""

from __future__ import annotations

import json
import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.graph.graph import build_boardroom_result, debate_graph
from app.graph.state import DebateState
from app.schemas.boardroom import BoardroomResult
from app.schemas.granite import GraniteResponse
from app.services.granite_client import GraniteResponseError

# ---------------------------------------------------------------------------
# Mock data
# ---------------------------------------------------------------------------
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
    "rationale": "gap exists",
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
    "strengths": ["Strong originality", "Clear market gap"],
    "weaknesses": ["High competition", "Privacy risks"],
    "scored_dimensions": [
        {"dimension": "Originality", "score": 8, "reason": "Novel AI approach"},
        {"dimension": "Feasibility", "score": 7, "reason": "Technically achievable"},
        {"dimension": "Market Opportunity", "score": 8, "reason": "Large TAM"},
        {"dimension": "Risk Profile", "score": 6, "reason": "Medium overall risk"},
        {"dimension": "Execution Readiness", "score": 7, "reason": "Clear MVP path"},
    ],
    "synthesis_summary": "A promising AI travel app with strong originality.",
    "overall_recommendation": "Build",
    "ai_engine": "IBM Granite",
}


def _make_gr(content: dict) -> GraniteResponse:
    raw = json.dumps(content)
    return GraniteResponse(content=raw, raw=raw, fallback_used=False, ai_engine="IBM Granite")


def _mock_generate_all():
    """Returns AsyncMock cycling through all 7 agents and Synthesis responses."""
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


def _full_state() -> DebateState:
    return {
        "project_id": str(uuid.uuid4()),
        "session_id": str(uuid.uuid4()),
        "raw_idea": "An AI travel itinerary app",
        "messages": [],
        "current_agent": "",
        "creative_director_output": None,
        "risk_critic_output": None,
        "technical_market_output": None,
        "audience_analyst_output": None,
        "marketing_strategist_output": None,
        "ethical_auditor_output": None,
        "execution_planner_output": None,
        "synthesis_output": None,
        "error": None,
        "fallback_used": False,
        "ai_engine": "IBM Granite",
        "pivot_agents": None,
    }


# ---------------------------------------------------------------------------
# Synthesis agent unit tests
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_synthesis_returns_valid_output():
    from app.agents.synthesis import synthesis_node

    state = _full_state()
    state["creative_director_output"] = _CD
    state["risk_critic_output"] = _RC
    state["technical_market_output"] = _TM
    state["audience_analyst_output"] = _AA
    state["marketing_strategist_output"] = _MS
    state["ethical_auditor_output"] = _EA
    state["execution_planner_output"] = _EP
    state["messages"] = [
        {"agent_name": "creative_director", "role": "agent", "content": _CD, "sequence_order": 0},
        {"agent_name": "risk_critic", "role": "agent", "content": _RC, "sequence_order": 1},
        {"agent_name": "technical_market", "role": "agent", "content": _TM, "sequence_order": 2},
        {"agent_name": "audience_analyst", "role": "agent", "content": _AA, "sequence_order": 3},
        {
            "agent_name": "marketing_strategist",
            "role": "agent",
            "content": _MS,
            "sequence_order": 4,
        },
        {"agent_name": "ethical_auditor", "role": "agent", "content": _EA, "sequence_order": 5},
        {"agent_name": "execution_planner", "role": "agent", "content": _EP, "sequence_order": 6},
    ]

    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_gr(_SY)
        result = await synthesis_node(state)

    assert result["current_agent"] == "synthesis"
    assert result["synthesis_output"]["overall_recommendation"] == "Build"
    assert len(result["synthesis_output"]["strengths"]) > 0
    assert result["synthesis_output"]["ai_engine"] == "IBM Granite"


@pytest.mark.asyncio
async def test_synthesis_receives_all_prior_context():
    """Synthesis user_prompt must include prior agent outputs."""
    from app.agents.synthesis import synthesis_node

    state = _full_state()
    state["creative_director_output"] = _CD
    state["risk_critic_output"] = _RC
    state["technical_market_output"] = _TM

    captured = []

    async def capture(prompt, system="", override_params=None):
        captured.append(prompt)
        return _make_gr(_SY)

    with patch("app.agents.base.generate", side_effect=capture):
        await synthesis_node(state)

    assert "Creative Director" in captured[0]
    assert "Risk Critic" in captured[0]
    assert "Technical" in captured[0]


@pytest.mark.asyncio
async def test_synthesis_fallback_on_granite_error():
    from app.agents.synthesis import synthesis_node

    state = _full_state()
    state["creative_director_output"] = _CD
    state["risk_critic_output"] = _RC
    state["technical_market_output"] = _TM

    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.side_effect = GraniteResponseError("failed", raw="")
        result = await synthesis_node(state)

    assert result["fallback_used"] is True


# ---------------------------------------------------------------------------
# build_boardroom_result tests
# ---------------------------------------------------------------------------
def _completed_state() -> DebateState:
    state = _full_state()
    state["creative_director_output"] = _CD
    state["risk_critic_output"] = _RC
    state["technical_market_output"] = _TM
    state["audience_analyst_output"] = _AA
    state["marketing_strategist_output"] = _MS
    state["ethical_auditor_output"] = _EA
    state["execution_planner_output"] = _EP
    state["synthesis_output"] = _SY
    state["messages"] = [
        {"agent_name": "creative_director", "role": "agent", "content": _CD, "sequence_order": 0},
        {"agent_name": "risk_critic", "role": "agent", "content": _RC, "sequence_order": 1},
        {"agent_name": "technical_market", "role": "agent", "content": _TM, "sequence_order": 2},
        {"agent_name": "audience_analyst", "role": "agent", "content": _AA, "sequence_order": 3},
        {
            "agent_name": "marketing_strategist",
            "role": "agent",
            "content": _MS,
            "sequence_order": 4,
        },
        {"agent_name": "ethical_auditor", "role": "agent", "content": _EA, "sequence_order": 5},
        {"agent_name": "execution_planner", "role": "agent", "content": _EP, "sequence_order": 6},
        {"agent_name": "synthesis", "role": "agent", "content": _SY, "sequence_order": 7},
    ]
    return state


def test_build_boardroom_result_returns_valid_model():
    state = _completed_state()
    result = build_boardroom_result(state)
    assert isinstance(result, BoardroomResult)


def test_build_boardroom_result_ai_engine():
    result = build_boardroom_result(_completed_state())
    assert result.ai_engine == "IBM Granite"


def test_build_boardroom_result_debate_transcript():
    result = build_boardroom_result(_completed_state())
    assert len(result.debate) == 8
    agent_names = [m.agent_name for m in result.debate]
    assert "creative_director" in agent_names
    assert "synthesis" in agent_names


def test_build_boardroom_result_scored_dimensions():
    result = build_boardroom_result(_completed_state())
    assert len(result.scored_dimensions) == 5
    dims = [d.dimension for d in result.scored_dimensions]
    assert "Originality" in dims
    assert "Feasibility" in dims


def test_build_boardroom_result_strengths_and_weaknesses():
    result = build_boardroom_result(_completed_state())
    assert len(result.strengths) > 0
    assert len(result.weaknesses) > 0


def test_build_boardroom_result_raises_without_synthesis():
    state = _completed_state()
    state["synthesis_output"] = None
    with pytest.raises(ValueError, match="synthesis_output is missing"):
        build_boardroom_result(state)


def test_build_boardroom_result_is_json_serialisable():
    """result.model_dump() must be JSON-serialisable (no datetime issues)."""
    result = build_boardroom_result(_completed_state())
    dumped = result.model_dump()
    serialised = json.dumps(dumped, default=str)
    assert "IBM Granite" in serialised


# ---------------------------------------------------------------------------
# Full graph end-to-end — 7 agents + BoardroomResult validation
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_full_graph_produces_valid_boardroom_result():
    """End-to-end: invoke graph with mocked Granite → build + validate BoardroomResult."""
    seed = _full_state()
    config = {"configurable": {"thread_id": str(uuid.uuid4())}}

    with patch("app.agents.base.generate", _mock_generate_all()):
        final_state = await debate_graph.ainvoke(seed, config=config)

    result = build_boardroom_result(final_state)

    assert isinstance(result, BoardroomResult)
    assert result.ai_engine == "IBM Granite"
    assert result.overall_recommendation == "Build"
    assert len(result.debate) == 8
    assert len(result.scored_dimensions) == 5
    assert result.fallback_used is False
