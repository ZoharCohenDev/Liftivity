# cv-service — core

This folder needs to be implemented with the core configuration and dependency injection for the Computer Vision service.

## What to implement

- `config.py` — app settings loaded from environment variables (model paths, thresholds, timeouts)
- `dependencies.py` — FastAPI dependency providers (e.g. ML model loading, shared resources)
- `logging.py` — structured logging setup
