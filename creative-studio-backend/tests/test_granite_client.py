"""
Unit tests for the IBM Granite client.
All tests mock the SDK — no real IBM credentials needed.
"""

from __future__ import annotations

import json
from unittest.mock import MagicMock, patch

import pytest

from app.services.granite_client import (
    GraniteResponseError,
    _extract_json,
    _repair_json,
    generate,
)


# ---------------------------------------------------------------------------
# _repair_json unit tests
# ---------------------------------------------------------------------------
def test_repair_strips_markdown_fences():
    raw = '```json\n{"key": "value"}\n```'
    result = _repair_json(raw)
    assert "```" not in result
    assert '"key"' in result


def test_repair_removes_trailing_commas():
    raw = '{"a": 1, "b": 2,}'
    result = _repair_json(raw)
    parsed = json.loads(result)
    assert parsed == {"a": 1, "b": 2}


# ---------------------------------------------------------------------------
# _extract_json unit tests
# ---------------------------------------------------------------------------
def test_extract_json_clean_input():
    text = '{"score": 8, "summary": "great idea"}'
    result = _extract_json(text)
    assert json.loads(result) == {"score": 8, "summary": "great idea"}


def test_extract_json_with_prose_before_and_after():
    text = 'Here is my analysis:\n{"score": 7, "risk": "low"}\nHope that helps!'
    result = _extract_json(text)
    parsed = json.loads(result)
    assert parsed["score"] == 7
    assert parsed["risk"] == "low"


def test_extract_json_with_markdown_fence():
    text = '```json\n{"originality": 9, "themes": ["innovation"]}\n```'
    result = _extract_json(text)
    parsed = json.loads(result)
    assert parsed["originality"] == 9


def test_extract_json_with_trailing_comma():
    text = '{"a": 1, "b": 2,}'
    result = _extract_json(text)
    parsed = json.loads(result)
    assert parsed["a"] == 1


def test_extract_json_raises_on_unparseable():
    text = "This is just plain text with no JSON anywhere."
    with pytest.raises(GraniteResponseError) as exc_info:
        _extract_json(text)
    assert "Could not extract valid JSON" in str(exc_info.value)


def test_extract_json_raises_and_preserves_raw():
    text = "No JSON here at all."
    with pytest.raises(GraniteResponseError) as exc_info:
        _extract_json(text)
    assert exc_info.value.raw == text


# ---------------------------------------------------------------------------
# generate() — mocked SDK tests
# ---------------------------------------------------------------------------
VALID_JSON_RESPONSE = (
    '{"originality_score": 8, "emotional_direction": "inspiring", "ai_engine": "IBM Granite"}'
)
PROSE_WRAPPED_JSON = (
    f"Sure, here is my analysis:\n{VALID_JSON_RESPONSE}\nLet me know if you need more."
)
BROKEN_JSON = "I cannot provide a JSON response right now."
MARKDOWN_JSON = f"```json\n{VALID_JSON_RESPONSE}\n```"


def _make_mock_model(return_value: str):
    """Helper — patches _get_model() to return a mock whose chat() returns the given string."""
    mock_model = MagicMock()
    mock_model.params = {}
    # Mock the chat API response structure
    mock_model.chat.return_value = {"choices": [{"message": {"content": return_value}}]}
    # Also mock generate_text as fallback
    mock_model.generate_text.return_value = return_value
    return mock_model


@pytest.mark.asyncio
async def test_generate_returns_valid_response():
    with patch(
        "app.services.granite_client._get_model", return_value=_make_mock_model(VALID_JSON_RESPONSE)
    ):
        response = await generate(prompt="Analyse this idea: a meditation app")
    assert response.ai_engine == "IBM Granite"
    assert response.fallback_used is False
    parsed = json.loads(response.content)
    assert parsed["originality_score"] == 8


@pytest.mark.asyncio
async def test_generate_extracts_json_from_prose():
    with patch(
        "app.services.granite_client._get_model", return_value=_make_mock_model(PROSE_WRAPPED_JSON)
    ):
        response = await generate(prompt="Analyse this idea")
    parsed = json.loads(response.content)
    assert parsed["originality_score"] == 8
    assert response.raw == PROSE_WRAPPED_JSON


@pytest.mark.asyncio
async def test_generate_extracts_json_from_markdown_fence():
    with patch(
        "app.services.granite_client._get_model", return_value=_make_mock_model(MARKDOWN_JSON)
    ):
        response = await generate(prompt="Analyse this idea")
    parsed = json.loads(response.content)
    assert parsed["originality_score"] == 8


@pytest.mark.asyncio
async def test_generate_raises_granite_response_error_on_broken_output():
    with patch(
        "app.services.granite_client._get_model", return_value=_make_mock_model(BROKEN_JSON)
    ):
        with pytest.raises(GraniteResponseError) as exc_info:
            await generate(prompt="Analyse this idea")
    assert "Could not extract valid JSON" in str(exc_info.value)


@pytest.mark.asyncio
async def test_generate_retries_on_transient_error_then_succeeds():
    """Model fails once with an exception on chat(), then succeeds on second attempt."""
    mock_model = MagicMock()
    mock_model.params = {}
    mock_model.chat.side_effect = [
        Exception("transient network error"),
        {"choices": [{"message": {"content": VALID_JSON_RESPONSE}}]},
    ]
    with patch("app.services.granite_client._get_model", return_value=mock_model):
        response = await generate(prompt="Analyse this idea")
    assert response.fallback_used is False
    assert mock_model.chat.call_count == 2


@pytest.mark.asyncio
async def test_generate_raises_after_all_retries_exhausted():
    """Model fails on every attempt — should raise GraniteResponseError."""
    mock_model = MagicMock()
    mock_model.params = {}
    mock_model.chat.side_effect = Exception("persistent error")
    mock_model.generate_text.side_effect = Exception("persistent error")
    with patch("app.services.granite_client._get_model", return_value=mock_model):
        with pytest.raises(GraniteResponseError) as exc_info:
            await generate(prompt="Analyse this idea")
    assert "failed after 2 attempts" in str(exc_info.value)
    assert mock_model.chat.call_count == 2


@pytest.mark.asyncio
async def test_generate_includes_system_prompt_in_full_prompt():
    """Verify system prompt is passed correctly via the chat messages list."""
    mock_model = MagicMock()
    mock_model.params = {}
    captured_messages = []

    def capture_chat(messages):
        captured_messages.extend(messages)
        return {"choices": [{"message": {"content": VALID_JSON_RESPONSE}}]}

    mock_model.chat = capture_chat

    with patch("app.services.granite_client._get_model", return_value=mock_model):
        await generate(prompt="Analyse this", system="You are a creative director.")

    roles = [m["role"] for m in captured_messages]
    contents = [m["content"] for m in captured_messages]
    assert "system" in roles
    assert "You are a creative director." in contents
    assert "Analyse this" in contents


@pytest.mark.asyncio
async def test_generate_timeout_retries_then_raises():
    """Timeout on every attempt should raise GraniteResponseError."""
    import asyncio as _asyncio

    mock_model = MagicMock()
    mock_model.params = {}

    call_count = 0

    async def slow_executor(executor, fn):
        nonlocal call_count
        call_count += 1
        raise _asyncio.TimeoutError()

    with patch("app.services.granite_client._get_model", return_value=mock_model):
        with patch("asyncio.wait_for", side_effect=_asyncio.TimeoutError):
            with pytest.raises(GraniteResponseError) as exc_info:
                await generate(prompt="slow prompt")
    assert "failed after 2 attempts" in str(exc_info.value)
