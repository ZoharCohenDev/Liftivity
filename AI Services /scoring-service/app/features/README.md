# scoring-service — features

This folder needs to be implemented with score normalization and weighting logic.

## What to implement

- `normalizer.py` — normalize raw feature values from CV/NLP services to 0–100 scale
- `weighter.py` — apply category weights to produce weighted sub-scores
- `benchmarks.py` — industry benchmark comparisons (e.g. "your score vs. e-commerce average")
- `issue_classifier.py` — classify score drops into named issues (e.g. "weak CTA", "poor contrast")
