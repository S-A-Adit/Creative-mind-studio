from __future__ import annotations

import logging

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph

from app.graph.state import DebateState

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Real agent node functions (imported from agent modules)
# ---------------------------------------------------------------------------
from app.agents.audience_analyst import audience_analyst_node
from app.agents.creative_director import creative_director_node
from app.agents.ethical_auditor import ethical_auditor_node
from app.agents.execution_planner import execution_planner_node
from app.agents.marketing_strategist import marketing_strategist_node
from app.agents.risk_critic import risk_critic_node
from app.agents.synthesis import synthesis_node
from app.agents.technical_market import technical_market_node


# ---------------------------------------------------------------------------
# Conditional routing logic for selective execution (Pivoting)
# ---------------------------------------------------------------------------
def route_start(state: DebateState) -> str:
    """Determine the starting agent. Skips non-pivot agents if pivot_agents is set."""
    pivot_agents = state.get("pivot_agents")
    if not pivot_agents:
        return "creative_director"

    agents_order = [
        "creative_director",
        "risk_critic",
        "technical_market",
        "audience_analyst",
        "marketing_strategist",
        "ethical_auditor",
        "execution_planner",
    ]
    for agent in agents_order:
        if agent in pivot_agents:
            return agent
    return "synthesis"


def route_next(state: DebateState) -> str:
    """Route to the next agent in order, skipping non-pivot agents if pivot_agents is set."""
    current_node = state.get("current_agent")
    agents_order = [
        "creative_director",
        "risk_critic",
        "technical_market",
        "audience_analyst",
        "marketing_strategist",
        "ethical_auditor",
        "execution_planner",
        "synthesis",
    ]
    pivot_agents = state.get("pivot_agents")
    if not pivot_agents:
        try:
            current_idx = agents_order.index(current_node)
        except ValueError:
            return "synthesis"
        if current_idx + 1 < len(agents_order):
            return agents_order[current_idx + 1]
        return END

    try:
        current_idx = agents_order.index(current_node)
    except ValueError:
        return "synthesis"

    for next_node in agents_order[current_idx + 1 :]:
        if next_node == "synthesis" or next_node in pivot_agents:
            return next_node
    return END


# ---------------------------------------------------------------------------
# Graph definition
# ---------------------------------------------------------------------------
def _build_graph() -> StateGraph:
    """
    Sprint 2 debate graph supporting 7 agents and pivot logic.
    """
    graph = StateGraph(DebateState)

    # Register nodes
    graph.add_node("creative_director", creative_director_node)
    graph.add_node("risk_critic", risk_critic_node)
    graph.add_node("technical_market", technical_market_node)
    graph.add_node("audience_analyst", audience_analyst_node)
    graph.add_node("marketing_strategist", marketing_strategist_node)
    graph.add_node("ethical_auditor", ethical_auditor_node)
    graph.add_node("execution_planner", execution_planner_node)
    graph.add_node("synthesis", synthesis_node)

    # Define conditional edges
    graph.add_conditional_edges(START, route_start)
    graph.add_conditional_edges("creative_director", route_next)
    graph.add_conditional_edges("risk_critic", route_next)
    graph.add_conditional_edges("technical_market", route_next)
    graph.add_conditional_edges("audience_analyst", route_next)
    graph.add_conditional_edges("marketing_strategist", route_next)
    graph.add_conditional_edges("ethical_auditor", route_next)
    graph.add_conditional_edges("execution_planner", route_next)

    # Synthesis always goes to END
    graph.add_edge("synthesis", END)

    return graph


# ---------------------------------------------------------------------------
# Compiled graph — module-level singleton
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
        audience_analyst=state.get("audience_analyst_output") or {},
        marketing_strategist=state.get("marketing_strategist_output") or {},
        ethical_auditor=state.get("ethical_auditor_output") or {},
        execution_planner=state.get("execution_planner_output") or {},
        strengths=synthesis.get("strengths", []),
        weaknesses=synthesis.get("weaknesses", []),
        scored_dimensions=scored_dimensions,
        synthesis_summary=synthesis.get("synthesis_summary", ""),
        overall_recommendation=synthesis.get("overall_recommendation", ""),
        ai_engine="IBM Granite",
        fallback_used=state.get("fallback_used", False),
    )

    return result
