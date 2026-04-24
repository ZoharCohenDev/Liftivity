"""Scoring service entry point — FastAPI application."""
from fastapi import FastAPI
from app.api import router

app = FastAPI(title="liftivity-scoring-service", version="0.1.0")
app.include_router(router, prefix="/api/v1")


@app.get("/health")
def health() -> dict:
    """Health probe used by Docker and load-balancer."""
    return {"status": "ok", "service": "scoring-service"}
