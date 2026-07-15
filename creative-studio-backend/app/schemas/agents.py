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


# ---------------------------------------------------------------------------
# Audience Analyst
# ---------------------------------------------------------------------------
class AudienceReaction(BaseModel):
    segment: str = Field(description="Audience segment/persona name")
    reaction: str = Field(description="Simulated reaction of this segment")
    confusion_points: list[str] = Field(description="Points of potential confusion")


class AudienceAnalystOutput(BaseModel):
    audience_reactions: list[AudienceReaction] = Field(
        description="Reactions from different segments"
    )
    potential_confusion_points: list[str] = Field(description="Main confusion points")
    perceived_value_proposition: str = Field(
        description="The value proposition from the audience's perspective"
    )
    ai_engine: str = Field(default="IBM Granite")


# ---------------------------------------------------------------------------
# Marketing Strategist
# ---------------------------------------------------------------------------
class MarketingStrategistOutput(BaseModel):
    primary_hook: str = Field(description="Core marketing hook/angle")
    positioning_statement: str = Field(description="Positioning statement")
    distribution_channels: list[str] = Field(description="Suggested distribution channels")
    recommended_marketing_tactics: list[str] = Field(description="Specific marketing tactics")
    ai_engine: str = Field(default="IBM Granite")


# ---------------------------------------------------------------------------
# Ethical & Brand-Safety Auditor
# ---------------------------------------------------------------------------
class EthicalAuditorOutput(BaseModel):
    safety_rating: str = Field(description="green | amber | red safety rating")
    ethical_concerns: list[str] = Field(description="Identified ethical concerns")
    brand_safety_issues: list[str] = Field(description="Potential brand safety issues")
    compliance_suggestions: list[str] = Field(description="Compliance/mitigation suggestions")
    ai_engine: str = Field(default="IBM Granite")


# ---------------------------------------------------------------------------
# Execution Planner
# ---------------------------------------------------------------------------
class Milestone(BaseModel):
    milestone: str = Field(description="Milestone name")
    target_period: str = Field(description="Target timeline/period")


class ExecutionPlannerOutput(BaseModel):
    mvp_scope: list[str] = Field(description="Proposed MVP scope list")
    key_milestones: list[Milestone] = Field(description="Key execution milestones")
    estimated_timeline: str = Field(description="Estimated overall timeline")
    ai_engine: str = Field(default="IBM Granite")
