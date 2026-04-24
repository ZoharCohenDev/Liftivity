# nlp-service — api

This folder needs to be implemented with the FastAPI route definitions for the NLP service.

## What to implement

- `router.py` — main APIRouter with NLP analysis endpoints
- `POST /analyze` — accepts page HTML or extracted text, returns NLP analysis results
- `GET /health` — health check endpoint (already stubbed in `main.py`)

Routes should validate input via Pydantic models defined in `../models/` and delegate processing to `../pipelines/`.
