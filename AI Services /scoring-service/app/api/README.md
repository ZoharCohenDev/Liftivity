# scoring-service — api

This folder needs to be implemented with the FastAPI route definitions for the Scoring service.

## What to implement

- `router.py` — main APIRouter with scoring endpoints
- `POST /score` — accepts CV and NLP analysis results, returns the final composite conversion score
- `POST /score/batch` — batch scoring for multiple pages
- `GET /health` — health check endpoint (already stubbed in `main.py`)
