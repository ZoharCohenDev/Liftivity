# scoring-service

Python FastAPI service for ML-based exercise scoring — combines CV and NLP signals into form, effort, and progress scores.

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8003
```

## Run with Docker

```bash
docker build -t liftivity-scoring .
docker run -p 8003:8003 liftivity-scoring
```

## Test

```bash
pytest tests/
```
