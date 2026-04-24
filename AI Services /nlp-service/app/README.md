# nlp-service — app

This folder needs to be implemented with the Natural Language Processing service application logic.

## Structure

| Folder | What to implement |
|---|---|
| `api/` | FastAPI router — HTTP endpoints that receive page text/HTML and return NLP analysis results |
| `core/` | App configuration, settings, dependency injection setup |
| `features/` | Text feature extractors — readability, sentiment, CTA copy, keyword density |
| `models/` | Pydantic request/response schemas and internal data models |
| `pipelines/` | End-to-end NLP processing pipelines that chain text analyzers together |

## Entry point

`main.py` — FastAPI app factory and startup logic.
