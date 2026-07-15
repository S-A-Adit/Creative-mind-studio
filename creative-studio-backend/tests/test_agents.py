"""
Unit tests for Sprint 1 agents.
All Granite calls are mocked — no real IBM credentials needed.
"""

from __future__ import annotations

import json
import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.agents.creative_director import creative_director_node
from app.agents.risk_critic import risk_critic_node
from app.agents.technical_market import technical_market_node
from app.graph.state import DebateState
from app.schemas.agents import (
    CreativeDirectorOutput,
    RiskCriticOutput,
    TechnicalMarketOutput,
)
from app.schemas.granite import GraniteResponse
from app.services.granite_client import GraniteResponseError


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------
def _base_state(**overrides) -> DebateState:
    state: DebateState = {
        "project_id": str(uuid.uuid4()),
        "session_id": str(uuid.uuid4()),
        "raw_idea": "An AI app that recommends personalised travel itineraries",
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
    state.update(overrides)
    return state


def _make_granite_response(content: dict) -> GraniteResponse:
    raw = json.dumps(content)
    return GraniteResponse(content=raw, raw=raw, fallback_used=False, ai_engine="IBM Granite")


# ---------------------------------------------------------------------------
# Creative Director tests
# ---------------------------------------------------------------------------
CD_OUTPUT = {
    "originality_score": 8,
    "emotional_direction": "inspiring",
    "key_themes": ["personalisation", "travel", "AI"],
    "suggestions": ["Add social sharing", "Gamify trip planning"],
    "ai_engine": "IBM Granite",
}


@pytest.mark.asyncio
async def test_creative_director_returns_valid_output():
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(CD_OUTPUT)
        result = await creative_director_node(_base_state())

    assert result["current_agent"] == "creative_director"
    assert result["creative_director_output"]["originality_score"] == 8
    assert result["creative_director_output"]["ai_engine"] == "IBM Granite"
    assert len(result["messages"]) == 1
    assert result["messages"][0]["agent_name"] == "creative_director"


@pytest.mark.asyncio
async def test_creative_director_output_validates_pydantic_schema():
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(CD_OUTPUT)
        result = await creative_director_node(_base_state())

    validated = CreativeDirectorOutput.model_validate(result["creative_director_output"])
    assert validated.originality_score == 8
    assert validated.emotional_direction == "inspiring"


@pytest.mark.asyncio
async def test_creative_director_fallback_on_granite_error():
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.side_effect = GraniteResponseError("Granite failed", raw="")
        result = await creative_director_node(_base_state())

    assert result["fallback_used"] is True
    assert result["creative_director_output"]["fallback_used"] is True
    assert result["creative_director_output"]["ai_engine"] == "IBM Granite"


@pytest.mark.asyncio
async def test_creative_director_message_has_correct_structure():
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(CD_OUTPUT)
        result = await creative_director_node(_base_state())

    msg = result["messages"][0]
    assert msg["agent_name"] == "creative_director"
    assert msg["role"] == "agent"
    assert isinstance(msg["content"], dict)
    assert msg["sequence_order"] == 0  # first message in empty transcript


# ---------------------------------------------------------------------------
# Risk Critic tests
# ---------------------------------------------------------------------------
RC_OUTPUT = {
    "risks": [
        {
            "risk": "High competition from Google Maps",
            "severity": "high",
            "mitigation": "Niche down to adventure travel",
        },
        {
            "risk": "Data privacy concerns",
            "severity": "medium",
            "mitigation": "GDPR compliance from day 1",
        },
    ],
    "critical_assumptions": ["Users will share location data", "API costs remain affordable"],
    "overall_risk_level": "medium",
    "ai_engine": "IBM Granite",
}


@pytest.mark.asyncio
async def test_risk_critic_returns_valid_output():
    state = _base_state(creative_director_output=CD_OUTPUT)
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(RC_OUTPUT)
        result = await risk_critic_node(state)

    assert result["current_agent"] == "risk_critic"
    assert result["risk_critic_output"]["overall_risk_level"] == "medium"
    assert result["risk_critic_output"]["ai_engine"] == "IBM Granite"


@pytest.mark.asyncio
async def test_risk_critic_receives_creative_director_context():
    """Risk Critic user_prompt must include Creative Director output."""
    state = _base_state(creative_director_output=CD_OUTPUT)
    captured_prompts = []

    async def capture_generate(prompt, system="", override_params=None):
        captured_prompts.append(prompt)
        return _make_granite_response(RC_OUTPUT)

    with patch("app.agents.base.generate", side_effect=capture_generate):
        await risk_critic_node(state)

    assert len(captured_prompts) == 1
    assert "Creative Director" in captured_prompts[0]


@pytest.mark.asyncio
async def test_risk_critic_output_validates_pydantic_schema():
    state = _base_state(creative_director_output=CD_OUTPUT)
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(RC_OUTPUT)
        result = await risk_critic_node(state)

    validated = RiskCriticOutput.model_validate(result["risk_critic_output"])
    assert validated.overall_risk_level == "medium"
    assert len(validated.risks) == 2


# ---------------------------------------------------------------------------
# Technical/Market Agent tests
# ---------------------------------------------------------------------------
TM_OUTPUT = {
    "feasibility_score": 7,
    "cost_estimate": "$80k-$250k MVP",
    "market_size": "$15B travel tech TAM",
    "competitors": ["Google Travel", "TripAdvisor", "Airbnb Experiences"],
    "recommendation": "Build",
    "rationale": "Strong market gap for AI-personalised itineraries for adventure travellers",
    "ai_engine": "IBM Granite",
}


@pytest.mark.asyncio
async def test_technical_market_returns_valid_output():
    state = _base_state(
        creative_director_output=CD_OUTPUT,
        risk_critic_output=RC_OUTPUT,
    )
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(TM_OUTPUT)
        result = await technical_market_node(state)

    assert result["current_agent"] == "technical_market"
    assert result["technical_market_output"]["feasibility_score"] == 7
    assert result["technical_market_output"]["recommendation"] == "Build"
    assert result["technical_market_output"]["ai_engine"] == "IBM Granite"


@pytest.mark.asyncio
async def test_technical_market_receives_both_prior_contexts():
    """Technical/Market prompt must include both Creative Director and Risk Critic outputs."""
    state = _base_state(
        creative_director_output=CD_OUTPUT,
        risk_critic_output=RC_OUTPUT,
    )
    captured_prompts = []

    async def capture_generate(prompt, system="", override_params=None):
        captured_prompts.append(prompt)
        return _make_granite_response(TM_OUTPUT)

    with patch("app.agents.base.generate", side_effect=capture_generate):
        await technical_market_node(state)

    assert len(captured_prompts) == 1
    assert "Creative Director" in captured_prompts[0]
    assert "Risk Critic" in captured_prompts[0]


@pytest.mark.asyncio
async def test_technical_market_output_validates_pydantic_schema():
    state = _base_state(
        creative_director_output=CD_OUTPUT,
        risk_critic_output=RC_OUTPUT,
    )
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(TM_OUTPUT)
        result = await technical_market_node(state)

    validated = TechnicalMarketOutput.model_validate(result["technical_market_output"])
    assert validated.feasibility_score == 7
    assert validated.recommendation == "Build"


# ---------------------------------------------------------------------------
# Sequence order test
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_message_sequence_order_increments():
    """Each agent should record sequence_order = len(existing messages)."""
    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(CD_OUTPUT)
        result_cd = await creative_director_node(_base_state())

    assert result_cd["messages"][0]["sequence_order"] == 0

    state_after_cd = _base_state(
        creative_director_output=result_cd["creative_director_output"],
        messages=result_cd["messages"],
    )

    with patch("app.agents.base.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = _make_granite_response(RC_OUTPUT)
        result_rc = await risk_critic_node(state_after_cd)

    assert result_rc["messages"][0]["sequence_order"] == 1
