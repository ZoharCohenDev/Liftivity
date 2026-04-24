# cv-service — pipelines

This folder needs to be implemented with end-to-end Computer Vision processing pipelines.

## What to implement

- `cv_pipeline.py` — main pipeline: screenshot → feature extraction → scoring → structured result
- `preprocessor.py` — image loading, resizing, format normalization before feature extraction
- `aggregator.py` — combines individual feature scores into a weighted composite CV score
