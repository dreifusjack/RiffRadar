from fastapi import APIRouter, HTTPException, logger

from src.recommendations.service import RecommendationService
from src.schemas import RecommendationResponse, ChordSequence


def song_recommendations_router() -> APIRouter:
    router = APIRouter(prefix="/recommendations", tags=["Song Recommendation"])
    recommendation_service = RecommendationService()

    @router.post("", response_model=RecommendationResponse)
    async def generate_recommendations(request: ChordSequence):
        """
        Get song recommendations based on chord progression
        """
        try:
            recommendations = recommendation_service.generate_recommendations(
                chords=request.chords,
            )

            return RecommendationResponse(
                chords=request.chords,
                recommendations=recommendations,
            )

        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            raise HTTPException(
                status_code=500, detail=f"Failed to generate recommendations: {str(e)}"
            )

    @router.get("/stats")
    async def get_stats():
        """Get database statistics"""
        return recommendation_service.get_database_stats()

    return router
