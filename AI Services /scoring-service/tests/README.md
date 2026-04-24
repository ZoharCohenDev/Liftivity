# scoring-service — tests

This folder needs to be implemented with tests for the Scoring service.

## What to implement

- `test_health.py` — already exists: basic health check test
- `test_scoring_pipeline.py` — unit tests for the full scoring pipeline with mock CV + NLP inputs
- `test_weighter.py` — unit tests for weight application and score normalization
- `test_api.py` — integration tests for FastAPI endpoints using `TestClient`

Run with: `pytest tests/`
