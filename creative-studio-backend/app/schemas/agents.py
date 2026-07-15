from __future__ import annotations

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Creative Director
# ---------------------------------------------------------------------------
class CreativeDirectorOutput(BaseModel):
    originality_score: int = Field(ge=1, le=10, description="Originality score 1-10")
    emotional_direction: str = Field(description="Primary emotional tone of the idea")
    key_themes: list[str] = Field(description="Core themes identified in the idea")
    suggestions: list[str] = Field(description="Creative suggestions to strengthen the idea")
    ai_engine: str = Field(default="IBM Granite")


# ---------------------------------------------------------------------------
# Risk Critic
# ---------------------------------------------------------------------------
class RiskItem(BaseModel):
    risk: str = Field(description="Description of the risk")
    severity: str = Field(description="low | medium | high")
    mitigation: str = Field(description="Suggested mitigation strategy")


class RiskCriticOutput(BaseModel):
    risks: list[RiskItem] = Field(description="Identified risks")
    critical_assumptions: list[str] = Field(description="Key assumptions that must hold true")
    overall_risk_level: str = Field(description="low | medium | high")
    ai_engine: str = Field(default="IBM Granite")


# ---------------------------------------------------------------------------
# Technical / Market Agent
# ---------------------------------------------------------------------------
class TechnicalMarketOutput(BaseModel):
    feasibility_score: int = Field(ge=1, le=10, description="Technical feasibility score 1-10")
    cost_estimate: str = Field(description="Rough cost estimate range")
    market_size: str = Field(description="Target market size estimate")
    competitors: list[str] = Field(description="Key existing competitors")
    recommendation: str = Field(description="Build | Partner | Pivot | Abandon")
    rationale: str = Field(description="Reasoning behind the recommendation")
    ai_engine: str = Field(default="IBM Granite")


# ---------------------------------------------------------------------------
# Synthesis
# ---------------------------------------------------------------------------
class ScoredDimension(BaseModel):
    dimension: str
    score: int = Field(ge=1, le=10)
    reason: str


class SynthesisOutput(BaseModel):
    strengths: list[str]
    weaknesses: list[str]
    scored_dimensions: list[ScoredDimension]
    synthesis_summary: str
    overall_recommendation: str
    ai_engine: str = Field(default="IBM Granite")
