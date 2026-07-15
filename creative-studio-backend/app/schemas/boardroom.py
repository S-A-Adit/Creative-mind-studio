from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field

from app.schemas.agents import (
    ScoredDimension,
)


# ---------------------------------------------------------------------------
# AgentMessage schema (for API responses — mirrors AgentMessageDict)
# ---------------------------------------------------------------------------
class AgentMessageSchema(BaseModel):
    agent_name: str
    role: str
    content: dict[str, Any]
    sequence_order: int


# ---------------------------------------------------------------------------
# BoardroomResult — the top-level validated API response
# ---------------------------------------------------------------------------
class BoardroomResult(BaseModel):
    """
    The complete, validated result of a boardroom debate session.
    The frontend receives this — never raw model text.
    """

    # ── Identity ──────────────────────────────────────────────────────────────
    project_id: str
    session_id: str

    # ── Debate transcript ─────────────────────────────────────────────────────
    debate: list[AgentMessageSchema] = Field(
        description="Full ordered transcript of agent messages"
    )

    # ── Individual agent outputs ──────────────────────────────────────────────
    creative_director: dict[str, Any] = Field(description="Creative Director structured output")
    risk_critic: dict[str, Any] = Field(description="Risk Critic structured output")
    technical_market: dict[str, Any] = Field(description="Technical/Market Agent structured output")

    # ── Synthesis ─────────────────────────────────────────────────────────────
    strengths: list[str] = Field(description="Key strengths identified across all agents")
    weaknesses: list[str] = Field(description="Key weaknesses identified across all agents")
    scored_dimensions: list[ScoredDimension] = Field(
        description="Scored evaluation dimensions with reasons"
    )
    synthesis_summary: str = Field(description="Executive summary from the Synthesis Agent")
    overall_recommendation: str = Field(
        description="Final recommendation: Build | Partner | Pivot | Abandon"
    )

    # ── Meta ──────────────────────────────────────────────────────────────────
    ai_engine: str = Field(default="IBM Granite", description="AI engine used — always IBM Granite")
    fallback_used: bool = Field(default=False, description="True if any agent used fallback")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
