from __future__ import annotations

import operator
from typing import Annotated, Any

from typing_extensions import TypedDict


# ---------------------------------------------------------------------------
# AgentMessageDict — the shape of each entry in the running transcript
# ---------------------------------------------------------------------------
class AgentMessageDict(TypedDict):
    agent_name: str  # e.g. "creative_director"
    role: str  # "agent" | "user" | "system"
    content: dict  # structured agent output (Pydantic model dict)
    sequence_order: int


# ---------------------------------------------------------------------------
# DebateState — shared state passed through every LangGraph node
# ---------------------------------------------------------------------------
class DebateState(TypedDict):
    # ── Identity ──────────────────────────────────────────────────────────────
    project_id: str
    session_id: str
    raw_idea: str

    # ── Running transcript (append-only using operator.add reducer) ───────────
    # We use operator.add (list concatenation) instead of LangChain add_messages
    # because our messages are plain dicts, not LangChain message objects.
    messages: Annotated[list[AgentMessageDict], operator.add]

    # ── Current position in the graph ─────────────────────────────────────────
    current_agent: str

    # ── Per-agent structured outputs (set once, read by downstream agents) ────
    creative_director_output: dict[str, Any] | None
    risk_critic_output: dict[str, Any] | None
    technical_market_output: dict[str, Any] | None
    audience_analyst_output: dict[str, Any] | None
    marketing_strategist_output: dict[str, Any] | None
    ethical_auditor_output: dict[str, Any] | None
    execution_planner_output: dict[str, Any] | None
    synthesis_output: dict[str, Any] | None

    # ── Meta ──────────────────────────────────────────────────────────────────
    error: str | None
    fallback_used: bool
    ai_engine: str  # always "IBM Granite"
    pivot_agents: list[str] | None
