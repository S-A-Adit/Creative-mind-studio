# API Contract — MVP

## POST /api/projects
Request:
```json
{
  "title": "AI Documentary Idea",
  "raw_idea": "I want to create a video about AI replacing jobs.",
  "category": "content_video",
  "target_audience": ["Gen Z", "Students"],
  "goal": "validate_and_plan",
  "budget": "low",
  "timeline": "7 days",
  "team_size": 2,
  "selected_agents": ["creative_director", "risk_critic", "technical_market"]
}
```

Response:
```json
{"project_id":"uuid","status":"created"}
```

## POST /api/projects/{project_id}/boardroom
Response:
```json
{
  "project_id": "uuid",
  "status": "completed",
  "ai_engine": "IBM Granite",
  "fallback_used": false,
  "debate": [],
  "strengths": [],
  "weaknesses": [],
  "open_questions": [],
  "scores": {},
  "ethical_audit": {},
  "refined_idea": "",
  "roadmap": []
}
```

## Rules
- Return valid JSON only
- Validate with Pydantic
- Frontend never parses raw model output
- Every score includes a reason
- Every criticism includes an improvement
