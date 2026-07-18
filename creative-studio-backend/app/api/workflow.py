from __future__ import annotations

import logging
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import repository as repo
from app.db.client import get_db
from app.schemas.workflow import (
    WORKFLOW_PROFILES,
    HandoffRequest,
    HandoffResponse,
    InitializeWorkflowRequest,
    WorkflowStatusResponse,
)
from app.services.workflow_engine import (
    advance_stage,
    generate_stages,
    parse_stage_details,
    validate_handoff,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Workflow"])


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------


def _parse_project_id(project_id: str) -> uuid.UUID:
    try:
        return uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")


# ---------------------------------------------------------------------------
# POST /api/projects/{project_id}/workflow/initialize
# ---------------------------------------------------------------------------


@router.post(
    "/projects/{project_id}/workflow/initialize",
    response_model=WorkflowStatusResponse,
    summary="Initialize or reconfigure a project's workflow",
    description=(
        "Sets the niche, format, team mode, and workflow profile for a project, "
        "then generates the ordered stage pipeline with conditional adjustments. "
        "Re-initializing resets stage progress."
    ),
)
async def initialize_workflow(
    project_id: str,
    body: InitializeWorkflowRequest,
    db: AsyncSession = Depends(get_db),
) -> WorkflowStatusResponse:
    pid = _parse_project_id(project_id)

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    # Validate profile
    if body.workflow_profile not in WORKFLOW_PROFILES:
        raise HTTPException(
            status_code=422,
            detail=(
                f"Unknown workflow_profile '{body.workflow_profile}'. "
                f"Valid options: {list(WORKFLOW_PROFILES.keys())}"
            ),
        )

    # Generate stage list
    stages: list[dict] = generate_stages(
        workflow_profile=body.workflow_profile,
        team_mode=body.team_mode,
        project_metadata=body.project_metadata,
    )
    first_stage = stages[0]["name"] if stages else "Strategy"

    # Persist to DB
    project.niche = body.niche
    project.format = body.format
    project.team_mode = body.team_mode
    project.workflow_profile = body.workflow_profile
    project.current_stage = first_stage
    project.workflow_stages = stages
    project.project_metadata = body.project_metadata or {}
    await db.flush()

    logger.info(
        "Workflow initialized for project %s — profile=%s stages=%s",
        project_id,
        body.workflow_profile,
        [s["name"] for s in stages],
    )

    return WorkflowStatusResponse(
        project_id=project_id,
        workflow_profile=project.workflow_profile,
        team_mode=project.team_mode,
        current_stage=project.current_stage,
        stages=parse_stage_details(stages),
    )


# ---------------------------------------------------------------------------
# GET /api/projects/{project_id}/workflow
# ---------------------------------------------------------------------------


@router.get(
    "/projects/{project_id}/workflow",
    response_model=WorkflowStatusResponse,
    summary="Retrieve current workflow status",
    description=(
        "Returns the workflow profile, current active stage, and the full ordered "
        "list of stages with their status and completed gate information."
    ),
)
async def get_workflow_status(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> WorkflowStatusResponse:
    pid = _parse_project_id(project_id)

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    if not project.workflow_stages:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Project {project_id} has not been initialised with a workflow yet. "
                "Call POST /workflow/initialize first."
            ),
        )

    return WorkflowStatusResponse(
        project_id=project_id,
        workflow_profile=project.workflow_profile,
        team_mode=project.team_mode,
        current_stage=project.current_stage,
        stages=parse_stage_details(project.workflow_stages),
    )


# ---------------------------------------------------------------------------
# POST /api/projects/{project_id}/workflow/handoff
# ---------------------------------------------------------------------------


@router.post(
    "/projects/{project_id}/workflow/handoff",
    response_model=HandoffResponse,
    summary="Advance to the next workflow stage",
    description=(
        "Validates that all gate conditions for the current stage transition are met, "
        "then advances the project to the next stage. "
        "In solo team_mode, gates are auto-approved. "
        "Required handoff_data keys vary by transition — see the API description or "
        "the HANDOFF_GATES constant in app/schemas/workflow.py."
    ),
)
async def stage_handoff(
    project_id: str,
    body: HandoffRequest,
    db: AsyncSession = Depends(get_db),
) -> HandoffResponse:
    pid = _parse_project_id(project_id)

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    if not project.workflow_stages:
        raise HTTPException(
            status_code=400,
            detail=(
                "Workflow has not been initialised for this project. "
                "Call POST /workflow/initialize first."
            ),
        )

    ok, gates_passed, error = validate_handoff(
        workflow_stages=project.workflow_stages,
        team_mode=project.team_mode,
        from_stage=body.from_stage,
        to_stage=body.to_stage,
        handoff_data=body.handoff_data,
    )

    if not ok:
        raise HTTPException(status_code=422, detail=error)

    # Determine whether gates were auto-approved (solo mode)
    auto_approved = project.team_mode == "solo"

    # Advance the stage list
    updated_stages = advance_stage(
        workflow_stages=project.workflow_stages,
        from_stage=body.from_stage,
        to_stage=body.to_stage,
        gates_passed=gates_passed,
        auto_approved=auto_approved,
    )

    # Persist
    project.workflow_stages = updated_stages
    project.current_stage = body.to_stage
    await db.flush()

    logger.info(
        "Stage handoff for project %s: %s → %s (gates: %s, auto: %s)",
        project_id,
        body.from_stage,
        body.to_stage,
        gates_passed,
        auto_approved,
    )

    return HandoffResponse(
        success=True,
        previous_stage=body.from_stage,
        current_stage=body.to_stage,
        gates_passed=gates_passed,
        auto_approved=auto_approved,
        message=(
            f"Successfully advanced from '{body.from_stage}' to '{body.to_stage}'. "
            + (
                f"Gates passed: {gates_passed}."
                if gates_passed
                else "No explicit gates required for this transition."
            )
        ),
    )
