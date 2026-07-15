from __future__ import annotations

from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env path — works regardless of where the process is started from.
# Checks: project root (creative-studio-backend/.env) then parent (workspace root)
_HERE = Path(__file__).resolve().parent.parent  # creative-studio-backend/
_ENV_FILE = _HERE / ".env" if (_HERE / ".env").exists() else _HERE.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── IBM watsonx.ai ────────────────────────────────────────────────────────
    WATSONX_API_KEY: str
    WATSONX_PROJECT_ID: str
    WATSONX_URL: str = "https://us-south.ml.cloud.ibm.com"
    WATSONX_MODEL_ID: str = "ibm/granite-4-h-small"
    GRANITE_TIMEOUT_SECONDS: int = 60
    GRANITE_MAX_NEW_TOKENS: int = 1024
    GRANITE_TEMPERATURE: float = 0.7

    # ── Supabase / PostgreSQL ─────────────────────────────────────────────────
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    DATABASE_URL: str  # async  (postgresql+asyncpg://...)
    DATABASE_URL_SYNC: str  # sync   (postgresql://...)  — Alembic only

    # ── Application ───────────────────────────────────────────────────────────
    APP_ENV: str = "development"
    DEBUG: bool = False
    APP_VERSION: str = "0.1.0"
    # Stored as a plain string in .env (comma-separated); parsed by validator below
    CORS_ORIGINS: str = "http://localhost:3000"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors(cls, v: object) -> str:
        # Accept both list (programmatic) and comma-string (.env)
        if isinstance(v, list):
            return ",".join(v)
        return str(v)

    @property
    def cors_origins_list(self) -> list[str]:
        """Return CORS origins as a list for use in middleware."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"


settings = Settings()
