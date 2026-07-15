"""
Tests for LangGraph DebateState and debate_graph.
No real IBM Granite calls — Granite is mocked at the generate() level.
"""

from __future__ import annotations

import json
import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.graph.graph import debate_graph
from app.schemas.granite import GraniteResponse


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _seed_state(raw_idea: str = "An AI-powered meditation app") -> dict:
    """Return a minimal valid seed state dict for invoking the graph."""
    return {
        "project_id": str(uuid.uuid4()),
        "session_id": str(uuid.uuid4()),
        "raw_idea": raw_idea,
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
# Mock Granite responses for each agent
# ---------------------------------------------------------------------------
_CD_JSON = json.dumps(
    {
        "originality_score": 7,
        "emotional_direction": "inspiring",
        "key_themes": ["AI", "travel"],
        "suggestions": ["Add social"],
        "ai_engine": "IBM Granite",
    }
)
_RC_JSON = json.dumps(
    {
        "risks": [{"risk": "competition", "severity": "medium", "mitigation": "niche down"}],
        "critical_assumptions": ["users share data"],
        "overall_risk_level": "medium",
        "ai_engine": "IBM Granite",
    }
)
_TM_JSON = json.dumps(
    {
        "feasibility_score": 8,
        "cost_estimate": "$100k",
        "market_size": "$10B",
        "competitors": ["Google"],
        "recommendation": "Build",
        "rationale": "strong gap",
        "ai_engine": "IBM Granite",
    }
)
_AA_JSON = json.dumps(
    {
        "audience_reactions": [
            {"segment": "Hikers", "reaction": "positive", "confusion_points": ["Offline mode"]}
        ],
        "potential_confusion_points": ["Offline mode"],
        "perceived_value_proposition": "Safety while hiking",
        "ai_engine": "IBM Granite",
    }
)
_MS_JSON = json.dumps(
    {
        "primary_hook": "Never get lost again",
        "positioning_statement": "The hiking app for safety",
        "distribution_channels": ["App Store"],
        "recommended_marketing_tactics": ["Influencers"],
        "ai_engine": "IBM Granite",
    }
)
_EA_JSON = json.dumps(
    {
        "safety_rating": "green",
        "ethical_concerns": [],
        "brand_safety_issues": [],
        "compliance_suggestions": [],
        "ai_engine": "IBM Granite",
    }
)
_EP_JSON = json.dumps(
    {
        "mvp_scope": ["GPS tracking"],
        "key_milestones": [{"milestone": "Beta", "target_period": "Month 1"}],
        "estimated_timeline": "2 months",
        "ai_engine": "IBM Granite",
    }
)

_SY_JSON = json.dumps(
    {
        "strengths": ["Strong originality"],
        "weaknesses": ["High competition"],
        "scored_dimensions": [
            {"dimension": "Originality", "score": 8, "reason": "novel"},
            {"dimension": "Feasibility", "score": 7, "reason": "achievable"},
            {"dimension": "Market Opportunity", "score": 8, "reason": "large TAM"},
            {"dimension": "Risk Profile", "score": 6, "reason": "medium risk"},
            {"dimension": "Execution Readiness", "score": 7, "reason": "clear MVP"},
        ],
        "synthesis_summary": "Promising AI travel app.",
        "overall_recommendation": "Build",
        "ai_engine": "IBM Granite",
    }
)


def _mock_generate():
    """Returns an AsyncMock that cycles through CD → RC → TM → AA → MS → EA → EP → Synthesis responses."""
    responses = [
        GraniteResponse(
            content=_CD_JSON, raw=_CD_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
        GraniteResponse(
            content=_RC_JSON, raw=_RC_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
        GraniteResponse(
            content=_TM_JSON, raw=_TM_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
        GraniteResponse(
            content=_AA_JSON, raw=_AA_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
        GraniteResponse(
            content=_MS_JSON, raw=_MS_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
        GraniteResponse(
            content=_EA_JSON, raw=_EA_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
        GraniteResponse(
            content=_EP_JSON, raw=_EP_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
        GraniteResponse(
            content=_SY_JSON, raw=_SY_JSON, fallback_used=False, ai_engine="IBM Granite"
        ),
    ]
    mock = AsyncMock(side_effect=responses)
    return mock


# ---------------------------------------------------------------------------
# State schema tests
# ---------------------------------------------------------------------------
def test_debate_state_has_required_keys():
    state = _seed_state()
    required_keys = {
        "project_id",
        "session_id",
        "raw_idea",
        "messages",
        "current_agent",
        "creative_director_output",
        "risk_critic_output",
        "technical_market_output",
        "audience_analyst_output",
        "marketing_strategist_output",
        "ethical_auditor_output",
        "execution_planner_output",
        "synthesis_output",
        "error",
        "fallback_used",
        "ai_engine",
        "pivot_agents",
    }
    assert required_keys.issubset(set(state.keys()))


def test_debate_state_initial_values():
    state = _seed_state("Test idea")
    assert state["raw_idea"] == "Test idea"
    assert state["messages"] == []
    assert state["ai_engine"] == "IBM Granite"
    assert state["fallback_used"] is False
    assert state["creative_director_output"] is None
    assert state["synthesis_output"] is None


# ---------------------------------------------------------------------------
# Graph structure tests
# ---------------------------------------------------------------------------
def test_graph_has_correct_nodes():
    nodes = set(debate_graph.nodes.keys())
    assert "creative_director" in nodes
    assert "risk_critic" in nodes
    assert "technical_market" in nodes
    assert "audience_analyst" in nodes
    assert "marketing_strategist" in nodes
    assert "ethical_auditor" in nodes
    assert "execution_planner" in nodes
    assert "synthesis" in nodes


def test_graph_compiles_without_error():
    """Importing and compiling the graph should not raise."""
    from app.graph.graph import debate_graph as g

    assert g is not None


# ---------------------------------------------------------------------------
# Graph invocation tests (end-to-end with stub nodes)
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_graph_runs_end_to_end_with_stubs():
    """Graph should flow through all nodes and return a final state."""
    seed = _seed_state("A social app for remote hikers")
    config = {"configurable": {"thread_id": str(uuid.uuid4())}}

    with patch("app.agents.base.generate", _mock_generate()):
        final_state = await debate_graph.ainvoke(seed, config=config)

    assert final_state["current_agent"] == "synthesis"
    assert final_state["raw_idea"] == "A social app for remote hikers"
    assert final_state["ai_engine"] == "IBM Granite"


@pytest.mark.asyncio
async def test_graph_preserves_project_and_session_ids():
    """project_id and session_id must pass through unchanged."""
    seed = _seed_state()
    pid = seed["project_id"]
    sid = seed["session_id"]
    config = {"configurable": {"thread_id": str(uuid.uuid4())}}

    with patch("app.agents.base.generate", _mock_generate()):
        final_state = await debate_graph.ainvoke(seed, config=config)

    assert final_state["project_id"] == pid
    assert final_state["session_id"] == sid


@pytest.mark.asyncio
async def test_graph_different_threads_are_independent():
    """Two invocations with different thread_ids should not share state."""
    seed_a = _seed_state("Idea A")
    seed_b = _seed_state("Idea B")
    config_a = {"configurable": {"thread_id": str(uuid.uuid4())}}
    config_b = {"configurable": {"thread_id": str(uuid.uuid4())}}

    with patch("app.agents.base.generate", _mock_generate()):
        state_a = await debate_graph.ainvoke(seed_a, config=config_a)
    with patch("app.agents.base.generate", _mock_generate()):
        state_b = await debate_graph.ainvoke(seed_b, config=config_b)

    assert state_a["raw_idea"] == "Idea A"
    assert state_b["raw_idea"] == "Idea B"
    assert state_a["session_id"] != state_b["session_id"]


@pytest.mark.asyncio
async def test_graph_populates_all_agent_outputs():
    """After full invocation, all agent output fields must be populated."""
    seed = _seed_state()
    config = {"configurable": {"thread_id": str(uuid.uuid4())}}

    with patch("app.agents.base.generate", _mock_generate()):
        final_state = await debate_graph.ainvoke(seed, config=config)

    assert final_state["creative_director_output"] is not None
    assert final_state["risk_critic_output"] is not None
    assert final_state["technical_market_output"] is not None
    assert final_state["audience_analyst_output"] is not None
    assert final_state["marketing_strategist_output"] is not None
    assert final_state["ethical_auditor_output"] is not None
    assert final_state["execution_planner_output"] is not None
    assert final_state["synthesis_output"] is not None
    # 8 messages appended — one per agent including synthesis
    assert len(final_state["messages"]) == 8
