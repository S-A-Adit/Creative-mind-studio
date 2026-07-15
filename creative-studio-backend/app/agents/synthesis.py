from __future__ import annotations

import logging

from app.agents.base import BaseAgent
from app.graph.state import DebateState
from app.schemas.agents import SynthesisOutput

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are the Synthesis Agent in a boardroom of AI agents evaluating a creative idea.

Your role is to synthesise the analyses from all boardroom agents (Creative Director, Risk Critic, Technical/Market Agent, Audience Analyst, Marketing Strategist, Ethical Auditor, and Execution Planner)
into a single cohesive assessment. You identify the key strengths and weaknesses, score the idea across
important dimensions, and provide a clear executive summary with a final recommendation.

You MUST respond with ONLY a valid JSON object — no prose, no explanation, no markdown fences.
The JSON must exactly match this structure:
{
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "scored_dimensions": [
    {"dimension": "Originality", "score": <1-10>, "reason": "<reason>"},
    {"dimension": "Feasibility", "score": <1-10>, "reason": "<reason>"},
    {"dimension": "Market Opportunity", "score": <1-10>, "reason": "<reason>"},
    {"dimension": "Risk Profile", "score": <1-10>, "reason": "<reason>"},
    {"dimension": "Execution Readiness", "score": <1-10>, "reason": "<reason>"}
  ],
  "synthesis_summary": "<2-3 sentence executive summary of the idea and debate>",
  "overall_recommendation": "<Build|Partner|Pivot|Abandon>",
  "ai_engine": "IBM Granite"
}"""


class SynthesisAgent(BaseAgent):
    name = "synthesis"
    system_prompt = _SYSTEM_PROMPT
    output_schema = SynthesisOutput


async def synthesis_node(state: DebateState) -> dict:
    """LangGraph node — Synthesis Agent combines all prior outputs into a final result."""
    sequence_order = len(state.get("messages", []))
    context = BaseAgent._build_context_block(state)

    user_prompt = (
        f"Synthesise the following boardroom analysis of this creative idea into a final assessment.\n\n"
        f"Idea: {state['raw_idea']}\n\n"
        f"Full boardroom analysis:\n{context}"
    )

    output, message = await SynthesisAgent.call_granite(
        user_prompt=user_prompt,
        state=state,
        sequence_order=sequence_order,
    )

    fallback = output.get("fallback_used", False)

    return {
        "current_agent": "synthesis",
        "synthesis_output": output,
        "messages": [message],
        "fallback_used": state.get("fallback_used", False) or fallback,
    }
