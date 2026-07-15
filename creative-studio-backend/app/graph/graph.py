from __future__ import annotations

import logging

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph

from app.graph.state import DebateState

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Real agent node functions (imported from agent modules)
# ---------------------------------------------------------------------------
from app.agents.creative_director import creative_director_node
from app.agents.risk_critic import risk_critic_node
from app.agents.synthesis import synthesis_node
from app.agents.technical_market import technical_market_node


# ---------------------------------------------------------------------------
# Graph definition
# ---------------------------------------------------------------------------
def _build_graph() -> StateGraph:
    """
    Sprint 1 debate graph:

        START
          └─▶ creative_director
                └─▶ risk_critic
                      └─▶ technical_market
                              └─▶ synthesis
                                    └─▶ END
    """
    graph = StateGraph(DebateState)

    # Register nodes
    graph.add_node("creative_director", creative_director_node)
    graph.add_node("risk_critic", risk_critic_node)
    graph.add_node("technical_market", technical_market_node)
    graph.add_node("synthesis", synthesis_node)

    # Define linear edges
    graph.add_edge(START, "creative_director")
    graph.add_edge("creative_director", "risk_critic")
    graph.add_edge("risk_critic", "technical_market")
    graph.add_edge("technical_market", "synthesis")
    graph.add_edge("synthesis", END)

    return graph


# ---------------------------------------------------------------------------
# Compiled graph — module-level singleton
# MemorySaver checkpointer allows session state to be resumed by thread_id
# ---------------------------------------------------------------------------
_checkpointer = MemorySaver()
debate_graph = _build_graph().compile(checkpointer=_checkpointer)


def get_graph_png() -> bytes | None:
    """Return a PNG diagram of the graph (requires graphviz). Returns None if unavailable."""
    try:
        return debate_graph.get_graph().draw_mermaid_png()
    except Exception:
        return None


# ---------------------------------------------------------------------------
# BoardroomResult builder — converts final DebateState into validated response
# ---------------------------------------------------------------------------

from app.schemas.boardroom import AgentMessageSchema, BoardroomResult


def build_boardroom_result(state: DebateState) -> BoardroomResult:
    """
    Convert a completed DebateState into a validated BoardroomResult.

    Raises:
        ValueError: if synthesis_output is missing or state is incomplete.
        ValidationError: if the result fails Pydantic validation.
    """
    synthesis = state.get("synthesis_output")
    if not synthesis:
        raise ValueError("synthesis_output is missing — graph may not have completed")

    messages = [
        AgentMessageSchema(
            agent_name=m["agent_name"],
            role=m["role"],
            content=m["content"],
            sequence_order=m["sequence_order"],
        )
        for m in state.get("messages", [])
    ]

    # Extract scored_dimensions safely
    from app.schemas.agents import ScoredDimension

    scored_dimensions = [
        ScoredDimension(**d) if isinstance(d, dict) else d
        for d in synthesis.get("scored_dimensions", [])
    ]

    result = BoardroomResult(
        project_id=state["project_id"],
        session_id=state["session_id"],
        debate=messages,
        creative_director=state.get("creative_director_output") or {},
        risk_critic=state.get("risk_critic_output") or {},
        technical_market=state.get("technical_market_output") or {},
        strengths=synthesis.get("strengths", []),
        weaknesses=synthesis.get("weaknesses", []),
        scored_dimensions=scored_dimensions,
        synthesis_summary=synthesis.get("synthesis_summary", ""),
        overall_recommendation=synthesis.get("overall_recommendation", ""),
        ai_engine="IBM Granite",
        fallback_used=state.get("fallback_used", False),
    )

    return result
