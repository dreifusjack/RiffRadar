import { SongRecommendation } from "@/types/api";

interface SongRecommendationsProps {
  recommendations: SongRecommendation[];
}

export default function SongRecommendations({
  recommendations,
}: SongRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20">
        <p className="text-xl text-gray-300">
          No songs found for your chord selection. Try different chords!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white mb-6">
        Recommended Songs for You
      </h2>
      {recommendations.map((song) => (
        <div
          key={song.songId}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">
                {song.songName}
              </h3>
              <p className="text-lg text-gray-300 mb-3">{song.artist}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {song.chords.map((chord, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm font-medium border border-blue-500/50"
                  >
                    {chord}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  Difficulty: {song.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  Match: {(song.similarityScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {song.youtubeTutorial && (
              <div className="flex-shrink-0">
                <a
                  href={song.youtubeTutorial?.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={song.youtubeTutorial.thumbnailUrl}
                    alt={song.youtubeTutorial.thumbnailUrl}
                    className="w-40 h-24 object-cover rounded-lg border-2 border-white/20 hover:border-red-500 transition-all"
                  />
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                      Watch Tutorial
                    </span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
