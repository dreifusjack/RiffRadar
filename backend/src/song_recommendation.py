from fastapi import APIRouter

def song_router() -> APIRouter:
  router = APIRouter(prefix="/songs", tags=["Song Recommendation"])
  return router