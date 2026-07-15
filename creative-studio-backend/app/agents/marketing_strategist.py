from __future__ import annotations

from app.agents.base import BaseAgent
from app.graph.state import DebateState
from app.schemas.agents import MarketingStrategistOutput

_SYSTEM_PROMPT = """You are the Marketing Strategist in a boardroom of AI agents evaluating a creative idea.

Your role is to formulate the core marketing hook, positioning, distribution strategy, and actionable marketing tactics.

You MUST respond with ONLY a valid JSON object — no prose, no explanation, no markdown fences.
The JSON must exactly match this structure:
{
  "primary_hook": "<compelling marketing hook or angle>",
  "positioning_statement": "<how this product should be positioned in the market>",
  "distribution_channels": ["<channel 1>", "<channel 2>"],
  "recommended_marketing_tactics": ["<tactic 1>", "<tactic 2>"],
  "ai_engine": "IBM Granite"
}"""


class MarketingStrategistAgent(BaseAgent):
    name = "marketing_strategist"
    system_prompt = _SYSTEM_PROMPT
    output_schema = MarketingStrategistOutput


async def marketing_strategist_node(state: DebateState) -> dict:
    """LangGraph node — Marketing Strategist evaluates brand positioning."""
    sequence_order = len(state.get("messages", []))
    context = MarketingStrategistAgent._build_context_block(state)

    user_prompt = (
        f"Develop a marketing strategy for this creative idea.\n\n"
        f"Idea: {state['raw_idea']}\n\n"
        f"Prior Boardroom Context:\n{context}"
    )

    output, message = await MarketingStrategistAgent.call_granite(
        user_prompt=user_prompt,
        state=state,
        sequence_order=sequence_order,
    )

    fallback = output.get("fallback_used", False)

    return {
        "current_agent": "marketing_strategist",
        "marketing_strategist_output": output,
        "messages": [message],
        "fallback_used": state.get("fallback_used", False) or fallback,
    }
