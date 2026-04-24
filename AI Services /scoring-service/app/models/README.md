# scoring-service — models

This folder needs to be implemented with Pydantic data models for the Scoring service.

## What to implement

- `request.py` — input schemas (`ScoreRequest` combining CV and NLP analysis results)
- `response.py` — output schemas (`ScoreResult`, `CategoryScore`, `Issue`, `Recommendation`)
- `internal.py` — intermediate scoring state between pipeline stages
