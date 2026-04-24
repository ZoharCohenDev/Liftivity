# AI Services

This folder contains the three standalone Python microservices that power Liftivity's AI analysis pipeline.

| Service | Purpose |
|---|---|
| `cv-service` | Computer Vision — screenshot analysis, layout scoring, visual hierarchy detection |
| `nlp-service` | Natural Language Processing — copy analysis, CTA extraction, readability scoring |
| `scoring-service` | Aggregates CV and NLP outputs into a unified conversion score |

Each service is a self-contained FastAPI app with its own `Dockerfile`, `requirements.txt`, and internal structure.
