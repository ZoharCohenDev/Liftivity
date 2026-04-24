# cv-service — api

This folder needs to be implemented with the FastAPI route definitions for the Computer Vision service.

## What to implement

- `router.py` — main APIRouter with CV analysis endpoints
- `POST /analyze` — accepts a screenshot URL or base64 image, returns visual analysis results
- `GET /health` — health check endpoint (already stubbed in `main.py`)

Routes should validate input via Pydantic models defined in `../models/` and delegate processing to `../pipelines/`.
