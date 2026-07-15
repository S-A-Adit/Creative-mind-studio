from __future__ import annotations

# Curated small trusted library of creative strategy, storytelling, and safety guidelines
STRATEGY_LIBRARY = [
    {
        "title": "Pixar's Storytelling Rule #4",
        "content": "Once upon a time there was ___. Every day, ___. One day ___. Because of that, ___. Because of that, ___. Until finally ___.",
        "category": "storytelling",
    },
    {
        "title": "The Hook, Story, Offer Framework",
        "content": "Grab attention with a powerful pattern-interrupt Hook. Retain them with an emotionally resonant Story. Present the final value Offer.",
        "category": "marketing",
    },
    {
        "title": "Lean Startup MVP Principle",
        "content": "Build the minimum set of features to start learning immediately, not the complete polished system.",
        "category": "creative strategy",
    },
    {
        "title": "Brand Safety Guideline: Inclusivity",
        "content": "Ensure campaigns avoid cultural stereotypes, respect privacy, and use positive, constructive framing.",
        "category": "safety",
    },
]


def retrieve_guidelines(raw_idea: str) -> list[dict]:
    """Retrieve relevant strategy guidelines based on keyword matches in raw_idea."""
    idea_lower = raw_idea.lower()
    matches = []
    for doc in STRATEGY_LIBRARY:
        # Simple RAG: keyword match
        keywords = doc["title"].lower().split() + doc["category"].lower().split()
        if any(kw in idea_lower for kw in keywords) or len(matches) < 2:
            matches.append(doc)
    return matches[:2]
