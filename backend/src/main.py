from typing import cast
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from scalar_fastapi import get_scalar_api_reference
from src.song_recommendation.router import song_router

app = FastAPI(
    title="Guitar Song Recommendor API", 
    description="API for recommending songs to guitarists.",
    version="1.0",
    docs_url=None,
    redoc_url=None,
    redirect_slashes=False
    )

app.include_router(song_router())

@app.get("/", include_in_schema=False)
async def scalar():
  """Scalar API Docs"""
  return cast(
      HTMLResponse,
      get_scalar_api_reference(
          openapi_url=app.openapi_url,
      ),
  )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


