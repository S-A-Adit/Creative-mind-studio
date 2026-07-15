from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle hook."""
    # Startup: nothing heavy yet — DB and Granite clients are lazy-initialised
    yield
    # Shutdown: clean up any open connections here in later sub-tasks


def create_app() -> FastAPI:
    application = FastAPI(
        title="CreativeMind Studio — Silent Killer",
        description=(
            "IBM Granite-powered multi-agent boardroom debate API. "
            "Submit a raw creative idea and receive a structured, validated analysis "
            "from a panel of AI agents powered by IBM watsonx.ai."
        ),
        version=settings.APP_VERSION,
        contact={
            "name": "CreativeMind Studio",
        },
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    from app.api import boardroom, health, projects

    application.include_router(health.router)
    application.include_router(projects.router, prefix="/api")
    application.include_router(boardroom.router, prefix="/api")

    return application


app = create_app()
