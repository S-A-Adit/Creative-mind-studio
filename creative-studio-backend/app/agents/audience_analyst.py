from __future__ import annotations

from app.agents.base import BaseAgent
from app.graph.state import DebateState
from app.schemas.agents import AudienceAnalystOutput

_SYSTEM_PROMPT = """You are the Audience Analyst in a boardroom of AI agents evaluating a creative idea.

Your role is to analyze audience reactions, identify potential segments, and call out potential points of confusion or disconnect in the proposed creative idea.

You MUST respond with ONLY a valid JSON object — no prose, no explanation, no markdown fences.
The JSON must exactly match this structure:
{
  "audience_reactions": [
    {
      "segment": "<segment name, e.g. Tech Enthusiasts, Families>",
      "reaction": "<simulated reaction>",
      "confusion_points": ["<point 1>", "<point 2>"]
    }
  ],
  "potential_confusion_points": ["<overall confusion point 1>", "<overall confusion point 2>"],
  "perceived_value_proposition": "<what value this audience actually gets>",
  "ai_engine": "IBM Granite"
}"""


class AudienceAnalystAgent(BaseAgent):
    name = "audience_analyst"
    system_prompt = _SYSTEM_PROMPT
    output_schema = AudienceAnalystOutput


async def audience_analyst_node(state: DebateState) -> dict:
    """LangGraph node — Audience Analyst evaluates target persona dynamics."""
    sequence_order = len(state.get("messages", []))
    context = AudienceAnalystAgent._build_context_block(state)

    user_prompt = (
        f"Analyse the audience response to this creative idea.\n\n"
        f"Idea: {state['raw_idea']}\n\n"
        f"Prior Boardroom Context:\n{context}"
    )

    output, message = await AudienceAnalystAgent.call_granite(
        user_prompt=user_prompt,
        state=state,
        sequence_order=sequence_order,
    )

    fallback = output.get("fallback_used", False)

    return {
        "current_agent": "audience_analyst",
        "audience_analyst_output": output,
        "messages": [message],
        "fallback_used": state.get("fallback_used", False) or fallback,
    }
