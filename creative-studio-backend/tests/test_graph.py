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
        "synthesis_output": None,
        "error": None,
        "fallback_used": False,
        "ai_engine": "IBM Granite",
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
    """Returns an AsyncMock that cycles through CD → RC → TM → Synthesis responses."""
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
        "synthesis_output",
        "error",
        "fallback_used",
        "ai_engine",
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
    """Graph should flow through all 4 nodes and return a final state."""
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
    """After full invocation, all three agent output fields must be populated."""
    seed = _seed_state()
    config = {"configurable": {"thread_id": str(uuid.uuid4())}}

    with patch("app.agents.base.generate", _mock_generate()):
        final_state = await debate_graph.ainvoke(seed, config=config)

    assert final_state["creative_director_output"] is not None
    assert final_state["risk_critic_output"] is not None
    assert final_state["technical_market_output"] is not None
    assert final_state["synthesis_output"] is not None
    # 4 messages appended — one per agent including synthesis
    assert len(final_state["messages"]) == 4
