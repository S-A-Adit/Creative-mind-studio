from __future__ import annotations

TREND_SIGNALS = [
    {"signal": "Hyper-personalized AI assistants", "volume": "high", "growth_rate": "+45%"},
    {
        "signal": "Community-led growth and niche platforms",
        "volume": "medium",
        "growth_rate": "+30%",
    },
    {
        "signal": "Privacy-first tracking and zero-party data",
        "volume": "high",
        "growth_rate": "+60%",
    },
    {
        "signal": "Interactive micro-content and gamified onboarding",
        "volume": "medium",
        "growth_rate": "+25%",
    },
]


def get_trend_signals(raw_idea: str) -> list[dict]:
    """Retrieve trending market signals relevant to the idea."""
    # Return top 2 matching trend signals or default ones
    return TREND_SIGNALS[:2]
