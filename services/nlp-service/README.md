# nlp-service

Python FastAPI service for natural-language processing — intent detection, exercise parsing, coaching feedback generation.

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Run with Docker

```bash
docker build -t liftivity-nlp .
docker run -p 8001:8001 liftivity-nlp
```

## Test

```bash
pytest tests/
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health probe |
| GET | `/api/v1/ping` | Ping check |
