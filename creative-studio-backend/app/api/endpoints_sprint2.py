from __future__ import annotations

import json
import logging
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import repository as repo
from app.db.client import get_db
from app.db.models import FollowUp, IdeaVersion
from app.graph.graph import build_boardroom_result, debate_graph
from app.graph.state import DebateState
from app.schemas.boardroom import BoardroomResult
from app.services.granite_client import generate
from app.services.rag import retrieve_guidelines
from app.services.trend_radar import get_trend_signals
from app.services.virality_twin import find_virality_twin

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Sprint 2 API"])

# ── Request / Response Schemas ─────────────────────────────────────────────


class FollowUpRequest(BaseModel):
    user_input: str = Field(description="The user's follow-up question or comment")


class FollowUpResponse(BaseModel):
    user_input: str
    agent_responses: dict[str, Any]


class PivotRequest(BaseModel):
    raw_idea: str = Field(description="The updated creative idea")
    pivot_agents: list[str] = Field(
        default=["creative_director", "risk_critic", "technical_market"],
        description="The list of agent names to re-run",
    )


class RefineResponse(BaseModel):
    refined_idea: str
    version_number: int


# ── Endpoints ─────────────────────────────────────────────────────────────


@router.post(
    "/projects/{project_id}/follow-up",
    response_model=FollowUpResponse,
    summary="Submit user follow-up questions",
)
async def submit_follow_up(
    project_id: str,
    body: FollowUpRequest,
    db: AsyncSession = Depends(get_db),
) -> FollowUpResponse:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    session_record = await repo.get_latest_session(db, pid)
    if not session_record:
        raise HTTPException(status_code=404, detail="No boardroom session found for this project")

    # Call Granite to generate responses to the user's input based on the boardroom result context
    context = json.dumps(session_record.result) if session_record.result else ""
    prompt = (
        f"The user has asked a follow-up question: '{body.user_input}'.\n\n"
        f"Based on this boardroom debate context, provide a helpful response answering their question.\n"
        f"Context:\n{context}\n\n"
        f'Respond in format: {{"reply": "your answer"}}'
    )

    try:
        response = await generate(
            prompt=prompt, system="You are the Synthesis Agent answering follow-ups."
        )
        agent_reply = json.loads(response.content)
    except Exception:
        agent_reply = {
            "reply": f"Thank you for your question. Here is a general assessment: {body.user_input}"
        }

    # Store follow up in DB
    follow_up = FollowUp(
        id=uuid.uuid4(),
        session_id=session_record.id,
        user_input=body.user_input,
        agent_responses=agent_reply,
    )
    db.add(follow_up)
    await db.flush()

    return FollowUpResponse(user_input=body.user_input, agent_responses=agent_reply)


@router.post(
    "/projects/{project_id}/audience-simulation",
    summary="Simulate target persona reactions",
)
async def simulate_audience(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    session_record = await repo.get_latest_session(db, pid)
    if not session_record or not session_record.result:
        raise HTTPException(status_code=404, detail="No completed boardroom session found")

    audience_data = session_record.result.get("audience_analyst", {})
    twin = find_virality_twin(session_record.result.get("raw_idea", ""))

    return {
        "audience_segment_reactions": audience_data.get("audience_reactions", []),
        "potential_confusion_points": audience_data.get("potential_confusion_points", []),
        "virality_twin_match": twin,
    }


@router.post(
    "/projects/{project_id}/scorecard",
    summary="Retrieve project evaluation scorecard",
)
async def get_project_scorecard(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    session_record = await repo.get_latest_session(db, pid)
    if not session_record or not session_record.result:
        raise HTTPException(status_code=404, detail="No completed boardroom session found")

    res = session_record.result
    return {
        "overall_score": sum(d.get("score", 0) for d in res.get("scored_dimensions", []))
        / max(len(res.get("scored_dimensions", [])), 1),
        "scored_dimensions": res.get("scored_dimensions", []),
        "strengths": res.get("strengths", []),
        "weaknesses": res.get("weaknesses", []),
    }


@router.post(
    "/projects/{project_id}/pivot",
    response_model=BoardroomResult,
    summary="Pivot idea and recalculate scope",
)
async def pivot_idea(
    project_id: str,
    body: PivotRequest,
    db: AsyncSession = Depends(get_db),
) -> BoardroomResult:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    # Update project idea
    project.raw_idea = body.raw_idea
    await db.flush()

    # Save idea version
    await repo.save_idea_version(
        db,
        project_id=pid,
        refined_idea=body.raw_idea,
        pivot_notes=f"Pivot re-run for agents: {', '.join(body.pivot_agents)}",
    )

    # Create new session
    agent_sequence = [
        "creative_director",
        "risk_critic",
        "technical_market",
        "audience_analyst",
        "marketing_strategist",
        "ethical_auditor",
        "execution_planner",
        "synthesis",
    ]
    session_record = await repo.create_session(db, project_id=pid, agent_sequence=agent_sequence)
    await repo.update_session_status(db, session_record.id, status="running")

    # Build seed state specifying pivot_agents
    seed: DebateState = {
        "project_id": str(pid),
        "session_id": str(session_record.id),
        "raw_idea": body.raw_idea,
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
        "pivot_agents": body.pivot_agents,
    }
    graph_config = {"configurable": {"thread_id": str(session_record.id)}}

    # Run LangGraph with pivot routing
    try:
        final_state = await debate_graph.ainvoke(seed, config=graph_config)
    except Exception as e:
        logger.error("Pivot Graph execution failed: %s", e)
        await repo.update_session_status(
            db, session_record.id, status="failed", error_message=str(e)
        )
        raise HTTPException(status_code=500, detail=f"Pivot debate failed: {str(e)}")

    # Persist messages
    for msg in final_state.get("messages", []):
        await repo.save_message(
            db,
            session_id=session_record.id,
            agent_name=msg["agent_name"],
            role=msg["role"],
            content=msg["content"],
            sequence_order=msg["sequence_order"],
        )

    # Build response result
    result = build_boardroom_result(final_state)
    result_dict = json.loads(result.model_dump_json())
    await repo.update_session_status(
        db,
        session_record.id,
        status="completed",
        result=result_dict,
        fallback_used=final_state.get("fallback_used", False),
    )

    return result


@router.post(
    "/projects/{project_id}/refine",
    response_model=RefineResponse,
    summary="Generate highly refined creative idea",
)
async def refine_idea(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> RefineResponse:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    session_record = await repo.get_latest_session(db, pid)
    if not session_record or not session_record.result:
        raise HTTPException(status_code=404, detail="No completed boardroom session found")

    idea = session_record.result.get("raw_idea", "")
    synthesis = session_record.result.get("synthesis_summary", "")

    # Call Granite to refine the idea
    prompt = (
        f"Refine the following creative idea into a highly polished, production-ready version based on the boardroom feedback.\n\n"
        f"Idea: {idea}\n"
        f"Feedback Synthesis: {synthesis}\n\n"
        f'Respond in format: {{"refined_idea": "your refined idea description"}}'
    )

    try:
        response = await generate(
            prompt=prompt, system="You are the Synthesis Agent refining creative ideas."
        )
        parsed = json.loads(response.content)
        refined_text = parsed.get("refined_idea", idea)
    except Exception:
        refined_text = f"Refined concept: {idea}"

    # Save new version in DB
    version_record = await repo.save_idea_version(
        db, project_id=pid, refined_idea=refined_text, pivot_notes="Generated via refine endpoint"
    )

    return RefineResponse(refined_idea=refined_text, version_number=version_record.version_number)


@router.post(
    "/projects/{project_id}/roadmap",
    summary="Generate detailed roadmap",
)
async def get_roadmap(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    session_record = await repo.get_latest_session(db, pid)
    if not session_record or not session_record.result:
        raise HTTPException(status_code=404, detail="No completed boardroom session found")

    planner_data = session_record.result.get("execution_planner", {})
    return {
        "mvp_scope": planner_data.get("mvp_scope", []),
        "key_milestones": planner_data.get("key_milestones", []),
        "estimated_timeline": planner_data.get("estimated_timeline", "N/A"),
    }


@router.post(
    "/projects/{project_id}/production-package",
    summary="Generate production package assets",
)
async def generate_production_package(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    session_record = await repo.get_latest_session(db, pid)
    if not session_record or not session_record.result:
        raise HTTPException(status_code=404, detail="No completed boardroom session found")

    idea = session_record.result.get("raw_idea", "")
    synthesis = session_record.result.get("synthesis_summary", "")

    # Call Granite to generate production assets
    prompt = (
        f"Generate production assets (Title, Elevator Pitch, Social Tags) for the following creative concept.\n\n"
        f"Concept: {idea}\n"
        f"Boardroom Summary: {synthesis}\n\n"
        f'Respond in format: {{"title": "...", "elevator_pitch": "...", "social_tags": ["tag1", "tag2"]}}'
    )

    try:
        response = await generate(
            prompt=prompt, system="You are the Marketing and Production Assistant."
        )
        parsed = json.loads(response.content)
    except Exception:
        parsed = {
            "title": "Creative Mind Project",
            "elevator_pitch": "An exciting new creative idea ready for production.",
            "social_tags": ["creative", "design", "startup"],
        }

    return parsed


@router.get(
    "/projects/{project_id}/report",
    summary="Retrieve unified final report",
)
async def get_project_report(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project_id format")

    project = await repo.get_project(db, pid)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    session_record = await repo.get_latest_session(db, pid)

    # Query all versions
    versions_result = await db.execute(
        select(IdeaVersion)
        .where(IdeaVersion.project_id == pid)
        .order_by(IdeaVersion.version_number.desc())
    )
    versions = [
        {
            "version_number": v.version_number,
            "refined_idea": v.refined_idea,
            "created_at": v.created_at,
        }
        for v in versions_result.scalars().all()
    ]

    # Query all follow-ups
    follow_ups = []
    if session_record:
        follow_ups_result = await db.execute(
            select(FollowUp)
            .where(FollowUp.session_id == session_record.id)
            .order_by(FollowUp.created_at.asc())
        )
        follow_ups = [
            {
                "user_input": f.user_input,
                "agent_responses": f.agent_responses,
                "created_at": f.created_at,
            }
            for f in follow_ups_result.scalars().all()
        ]

    # Retrieve RAG context matches
    guidelines = retrieve_guidelines(project.raw_idea)
    trends = get_trend_signals(project.raw_idea)

    return {
        "project": {
            "id": str(project.id),
            "title": project.title,
            "raw_idea": project.raw_idea,
            "status": project.status,
            "created_at": project.created_at,
        },
        "latest_boardroom_session": session_record.result
        if (session_record and session_record.result)
        else None,
        "idea_versions": versions,
        "follow_ups": follow_ups,
        "rag_guidelines": guidelines,
        "market_trends": trends,
    }
