# nlp-service — tests

This folder needs to be implemented with tests for the NLP service.

## What to implement

- `test_health.py` — already exists: basic health check test
- `test_nlp_pipeline.py` — unit tests for the full NLP pipeline with mock HTML inputs
- `test_features.py` — unit tests for individual text feature extractors
- `test_api.py` — integration tests for FastAPI endpoints using `TestClient`

Run with: `pytest tests/`
