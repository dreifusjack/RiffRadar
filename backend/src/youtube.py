from fastapi import logger
import requests
from src.config import settings


class YouTubeService:
    """Service for calling Youtube API"""

    BASE_URL = "https://www.googleapis.com/youtube/v3/search"

    def __init__(self):
        self.api_key = settings.yt_api_key

    def search_tutorial(self, song_name: str) -> dict | None:
        search_query = f"{song_name} guitar tutorial"
        params = {
            "part": "snippet",
            "maxResults": 1,
            "q": search_query,
            "key": self.api_key,
            "type": "video",
        }
        try:
            response = requests.get(self.BASE_URL, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()

            if data.get("items"):
                video = data["items"][0]
                video_id = video["id"]["videoId"]

                return {
                    "video_id": video_id,
                    "video_url": f"https://www.youtube.com/watch?v={video_id}",
                    "title": video["snippet"]["title"],
                    "thumbnail_url": video["snippet"]["thumbnails"]["high"]["url"],
                }
            else:
                logger.warning(f"No YouTube results found for: {search_query}")
                return None

        except requests.exceptions.RequestException as e:
            logger.error(f"YouTube API error: {e}")
            return None


# Test function
if __name__ == "__main__":
    yt_service = YouTubeService()
    result = yt_service.search_tutorial("Wonderwall")
    print(result)
