from __future__ import annotations

import json
import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import repository as repo
from app.db.client import get_db
from app.graph.graph import build_boardroom_result, debate_graph
from app.graph.state import DebateState
from app.schemas.boardroom import BoardroomResult
from app.schemas.requests import RunBoardroomRequest

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Boardroom"])

_AGENT_SEQUENCE = [
    "creative_director",
    "risk_critic",
    "technical_market",
    "audience_analyst",
    "marketing_strategist",
    "ethical_auditor",
    "execution_planner",
    "synthesis",
]


# ---------------------------------------------------------------------------
# POST /projects/{project_id}/boardroom — run the debate
# ---------------------------------------------------------------------------
@router.post(
    "/projects/{project_id}/boardroom",
    response_model=BoardroomResult,
    summary="Run boardroom debate",
    description=(
        "Run the IBM Granite-powered multi-agent boardroom debate for this project. "
        "Synchronous — waits for all agents to complete before returning. "
        "Returns a fully validated BoardroomResult with ai_engine: 'IBM Granite'."
    ),
)
async def run_boardroom(
    project_id: str,
    body: RunBoardroomRequest = RunBoardroomRequest(),
    db: AsyncSession = Depends(get_db),
) -> BoardroomResult:
    # ── Validate project exists ───────────────────────────────────────────────
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    # ── Create session record ─────────────────────────────────────────────────
    session_record = await repo.create_session(db, project_id=pid, agent_sequence=_AGENT_SEQUENCE)
    await repo.update_session_status(db, session_record.id, status="running")

    # ── Build seed state ──────────────────────────────────────────────────────
    seed: DebateState = {
        "project_id": str(pid),
        "session_id": str(session_record.id),
        "raw_idea": project.raw_idea,
        "messages": [],
        "current_agent": "",
        "creative_director_output": None,
        "risk_critic_output": None,
        "technical_market_output": None,
        "audience_analyst_output": None,
        "marketing_strategist_output": None,
        "ethical_auditor_output": None,
        "execution_planner_output": None,
        "synthesis_output": None,
        "error": None,
        "fallback_used": False,
        "ai_engine": "IBM Granite",
        "pivot_agents": None,
    }
    graph_config = {"configurable": {"thread_id": str(session_record.id)}}

    # ── Run the LangGraph debate ──────────────────────────────────────────────
    try:
        final_state = await debate_graph.ainvoke(seed, config=graph_config)
    except Exception as e:
        logger.error("Graph invocation failed for session %s: %s", session_record.id, e)
        await repo.update_session_status(
            db, session_record.id, status="failed", error_message=str(e)
        )
        raise HTTPException(status_code=500, detail=f"Boardroom debate failed: {str(e)}")

    # ── Persist agent messages ────────────────────────────────────────────────
    for msg in final_state.get("messages", []):
        await repo.save_message(
            db,
            session_id=session_record.id,
            agent_name=msg["agent_name"],
            role=msg["role"],
            content=msg["content"],
            sequence_order=msg["sequence_order"],
        )

    # ── Build and validate BoardroomResult ────────────────────────────────────
    try:
        result = build_boardroom_result(final_state)
    except (ValueError, ValidationError) as e:
        logger.error("BoardroomResult validation failed: %s", e)
        await repo.update_session_status(
            db, session_record.id, status="failed", error_message=str(e)
        )
        raise HTTPException(status_code=400, detail=f"Result validation failed: {str(e)}")

    # ── Persist completed session result ──────────────────────────────────────
    result_dict = json.loads(result.model_dump_json())
    await repo.update_session_status(
        db,
        session_record.id,
        status="completed",
        result=result_dict,
        fallback_used=final_state.get("fallback_used", False),
    )

    return result


# ---------------------------------------------------------------------------
# GET /projects/{project_id}/boardroom — retrieve stored debate
# ---------------------------------------------------------------------------
@router.get(
    "/projects/{project_id}/boardroom",
    response_model=BoardroomResult,
    summary="Get boardroom result",
    description="Retrieve the latest completed boardroom debate result for this project.",
)
async def get_boardroom(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> BoardroomResult:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    session_record = await repo.get_latest_session(db, pid)
    if not session_record:
        raise HTTPException(status_code=404, detail="No boardroom session found for this project")

    if session_record.status != "completed":
        raise HTTPException(
            status_code=409,
            detail=f"Latest session is not completed (status: {session_record.status})",
        )

    if not session_record.result:
        raise HTTPException(status_code=500, detail="Session result was not stored correctly")

    # Reconstruct BoardroomResult from stored JSON
    try:
        result = BoardroomResult.model_validate(session_record.result)
    except ValidationError as e:
        raise HTTPException(status_code=500, detail=f"Stored result is invalid: {str(e)}")

    return result
