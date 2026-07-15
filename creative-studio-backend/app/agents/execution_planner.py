from __future__ import annotations

from app.agents.base import BaseAgent
from app.graph.state import DebateState
from app.schemas.agents import ExecutionPlannerOutput

_SYSTEM_PROMPT = """You are the Execution Planner in a boardroom of AI agents evaluating a creative idea.

Your role is to propose the MVP scope, milestones, and high-level execution roadmap.

You MUST respond with ONLY a valid JSON object — no prose, no explanation, no markdown fences.
The JSON must exactly match this structure:
{
  "mvp_scope": ["<feature 1>", "<feature 2>"],
  "key_milestones": [
    {
      "milestone": "<milestone name, e.g. Design Complete>",
      "target_period": "<target period, e.g. Week 2>"
    }
  ],
  "estimated_timeline": "<estimated timeline, e.g. 3 months>",
  "ai_engine": "IBM Granite"
}"""


class ExecutionPlannerAgent(BaseAgent):
    name = "execution_planner"
    system_prompt = _SYSTEM_PROMPT
    output_schema = ExecutionPlannerOutput


async def execution_planner_node(state: DebateState) -> dict:
    """LangGraph node — Execution Planner designs the MVP execution path."""
    sequence_order = len(state.get("messages", []))
    context = ExecutionPlannerAgent._build_context_block(state)

    user_prompt = (
        f"Design an execution roadmap and MVP scope for this creative idea.\n\n"
        f"Idea: {state['raw_idea']}\n\n"
        f"Prior Boardroom Context:\n{context}"
    )

    output, message = await ExecutionPlannerAgent.call_granite(
        user_prompt=user_prompt,
        state=state,
        sequence_order=sequence_order,
    )

    fallback = output.get("fallback_used", False)

    return {
        "current_agent": "execution_planner",
        "execution_planner_output": output,
        "messages": [message],
        "fallback_used": state.get("fallback_used", False) or fallback,
    }
