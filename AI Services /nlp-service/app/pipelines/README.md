# nlp-service — pipelines

This folder needs to be implemented with end-to-end NLP processing pipelines.

## What to implement

- `nlp_pipeline.py` — main pipeline: HTML input → text extraction → feature analysis → structured result
- `text_extractor.py` — strips HTML tags and extracts clean text, headings, CTAs separately
- `aggregator.py` — combines individual NLP feature scores into a weighted composite NLP score
