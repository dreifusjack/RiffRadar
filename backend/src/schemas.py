from pydantic import BaseModel


class ChordSequence(BaseModel):
    chords: list[str]


class Song(BaseModel):
    name: str 
    # TODO: fill in the rest
    
    
class RecommendationResponse(BaseModel):
    chords: list[str] # input chords 
    songs: list[Song]