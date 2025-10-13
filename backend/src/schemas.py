from typing import List
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class BaseAPIModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ChordSequence(BaseAPIModel):
    chords: List[str]


class YouTubeTutorial(BaseAPIModel):
    video_id: str
    video_url: str
    title: str
    thumbnail_url: str


class SongRecommendation(BaseAPIModel):
    song_id: str
    song_name: str
    artist: str
    chords: List[str]
    difficulty: str
    similarity_score: float
    youtube_tutorial: YouTubeTutorial | None = None


class RecommendationResponse(BaseAPIModel):
    chords: List[str]  # input chords
    recommendations: List[SongRecommendation]
