# cv-service

Python FastAPI service for computer vision — pose estimation, rep counting, form analysis from video frames.

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```

## Run with Docker

```bash
docker build -t liftivity-cv .
docker run -p 8002:8002 liftivity-cv
```

## Test

```bash
pytest tests/
```
