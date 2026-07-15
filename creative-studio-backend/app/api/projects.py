from __future__ import annotations

import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import repository as repo
from app.db.client import get_db
from app.schemas.requests import CreateProjectRequest, ProjectResponse

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Projects"])


def _project_to_response(project) -> ProjectResponse:
    return ProjectResponse(
        id=str(project.id),
        title=project.title,
        raw_idea=project.raw_idea,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=201,
    summary="Create project",
    description="Create a new project with a raw creative idea. Returns the stored project.",
)
async def create_project(
    body: CreateProjectRequest,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    project = await repo.create_project(db, title=body.title, raw_idea=body.raw_idea)
    return _project_to_response(project)


@router.get(
    "/projects/{project_id}",
    response_model=ProjectResponse,
    summary="Get project",
    description="Retrieve a project by ID.",
)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    return _project_to_response(project)
