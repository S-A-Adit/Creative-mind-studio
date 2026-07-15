from __future__ import annotations

import logging

from fastapi import APIRouter
from sqlalchemy import text

from app.config import settings
from app.db.client import AsyncSessionLocal
from app.schemas.requests import HealthResponse

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns the status of the backend, database, and IBM Granite connection.",
)
async def health_check() -> HealthResponse:
    # ── DB check ──────────────────────────────────────────────────────────────
    db_status = "ok"
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception as e:
        logger.warning("DB health check failed: %s", e)
        db_status = f"error: {str(e)[:80]}"

    # ── Granite check ─────────────────────────────────────────────────────────
    # Lightweight: just verify the model can be initialised (no actual generation)
    granite_status = "ok"
    try:
        from app.services.granite_client import _get_model

        _get_model()  # initialises the SDK client if not already done
    except Exception as e:
        logger.warning("Granite health check failed: %s", e)
        granite_status = f"error: {str(e)[:80]}"

    overall = "ok" if db_status == "ok" and granite_status == "ok" else "degraded"

    return HealthResponse(
        status=overall,
        db=db_status,
        granite=granite_status,
        version=settings.APP_VERSION,
        ai_engine="IBM Granite",
    )
