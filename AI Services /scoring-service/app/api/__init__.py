"""API layer — collect and expose all routers."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
def ping() -> dict:
    return {"pong": True}
