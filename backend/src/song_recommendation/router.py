from fastapi import APIRouter, HTTPException, logger

from src.schemas import RecommendationResponse, ChordSequence
from src.song_recommendation.service import RecommendationService

def song_router() -> APIRouter:
  router = APIRouter(prefix="/songs", tags=["Song Recommendation"])
  recommendation_service = RecommendationService()

  @router.get("/recommendations", response_model=RecommendationResponse)
  async def get_recommendations(request: ChordSequence):
      """
      Get song recommendations based on chord progression
      
      - **chords**: List of chords in the progression (e.g., ["C", "G", "Am", "F"])
      - **max_results**: Maximum number of recommendations (1-10)
      """
      try:
          recommendations = recommendation_service.get_recommendations(
              chords=request.chords,
          )
          
          return RecommendationResponse(
              chords=request.chords,
              recommendations=recommendations,
          )
      
      except Exception as e:
          logger.error(f"Error generating recommendations: {e}")
          raise HTTPException(
              status_code=500,
              detail=f"Failed to generate recommendations: {str(e)}"
        )


  @router.get("/stats")
  async def get_stats():
      """Get database statistics"""
      return recommendation_service.get_database_stats()
  
  
  return router