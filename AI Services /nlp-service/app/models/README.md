# nlp-service — models

This folder needs to be implemented with Pydantic data models for the NLP service.

## What to implement

- `request.py` — input schemas (`AnalyzeRequest` with raw HTML or extracted text fields)
- `response.py` — output schemas (`NLPAnalysisResult`, `ReadabilityScore`, `SentimentResult`)
- `internal.py` — internal data structures used between pipeline stages
