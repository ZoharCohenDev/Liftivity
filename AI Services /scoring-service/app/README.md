# scoring-service — app

This folder needs to be implemented with the Scoring service application logic.

The scoring service aggregates results from `cv-service` and `nlp-service` into a unified conversion score (0–100) for each analyzed website.

## Structure

| Folder | What to implement |
|---|---|
| `api/` | FastAPI router — HTTP endpoints that receive CV + NLP results and return a final score |
| `core/` | App configuration, weight definitions, dependency injection setup |
| `features/` | Score normalization and weighting logic per feature category |
| `models/` | Pydantic request/response schemas for aggregated scores |
| `pipelines/` | Scoring pipeline that combines multi-service results into a final report |

## Entry point

`main.py` — FastAPI app factory and startup logic.
