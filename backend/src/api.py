from fastapi import APIRouter

from src.recommendations.router import song_recommendations_router

def api_router() -> APIRouter:
  router = APIRouter(prefix="/api")

  router.include_router(song_recommendations_router())

  return router
