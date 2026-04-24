# nlp-service — core

This folder needs to be implemented with the core configuration and dependency injection for the NLP service.

## What to implement

- `config.py` — app settings loaded from environment variables (model names, API keys, thresholds)
- `dependencies.py` — FastAPI dependency providers (e.g. spaCy/transformers model loading)
- `logging.py` — structured logging setup
