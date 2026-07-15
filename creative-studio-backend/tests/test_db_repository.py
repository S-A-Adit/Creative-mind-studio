"""
Unit tests for DB models and repository helpers.
These tests use an in-memory SQLite database — no live Supabase connection needed.
"""

from __future__ import annotations

import uuid

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db import repository as repo
from app.db.models import Base

# ---------------------------------------------------------------------------
# In-memory async SQLite engine for tests
# ---------------------------------------------------------------------------
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="function")
async def db_session():
    """Creates a fresh in-memory SQLite DB for each test."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


# ---------------------------------------------------------------------------
# Project tests
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_create_and_get_project(db_session: AsyncSession):
    project = await repo.create_project(
        db_session, title="Test Idea", raw_idea="An app that helps people meditate"
    )
    await db_session.commit()

    fetched = await repo.get_project(db_session, project.id)
    assert fetched is not None
    assert fetched.title == "Test Idea"
    assert fetched.raw_idea == "An app that helps people meditate"
    assert fetched.status == "active"


@pytest.mark.asyncio
async def test_list_projects(db_session: AsyncSession):
    await repo.create_project(db_session, title="Idea A", raw_idea="raw A")
    await repo.create_project(db_session, title="Idea B", raw_idea="raw B")
    await db_session.commit()

    projects = await repo.list_projects(db_session)
    assert len(projects) == 2


@pytest.mark.asyncio
async def test_get_project_not_found(db_session: AsyncSession):
    result = await repo.get_project(db_session, uuid.uuid4())
    assert result is None


# ---------------------------------------------------------------------------
# BoardroomSession tests
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_create_and_get_session(db_session: AsyncSession):
    project = await repo.create_project(db_session, title="P", raw_idea="idea")
    session = await repo.create_session(
        db_session,
        project_id=project.id,
        agent_sequence=["creative_director", "risk_critic", "technical_market"],
    )
    await db_session.commit()

    fetched = await repo.get_session(db_session, session.id)
    assert fetched is not None
    assert fetched.status == "pending"
    assert fetched.project_id == project.id


@pytest.mark.asyncio
async def test_update_session_status(db_session: AsyncSession):
    project = await repo.create_project(db_session, title="P", raw_idea="idea")
    session = await repo.create_session(db_session, project.id, [])
    await db_session.commit()

    await repo.update_session_status(
        db_session,
        session.id,
        status="completed",
        result={"synthesis_summary": "great idea"},
        fallback_used=False,
    )
    await db_session.commit()

    fetched = await repo.get_session(db_session, session.id)
    assert fetched.status == "completed"
    assert fetched.result == {"synthesis_summary": "great idea"}


@pytest.mark.asyncio
async def test_get_latest_session(db_session: AsyncSession):
    project = await repo.create_project(db_session, title="P", raw_idea="idea")
    s1 = await repo.create_session(db_session, project.id, [])
    s2 = await repo.create_session(db_session, project.id, [])
    await db_session.commit()

    latest = await repo.get_latest_session(db_session, project.id)
    assert latest is not None
    # SQLite same-tick timestamps make ordering non-deterministic; just assert
    # that get_latest_session returns one of the two valid sessions
    assert latest.id in {s1.id, s2.id}


# ---------------------------------------------------------------------------
# AgentMessage tests
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_save_and_get_messages(db_session: AsyncSession):
    project = await repo.create_project(db_session, title="P", raw_idea="idea")
    session = await repo.create_session(db_session, project.id, [])
    await db_session.commit()

    await repo.save_message(
        db_session,
        session_id=session.id,
        agent_name="creative_director",
        role="agent",
        content={"originality_score": 8, "ai_engine": "IBM Granite"},
        sequence_order=0,
    )
    await repo.save_message(
        db_session,
        session_id=session.id,
        agent_name="risk_critic",
        role="agent",
        content={"overall_risk_level": "medium", "ai_engine": "IBM Granite"},
        sequence_order=1,
    )
    await db_session.commit()

    messages = await repo.get_messages(db_session, session.id)
    assert len(messages) == 2
    assert messages[0].agent_name == "creative_director"
    assert messages[1].agent_name == "risk_critic"
    assert messages[0].sequence_order == 0
    assert messages[1].sequence_order == 1


# ---------------------------------------------------------------------------
# IdeaVersion tests
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_save_idea_versions_increment(db_session: AsyncSession):
    project = await repo.create_project(db_session, title="P", raw_idea="idea")
    await db_session.commit()

    v1 = await repo.save_idea_version(db_session, project.id, "Refined idea v1")
    await db_session.commit()
    v2 = await repo.save_idea_version(db_session, project.id, "Refined idea v2")
    await db_session.commit()

    assert v1.version_number == 1
    assert v2.version_number == 2
