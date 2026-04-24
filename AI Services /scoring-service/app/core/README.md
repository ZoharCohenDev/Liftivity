# scoring-service — core

This folder needs to be implemented with the core configuration for the Scoring service.

## What to implement

- `config.py` — category weight definitions (e.g. visual: 40%, copy: 35%, performance: 25%)
- `dependencies.py` — FastAPI dependency providers
- `weights.py` — configurable scoring weights loaded from environment or config file
