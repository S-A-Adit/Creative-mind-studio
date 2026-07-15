from __future__ import annotations

from pydantic import BaseModel, Field


class GraniteResponse(BaseModel):
    """Structured response from the IBM Granite client."""

    content: str = Field(description="Parsed JSON string extracted from model output")
    raw: str = Field(description="Raw unprocessed model output text")
    fallback_used: bool = Field(
        default=False, description="True if Granite failed and fallback was activated"
    )
    ai_engine: str = Field(
        default="IBM Granite", description="AI engine identifier — always IBM Granite"
    )
