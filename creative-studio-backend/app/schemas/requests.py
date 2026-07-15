from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Project schemas
# ---------------------------------------------------------------------------
class CreateProjectRequest(BaseModel):
    title: str = Field(min_length=1, max_length=255, description="Project title")
    raw_idea: str = Field(min_length=10, description="The raw creative idea to analyse")


class ProjectResponse(BaseModel):
    id: str
    title: str
    raw_idea: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Boardroom schemas
# ---------------------------------------------------------------------------
class RunBoardroomRequest(BaseModel):
    """Optional overrides for a boardroom run (all have defaults)."""

    pass  # Reserved for future per-run options


class SessionStatusResponse(BaseModel):
    session_id: str
    project_id: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Health schema
# ---------------------------------------------------------------------------
class HealthResponse(BaseModel):
    status: str
    db: str
    granite: str
    version: str
    ai_engine: str = "IBM Granite"
