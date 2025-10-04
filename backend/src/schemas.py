from pydantic import BaseModel


class ChordSequence(BaseModel):
    chords: list[str]


class YouTubeTutorial(BaseModel):
    video_id: str
    video_url: str
    title: str
    thumbnail_url: str

class SongRecommendation(BaseModel):
    song_id: str
    song_name: str
    artist: str
    chords: list[str]
    difficulty: str
    similarity_score: float
    youtube_tutorial: YouTubeTutorial | None = None
    
    
class RecommendationResponse(BaseModel):
    chords: list[str] # input chords 
    recommendations: list[SongRecommendation]