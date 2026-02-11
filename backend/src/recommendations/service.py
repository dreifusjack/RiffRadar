from typing import List

from src.schemas import SongRecommendation, YouTubeTutorial
from src.chroma.chroma_client import ChromaDBClient
from src.youtube import YouTubeService


class RecommendationService:
    """Service for handling song recommendations"""

    def __init__(self):
        self.db = ChromaDBClient()
        self.youtube = YouTubeService()

    def generate_recommendations(
        self, chords: List[str], max_results: int = 50
    ) -> List[SongRecommendation]:
        """
        Get song recommendations based on chord progression

        Args:
            chords: List of chords to match
            max_results: Maximum number of recommendations

        Returns:
            List of song recommendations with YouTube tutorials
        """
        # Query Chroma for similar songs
        similar_songs = self.db.query_similar_songs(chords, n_results=max_results)

        recommendations = []

        for song in similar_songs:
            # Get YouTube tutorial for each song
            youtube_data = self.youtube.search_tutorial(song["song_name"])

            similarity_score = round(song["similarity_score"], 3)
            if (similarity_score > .3):
                # Build recommendation object
                recommendation = SongRecommendation(
                    song_id=song["id"],
                    song_name=song["song_name"],
                    artist=song["artist"],
                    chords=song["chords"],
                    difficulty=song["difficulty"],
                    similarity_score=similarity_score,
                    youtube_tutorial=(
                        YouTubeTutorial(**youtube_data) if youtube_data else None
                    ),
                )
                recommendations.append(recommendation)

        return recommendations

    def get_database_stats(self) -> dict:
        """Get statistics about the song database"""
        return {"total_songs": self.db.get_collection_count()}


# Test
if __name__ == "__main__":
    service = RecommendationService()

    # Get recommendations
    test_chords = ["C", "G", "Am", "F"]
    recommendations = service.get_recommendations(test_chords, max_results=3)

    print(f"\nRecommendations for {test_chords}:\n")
    for rec in recommendations:
        print(f"{rec.song_name} by {rec.artist}")
        print(f"  Similarity: {rec.similarity_score}")
        print(f"  Chords: {rec.chords}")
        if rec.youtube_tutorial:
            print(f"  Tutorial: {rec.youtube_tutorial.video_url}")
        print()
