from __future__ import annotations

from app.agents.base import BaseAgent
from app.graph.state import DebateState
from app.schemas.agents import EthicalAuditorOutput

_SYSTEM_PROMPT = """You are the Ethical & Brand-Safety Auditor in a boardroom of AI agents evaluating a creative idea.

Your role is to perform an ethical audit of the concept, evaluating compliance, sensitivity, safety, and brand risks. You must issue a safety rating (green, amber, or red) and suggest mitigations.

You MUST respond with ONLY a valid JSON object — no prose, no explanation, no markdown fences.
The JSON must exactly match this structure:
{
  "safety_rating": "<green | amber | red>",
  "ethical_concerns": ["<concern 1>", "<concern 2>"],
  "brand_safety_issues": ["<issue 1>", "<issue 2>"],
  "compliance_suggestions": ["<suggestion 1>", "<suggestion 2>"],
  "ai_engine": "IBM Granite"
}"""


class EthicalAuditorAgent(BaseAgent):
    name = "ethical_auditor"
    system_prompt = _SYSTEM_PROMPT
    output_schema = EthicalAuditorOutput


async def ethical_auditor_node(state: DebateState) -> dict:
    """LangGraph node — Ethical Auditor evaluates risks and safety rating."""
    sequence_order = len(state.get("messages", []))
    context = EthicalAuditorAgent._build_context_block(state)

    user_prompt = (
        f"Perform an ethical and brand-safety audit on this creative idea.\n\n"
        f"Idea: {state['raw_idea']}\n\n"
        f"Prior Boardroom Context:\n{context}"
    )

    output, message = await EthicalAuditorAgent.call_granite(
        user_prompt=user_prompt,
        state=state,
        sequence_order=sequence_order,
    )

    fallback = output.get("fallback_used", False)

    return {
        "current_agent": "ethical_auditor",
        "ethical_auditor_output": output,
        "messages": [message],
        "fallback_used": state.get("fallback_used", False) or fallback,
    }
