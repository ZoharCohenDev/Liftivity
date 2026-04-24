# scoring-service — pipelines

This folder needs to be implemented with the end-to-end scoring pipeline.

## What to implement

- `scoring_pipeline.py` — main pipeline: CV result + NLP result → weighted scoring → final report
- `issue_detector.py` — identify specific issues from score drops and generate fix recommendations
- `report_builder.py` — assemble the final structured report sent back to the backend API
