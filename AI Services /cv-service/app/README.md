# cv-service — app

This folder needs to be implemented with the Computer Vision service application logic.

## Structure

| Folder | What to implement |
|---|---|
| `api/` | FastAPI router — HTTP endpoints that receive screenshot/image input and return CV analysis results |
| `core/` | App configuration, settings, dependency injection setup |
| `features/` | Visual feature extractors — layout, whitespace, CTA detection, image-to-text ratio |
| `models/` | Pydantic request/response schemas and internal data models |
| `pipelines/` | End-to-end CV processing pipelines that chain feature extractors together |

## Entry point

`main.py` — FastAPI app factory and startup logic.
