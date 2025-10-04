export interface YouTubeTutorial {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
}

export interface SongRecommendation {
  songId: string;
  songName: string;
  artist: string;
  chords: string[];
  difficulty: string;
  similarityScore: number;
  youtubeTutorial: YouTubeTutorial | null;
}

export interface RecommendationResponse {
  chords: string[];
  recommendations: SongRecommendation[];
}

export interface RecommendationRequest {
  chords: string[];
}