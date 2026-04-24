# cv-service — tests

This folder needs to be implemented with tests for the Computer Vision service.

## What to implement

- `test_health.py` — already exists: basic health check test
- `test_cv_pipeline.py` — unit tests for the full CV pipeline with mock images
- `test_features.py` — unit tests for individual feature extractors
- `test_api.py` — integration tests for FastAPI endpoints using `TestClient`

Run with: `pytest tests/`
