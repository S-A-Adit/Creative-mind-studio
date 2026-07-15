from __future__ import annotations

import json
import logging
from typing import Any, Type

from pydantic import BaseModel, ValidationError

from app.graph.state import AgentMessageDict, DebateState
from app.services.granite_client import GraniteResponseError, generate

logger = logging.getLogger(__name__)


class BaseAgent:
    """
    Shared base for all boardroom agents.

    Each agent subclass defines:
      - name          : str — used in messages and logs
      - system_prompt : str — persona + JSON format instruction
      - output_schema : Type[BaseModel] — Pydantic model to validate response
    """

    name: str = "base_agent"
    system_prompt: str = ""
    output_schema: Type[BaseModel] | None = None

    @classmethod
    async def call_granite(
        cls,
        user_prompt: str,
        state: DebateState,
        sequence_order: int,
    ) -> tuple[dict[str, Any], AgentMessageDict]:
        """
        Call IBM Granite with this agent's system prompt + user_prompt.

        Returns:
            (validated_output_dict, agent_message_dict)

        On GraniteResponseError:
            Returns a fallback dict with error info and sets fallback_used flag.
        """
        try:
            response = await generate(
                prompt=user_prompt,
                system=cls.system_prompt,
            )

            # Parse and validate against the output schema
            parsed = json.loads(response.content)

            if cls.output_schema:
                try:
                    validated = cls.output_schema.model_validate(parsed)
                    output_dict = validated.model_dump()
                except ValidationError as ve:
                    logger.warning(
                        "%s output failed Pydantic validation: %s — using raw parsed dict",
                        cls.name,
                        ve,
                    )
                    # Use raw parsed dict rather than failing hard
                    output_dict = parsed
            else:
                output_dict = parsed

            # Always stamp ai_engine
            output_dict["ai_engine"] = "IBM Granite"

            message: AgentMessageDict = {
                "agent_name": cls.name,
                "role": "agent",
                "content": output_dict,
                "sequence_order": sequence_order,
            }

            return output_dict, message

        except GraniteResponseError as e:
            logger.error("%s Granite call failed: %s", cls.name, e)
            fallback_dict = {
                "agent_name": cls.name,
                "error": str(e),
                "fallback_used": True,
                "ai_engine": "IBM Granite",
            }
            message: AgentMessageDict = {
                "agent_name": cls.name,
                "role": "agent",
                "content": fallback_dict,
                "sequence_order": sequence_order,
            }
            return fallback_dict, message

    @classmethod
    def _build_context_block(cls, state: DebateState) -> str:
        """Format previous agent outputs as a readable context block for the next agent."""
        parts = []
        if state.get("creative_director_output"):
            parts.append(
                f"Creative Director analysis:\n{json.dumps(state['creative_director_output'], indent=2)}"
            )
        if state.get("risk_critic_output"):
            parts.append(
                f"Risk Critic analysis:\n{json.dumps(state['risk_critic_output'], indent=2)}"
            )
        if state.get("technical_market_output"):
            parts.append(
                f"Technical/Market analysis:\n{json.dumps(state['technical_market_output'], indent=2)}"
            )
        return "\n\n".join(parts)
