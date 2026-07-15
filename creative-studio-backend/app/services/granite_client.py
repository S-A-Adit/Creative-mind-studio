from __future__ import annotations

import asyncio
import json
import logging
import re
from typing import Any

from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference

from app.config import settings
from app.schemas.granite import GraniteResponse

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------
class GraniteResponseError(Exception):
    """Raised when Granite fails to return parseable JSON after all retries."""

    def __init__(self, message: str, raw: str = "") -> None:
        super().__init__(message)
        self.raw = raw


# ---------------------------------------------------------------------------
# Module-level model instance (lazy-initialised on first call)
# ---------------------------------------------------------------------------
_model: ModelInference | None = None


def _get_model() -> ModelInference:
    """Return the singleton ModelInference instance, creating it if needed."""
    global _model
    if _model is None:
        # Always use the watsonx.ai cloud API endpoint — never the dashboard URL
        api_url = settings.WATSONX_URL
        # Auto-correct common mistake: dashboard URL pasted instead of API endpoint
        if "dataplatform.cloud.ibm.com" in api_url or "/wx/home" in api_url:
            api_url = "https://us-south.ml.cloud.ibm.com"
            logger.warning(
                "WATSONX_URL looks like a dashboard URL. "
                "Auto-corrected to API endpoint: %s. "
                "Please update WATSONX_URL in your .env to the correct regional endpoint.",
                api_url,
            )

        credentials = Credentials(
            url=api_url,
            api_key=settings.WATSONX_API_KEY,
        )
        _model = ModelInference(
            model_id=settings.WATSONX_MODEL_ID,
            credentials=credentials,
            project_id=settings.WATSONX_PROJECT_ID,
            # Use max_tokens (chat API standard) — max_new_tokens is for legacy generate_text
            params={
                "max_tokens": settings.GRANITE_MAX_NEW_TOKENS,
                "temperature": settings.GRANITE_TEMPERATURE,
            },
        )
        logger.info(
            "IBM Granite model initialised: %s | url: %s", settings.WATSONX_MODEL_ID, api_url
        )
    return _model


# ---------------------------------------------------------------------------
# JSON extraction helpers
# ---------------------------------------------------------------------------
def _extract_json(text: str) -> str:
    """
    Extract the first complete JSON object from model output.
    1. Try direct parse (model returned clean JSON).
    2. Regex-extract first {...} block and parse.
    3. Attempt one repair pass (strip markdown fences, fix trailing commas).
    4. Raise GraniteResponseError if all attempts fail.
    """
    text = text.strip()

    # Attempt 1 — direct parse
    try:
        json.loads(text)
        return text
    except json.JSONDecodeError:
        pass

    # Attempt 2 — extract first {...} block (handles prose before/after JSON)
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        candidate = match.group(0)
        try:
            json.loads(candidate)
            return candidate
        except json.JSONDecodeError:
            pass

        # Attempt 3 — one repair pass on the extracted block
        repaired = _repair_json(candidate)
        try:
            json.loads(repaired)
            logger.warning("JSON repair succeeded for model output")
            return repaired
        except json.JSONDecodeError:
            pass

    raise GraniteResponseError(
        f"Could not extract valid JSON from model output after all attempts. "
        f"Raw output (first 300 chars): {text[:300]}",
        raw=text,
    )


def _repair_json(text: str) -> str:
    """Best-effort single-pass JSON repair."""
    # Strip markdown code fences
    text = re.sub(r"```(?:json)?", "", text).strip()
    # Remove trailing commas before } or ]
    text = re.sub(r",\s*([}\]])", r"\1", text)
    # Replace single quotes with double quotes (naively)
    text = text.replace("'", '"')
    # Remove control characters
    text = re.sub(r"[\x00-\x1f\x7f]", " ", text)
    return text.strip()


# ---------------------------------------------------------------------------
# Core async generate function
# ---------------------------------------------------------------------------
async def generate(
    prompt: str,
    system: str = "",
    override_params: dict[str, Any] | None = None,
) -> GraniteResponse:
    """
    Call IBM Granite and return a GraniteResponse with parsed JSON content.

    Args:
        prompt:          The user/task prompt sent to the model.
        system:          Optional system instruction prepended to the prompt.
        override_params: Optional per-call parameter overrides (max_new_tokens, etc.)

    Returns:
        GraniteResponse with .content (JSON string), .raw, .fallback_used, .ai_engine

    Raises:
        GraniteResponseError: if Granite fails after retries AND no fallback is available.
                              Callers should catch this and set fallback_used=True.
    """
    model = _get_model()

    # Build full prompt — Granite instruct format
    full_prompt = f"{system}\n\n{prompt}".strip() if system else prompt

    # Apply per-call parameter overrides if provided
    if override_params:
        model.params = {**model.params, **override_params}

    last_error: Exception | None = None

    for attempt in range(1, 3):  # up to 2 retries
        try:
            logger.debug("Granite call attempt %d — model: %s", attempt, settings.WATSONX_MODEL_ID)

            # Run the synchronous SDK call in a thread pool to not block the event loop
            # Use chat() API (new) — falls back to generate_text() for older models
            def _call_model():
                try:
                    # New chat API — works with granite-4 and newer models
                    messages = []
                    if system:
                        messages.append({"role": "system", "content": system})
                    messages.append({"role": "user", "content": prompt})
                    result = model.chat(messages=messages)
                    # Extract text from chat response structure
                    return result["choices"][0]["message"]["content"]
                except Exception:
                    # Fallback to legacy generate_text for older models
                    return model.generate_text(prompt=full_prompt)

            raw_text: str = await asyncio.wait_for(
                asyncio.get_event_loop().run_in_executor(None, _call_model),
                timeout=settings.GRANITE_TIMEOUT_SECONDS,
            )

            logger.debug("Granite raw response length: %d chars", len(raw_text))

            # Extract and validate JSON from the response
            json_content = _extract_json(raw_text)

            return GraniteResponse(
                content=json_content,
                raw=raw_text,
                fallback_used=False,
                ai_engine="IBM Granite",
            )

        except asyncio.TimeoutError:
            logger.warning(
                "Granite call timed out on attempt %d (timeout=%ds)",
                attempt,
                settings.GRANITE_TIMEOUT_SECONDS,
            )
            last_error = asyncio.TimeoutError(
                f"Granite timed out after {settings.GRANITE_TIMEOUT_SECONDS}s"
            )

        except GraniteResponseError:
            # JSON parse failure — no point retrying, raise immediately
            raise

        except Exception as exc:
            logger.warning("Granite transient error on attempt %d: %s", attempt, exc)
            last_error = exc

        # Exponential back-off before retry (0.5s, 1s)
        if attempt < 2:
            await asyncio.sleep(0.5 * attempt)

    # All retries exhausted
    raise GraniteResponseError(
        f"Granite failed after 2 attempts. Last error: {last_error}",
        raw="",
    )
