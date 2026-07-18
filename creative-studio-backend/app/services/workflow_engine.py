from __future__ import annotations

"""
workflow_engine.py
------------------
Core business logic for the Conditional Stage & Handoff system.

Responsibilities:
1. generate_stages()         — Produces the ordered stage list for a given profile.
2. apply_conditional_rules() — Injects or modifies stages based on project metadata.
3. validate_handoff()        — Checks that all gate conditions are met before advancing.
4. advance_stage()           — Mutates the stage list and updates current_stage.
"""

from datetime import datetime, timezone
from typing import Any

from app.schemas.workflow import (
    HANDOFF_GATES,
    WORKFLOW_PROFILES,
    StageDetail,
)


# ---------------------------------------------------------------------------
# 1. Stage generation
# ---------------------------------------------------------------------------


def generate_stages(
    workflow_profile: str,
    team_mode: str,
    project_metadata: dict[str, Any] | None,
) -> list[dict]:
    """Return the initial stage list for the project based on profile and context.

    Each stage dict shape:
    {
        "name": str,
        "status": "pending" | "active" | "completed" | "skipped",
        "completed_at": str | None,
        "gates_passed": list[str],
        "auto_approved": bool,
    }
    """
    base_stages: list[str] = WORKFLOW_PROFILES.get(
        workflow_profile, WORKFLOW_PROFILES["Standard Production"]
    )

    # Apply conditional injections based on metadata
    if project_metadata:
        base_stages = _inject_conditional_stages(base_stages, project_metadata)

    stages: list[dict] = []
    for i, name in enumerate(base_stages):
        stages.append(
            {
                "name": name,
                # First stage is automatically active; rest are pending
                "status": "active" if i == 0 else "pending",
                "completed_at": None,
                "gates_passed": [],
                # Solo mode: auto-approve internal gates (no client sign-offs needed)
                "auto_approved": team_mode == "solo",
            }
        )

    return stages


def _inject_conditional_stages(
    stages: list[str], metadata: dict[str, Any]
) -> list[str]:
    """Conditionally modify the stage sequence based on project metadata flags."""
    result = list(stages)

    # If legal review is required, ensure 'Review' is present before 'Publish'
    if metadata.get("legal_review_required") and "Review" not in result:
        pub_idx = result.index("Publish") if "Publish" in result else len(result) - 1
        result.insert(pub_idx, "Review")

    # If factual/news content, ensure 'Research' is present before 'Script'
    if metadata.get("has_factual_claims") and "Research" not in result:
        script_idx = result.index("Script") if "Script" in result else 1
        result.insert(script_idx, "Research")

    # Ensure 'Analytics' is appended for Evidence-Heavy / Agency profiles that
    # flag third-party clips (rights tracking is most relevant here)
    if metadata.get("has_third_party_clips") and "Analytics" not in result:
        result.append("Analytics")

    return result


# ---------------------------------------------------------------------------
# 2. Handoff Validation
# ---------------------------------------------------------------------------


def validate_handoff(
    workflow_stages: list[dict],
    team_mode: str,
    from_stage: str,
    to_stage: str,
    handoff_data: dict[str, Any],
) -> tuple[bool, list[str], str]:
    """Validate that a stage transition is legal and all gate conditions are met.

    Returns:
        (ok: bool, gates_passed: list[str], error_message: str)
    """
    # ── 1. Ensure from_stage is currently active ───────────────────────────
    current_names = [s["name"] for s in workflow_stages if s["status"] == "active"]
    if from_stage not in current_names:
        return (
            False,
            [],
            f"Stage '{from_stage}' is not currently active. "
            f"Active stage(s): {current_names}.",
        )

    # ── 2. Ensure to_stage exists in the project's stage sequence ──────────
    all_names = [s["name"] for s in workflow_stages]
    if to_stage not in all_names:
        return (
            False,
            [],
            f"Stage '{to_stage}' is not part of this project's workflow. "
            f"Available stages: {all_names}.",
        )

    # ── 3. Ensure to_stage immediately follows from_stage ──────────────────
    from_idx = all_names.index(from_stage)
    to_idx = all_names.index(to_stage)
    if to_idx != from_idx + 1:
        return (
            False,
            [],
            f"Cannot skip stages. '{to_stage}' must directly follow '{from_stage}'. "
            f"Expected next stage: '{all_names[from_idx + 1] if from_idx + 1 < len(all_names) else 'N/A'}'.",
        )

    # ── 4. Solo mode — auto-approve all gates ──────────────────────────────
    required_gates = HANDOFF_GATES.get((from_stage, to_stage), [])
    if team_mode == "solo":
        # Solo creators skip explicit approvals; gates are auto-satisfied
        return True, required_gates, ""

    # ── 5. Check required gate keys are present in handoff_data ───────────
    missing = [key for key in required_gates if key not in handoff_data]
    if missing:
        return (
            False,
            [],
            f"Handoff from '{from_stage}' to '{to_stage}' requires the following "
            f"data keys that are missing: {missing}. "
            f"Please provide them in the 'handoff_data' payload.",
        )

    gates_passed = list(required_gates)
    return True, gates_passed, ""


# ---------------------------------------------------------------------------
# 3. Stage Advancement
# ---------------------------------------------------------------------------


def advance_stage(
    workflow_stages: list[dict],
    from_stage: str,
    to_stage: str,
    gates_passed: list[str],
    auto_approved: bool,
) -> list[dict]:
    """Mutate workflow_stages to mark from_stage as completed and to_stage as active.

    Returns the updated stages list (new list, not in-place mutation).
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    updated: list[dict] = []

    for stage in workflow_stages:
        s = dict(stage)  # shallow copy to avoid mutating the original
        if s["name"] == from_stage:
            s["status"] = "completed"
            s["completed_at"] = now_iso
            s["gates_passed"] = gates_passed
            s["auto_approved"] = auto_approved
        elif s["name"] == to_stage:
            s["status"] = "active"
        updated.append(s)

    return updated


# ---------------------------------------------------------------------------
# 4. Helper — build StageDetail list from raw JSON
# ---------------------------------------------------------------------------


def parse_stage_details(workflow_stages: list[dict]) -> list[StageDetail]:
    """Convert raw JSON stage dicts back to typed StageDetail objects."""
    result = []
    for s in workflow_stages:
        completed_at: datetime | None = None
        if s.get("completed_at"):
            try:
                completed_at = datetime.fromisoformat(s["completed_at"])
            except ValueError:
                pass
        result.append(
            StageDetail(
                name=s["name"],
                status=s["status"],
                completed_at=completed_at,
                gates_passed=s.get("gates_passed", []),
                auto_approved=s.get("auto_approved", False),
            )
        )
    return result
