from __future__ import annotations

import uuid
from datetime import datetime

# Use Uuid type which works across PostgreSQL (native UUID) and SQLite (VARCHAR)
from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------
class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    raw_idea: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="active"
    )  # active | archived
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ---------------------------------------------------------------------------
    # Workflow / Stage Handoff fields (Sprint 3)
    # ---------------------------------------------------------------------------
    # Niche / content category (e.g. "Documentary / Investigative", "Gaming")
    niche: Mapped[str | None] = mapped_column(String(100), nullable=True)
    # Output format (e.g. "Long-form YouTube video", "YouTube Short")
    format: Mapped[str | None] = mapped_column(String(100), nullable=True)
    # Team composition (solo | creator-editor | team | agency | client)
    team_mode: Mapped[str] = mapped_column(String(50), nullable=False, default="solo")
    # Workflow profile preset (Quick Creator | Standard Production | Evidence-Heavy
    #                          | Capture-First | Agency / Client | Custom)
    workflow_profile: Mapped[str] = mapped_column(
        String(100), nullable=False, default="Standard Production"
    )
    # The currently active stage name (Strategy | Research | Script | Production
    #                                   | Edit | Review | Publish | Analytics)
    current_stage: Mapped[str] = mapped_column(String(50), nullable=False, default="Strategy")
    # Full ordered list of stage objects: [{name, status, completed_at, gates_passed}, ...]
    workflow_stages: Mapped[list | None] = mapped_column(JSON, nullable=True)
    # Arbitrary project context: audience, goals, constraints, available_assets, etc.
    project_metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # relationships
    sessions: Mapped[list[BoardroomSession]] = relationship(
        "BoardroomSession", back_populates="project", cascade="all, delete-orphan"
    )
    scorecards: Mapped[list[Scorecard]] = relationship(
        "Scorecard", back_populates="project", cascade="all, delete-orphan"
    )
    idea_versions: Mapped[list[IdeaVersion]] = relationship(
        "IdeaVersion", back_populates="project", cascade="all, delete-orphan"
    )


# ---------------------------------------------------------------------------
# BoardroomSession
# ---------------------------------------------------------------------------
class BoardroomSession(Base):
    __tablename__ = "boardroom_sessions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending"
    )  # pending | running | completed | failed
    agent_sequence: Mapped[list | None] = mapped_column(JSON, nullable=True)
    fallback_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # full BoardroomResult
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # relationships
    project: Mapped[Project] = relationship("Project", back_populates="sessions")
    messages: Mapped[list[AgentMessage]] = relationship(
        "AgentMessage", back_populates="session", cascade="all, delete-orphan"
    )
    scorecards: Mapped[list[Scorecard]] = relationship(
        "Scorecard", back_populates="session", cascade="all, delete-orphan"
    )
    follow_ups: Mapped[list[FollowUp]] = relationship(
        "FollowUp", back_populates="session", cascade="all, delete-orphan"
    )


# ---------------------------------------------------------------------------
# AgentMessage
# ---------------------------------------------------------------------------
class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("boardroom_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)  # agent | user | system
    content: Mapped[dict] = mapped_column(JSON, nullable=False)  # structured agent output
    sequence_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # relationships
    session: Mapped[BoardroomSession] = relationship("BoardroomSession", back_populates="messages")


# ---------------------------------------------------------------------------
# Scorecard
# ---------------------------------------------------------------------------
class Scorecard(Base):
    __tablename__ = "scorecards"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("boardroom_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    scores: Mapped[dict] = mapped_column(JSON, nullable=False)  # dimension -> {score, reason}
    overall_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # relationships
    project: Mapped[Project] = relationship("Project", back_populates="scorecards")
    session: Mapped[BoardroomSession] = relationship(
        "BoardroomSession", back_populates="scorecards"
    )


# ---------------------------------------------------------------------------
# IdeaVersion
# ---------------------------------------------------------------------------
class IdeaVersion(Base):
    __tablename__ = "idea_versions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    version_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    refined_idea: Mapped[str] = mapped_column(Text, nullable=False)
    pivot_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # relationships
    project: Mapped[Project] = relationship("Project", back_populates="idea_versions")


# ---------------------------------------------------------------------------
# FollowUp
# ---------------------------------------------------------------------------
class FollowUp(Base):
    __tablename__ = "follow_ups"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("boardroom_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_input: Mapped[str] = mapped_column(Text, nullable=False)
    agent_responses: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # relationships
    session: Mapped[BoardroomSession] = relationship(
        "BoardroomSession", back_populates="follow_ups"
    )
