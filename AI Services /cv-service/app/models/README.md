# cv-service — models

This folder needs to be implemented with Pydantic data models for the Computer Vision service.

## What to implement

- `request.py` — input schemas (`AnalyzeRequest` with URL or base64 image field)
- `response.py` — output schemas (`CVAnalysisResult`, `VisualScore`, `FeatureResult`)
- `internal.py` — internal data structures used between pipeline stages
