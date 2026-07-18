from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Workflow profile definitions
# ---------------------------------------------------------------------------

WORKFLOW_PROFILES: dict[str, list[str]] = {
    "Quick Creator": ["Strategy", "Script", "Production", "Edit", "Publish"],
    "Standard Production": [
        "Strategy",
        "Research",
        "Script",
        "Production",
        "Edit",
        "Review",
        "Publish",
    ],
    "Evidence-Heavy": [
        "Strategy",
        "Research",
        "Script",
        "Production",
        "Edit",
        "Review",
        "Publish",
        "Analytics",
    ],
    "Capture-First": [
        "Strategy",
        "Production",
        "Script",
        "Edit",
        "Review",
        "Publish",
    ],
    "Agency / Client": [
        "Strategy",
        "Research",
        "Script",
        "Production",
        "Edit",
        "Review",
        "Publish",
        "Analytics",
    ],
    "Custom": [
        "Strategy",
        "Research",
        "Script",
        "Production",
        "Edit",
        "Review",
        "Publish",
        "Analytics",
    ],
}

# Gates that must be satisfied before transitioning between stages.
# Maps (from_stage, to_stage) -> list of required keys in handoff_data.
HANDOFF_GATES: dict[tuple[str, str], list[str]] = {
    ("Strategy", "Research"): ["approved_brief", "scorecard"],
    ("Research", "Script"): ["research_brief", "evidence_cards", "must_use_facts"],
    ("Script", "Production"): ["approved_segments", "resource_markers"],
    ("Production", "Edit"): ["media_manifest"],
    ("Edit", "Review"): ["rough_cut_version"],
    ("Review", "Publish"): ["approved_master"],
    ("Publish", "Analytics"): [],  # Auto-advance — no explicit gate required
    # Capture-First variant
    ("Strategy", "Production"): ["approved_brief"],
    ("Production", "Script"): ["media_manifest"],
}


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------


class InitializeWorkflowRequest(BaseModel):
    niche: str | None = Field(
        default=None,
        description=(
            "Content niche / category. E.g. 'Documentary / Investigative', 'Gaming', "
            "'Lifestyle / Vlog', 'Educational / Tutorial', 'Comedy / Entertainment', "
            "'News / Current Affairs', 'Brand / Commercial'."
        ),
    )
    format: str | None = Field(
        default=None,
        description=(
            "Intended output format. E.g. 'Long-form YouTube video', 'YouTube Short', "
            "'Podcast', 'Social Clip Pack', 'Film / Feature'."
        ),
    )
    team_mode: str = Field(
        default="solo",
        description="Team composition: solo | creator-editor | team | agency | client",
    )
    workflow_profile: str = Field(
        default="Standard Production",
        description=(
            "Workflow preset that defines the stage sequence. "
            "Options: 'Quick Creator', 'Standard Production', 'Evidence-Heavy', "
            "'Capture-First', 'Agency / Client', 'Custom'."
        ),
    )
    project_metadata: dict[str, Any] | None = Field(
        default=None,
        description=(
            "Optional context dict. Supported keys: "
            "'audience', 'goals', 'constraints', 'available_assets', "
            "'has_factual_claims' (bool), 'has_third_party_clips' (bool), "
            "'legal_review_required' (bool)."
        ),
    )


class StageDetail(BaseModel):
    name: str
    status: str  # pending | active | completed | skipped
    completed_at: datetime | None = None
    gates_passed: list[str] = Field(default_factory=list)
    auto_approved: bool = False


class WorkflowStatusResponse(BaseModel):
    project_id: str
    workflow_profile: str
    team_mode: str
    current_stage: str
    stages: list[StageDetail]


class HandoffRequest(BaseModel):
    from_stage: str = Field(description="The stage being completed")
    to_stage: str = Field(description="The stage to advance into")
    handoff_data: dict[str, Any] = Field(
        default_factory=dict,
        description=(
            "Key/value payload satisfying the handoff gate requirements. "
            "Required keys vary by stage transition — see HANDOFF_GATES."
        ),
    )


class HandoffResponse(BaseModel):
    success: bool
    previous_stage: str
    current_stage: str
    gates_passed: list[str]
    auto_approved: bool = False
    message: str
