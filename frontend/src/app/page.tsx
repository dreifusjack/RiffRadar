"use client";

import { useRecommendations } from "@/hooks/useRecommendations";
import { useState } from "react";
import { SongRecommendation } from "@/types/api";

const COMMON_CHORDS = [
  "C",
  "D",
  "E",
  "F",
  "G",
  "A",
  "B",
  "Cm",
  "Dm",
  "Em",
  "Fm",
  "Gm",
  "Am",
  "Bm",
  "C7",
  "D7",
  "E7",
  "F7",
  "G7",
  "A7",
  "B7",
];

export default function Home() {
  const [selectedChords, setSelectedChords] = useState<string[]>([]);
  const [customChord, setCustomChord] = useState("");
  const { mutate, data, isPending, isError, error } = useRecommendations();

  const playChordSound = (chord: string) => {
    const audioContext = new (window.AudioContext || window.AudioContext)();

    // Map chord to frequency
    const noteFrequencies: { [key: string]: number } = {
      C: 130.81,
      D: 146.83,
      E: 164.81,
      F: 174.61,
      G: 196.0,
      A: 220.0,
      B: 246.94,
    };

    const rootNote = chord.charAt(0);
    const baseFreq = noteFrequencies[rootNote] || 220;

    // Determine chord type and create harmonics
    const isMinor = chord.includes("m") && !chord.includes("7");
    const isSeventh = chord.includes("7");

    // Define chord intervals
    let intervals = [1, 1.25, 1.5]; // Major triad
    if (isMinor) {
      intervals = [1, 1.189, 1.5]; // Minor triad
    }
    if (isSeventh) {
      intervals.push(1.78); // Add dominant 7th
    }

    intervals.forEach((interval) => {
      const freq = baseFreq * interval;
      const stringLength = audioContext.sampleRate / freq;

      const bufferSize = audioContext.sampleRate * 2;
      const buffer = audioContext.createBuffer(
        1,
        bufferSize,
        audioContext.sampleRate,
      );
      const data = buffer.getChannelData(0);

      for (let i = 0; i < stringLength * 2; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      for (let i = Math.floor(stringLength * 2); i < bufferSize; i++) {
        data[i] =
          (data[i - Math.floor(stringLength)] +
            data[i - Math.floor(stringLength) - 1]) *
          0.5 *
          0.996;
      }

      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3500, audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(
        800,
        audioContext.currentTime + 1.5,
      );
      filter.Q.setValueAtTime(2, audioContext.currentTime);

      const volume = 0.25 / intervals.length;
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1.8,
      );

      source.start(audioContext.currentTime);
      source.stop(audioContext.currentTime + 1.8);
    });
  };

  const toggleChord = (chord: string) => {
    playChordSound(chord);
    if (selectedChords.includes(chord)) {
      setSelectedChords(selectedChords.filter((c) => c !== chord));
    } else {
      setSelectedChords([...selectedChords, chord]);
    }
  };

  const addCustomChord = () => {
    const chord = customChord.trim();
    if (chord && !selectedChords.includes(chord)) {
      setSelectedChords([...selectedChords, chord]);
      setCustomChord("");
    }
  };

  const handleSearch = () => {
    if (selectedChords.length > 0) {
      mutate({ chords: selectedChords });
    }
  };

  const clearChords = () => {
    setSelectedChords([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            🎸 RiffRadar
          </h1>
          <p className="text-xl text-gray-300">
            Enter the chords you know, discover songs you can learn
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Select Your Chords
          </h2>

          {selectedChords.length > 0 && (
            <div className="mb-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-200">
                  Selected Chords ({selectedChords.length}):
                </span>
                <button
                  onClick={clearChords}
                  className="text-xs text-purple-300 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedChords.map((chord) => (
                  <span
                    key={chord}
                    className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {chord}
                    <button
                      onClick={() => toggleChord(chord)}
                      className="hover:text-red-300 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 mb-6">
            {COMMON_CHORDS.map((chord) => (
              <button
                key={chord}
                onClick={() => toggleChord(chord)}
                className={`py-3 px-2 sm:px-4 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  selectedChords.includes(chord)
                    ? "bg-purple-600 text-white scale-95 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {chord}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={customChord}
              onChange={(e) => setCustomChord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomChord()}
              placeholder="Add custom chord (e.g., Cadd9, Fsus4)"
              className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={addCustomChord}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          <button
            onClick={handleSearch}
            disabled={selectedChords.length === 0 || isPending}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedChords.length === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
            }`}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Finding Songs...
              </span>
            ) : (
              "🎵 Find Song Recommendations"
            )}
          </button>
        </div>

        {isError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-red-200">
            <p className="font-semibold">Error loading recommendations</p>
            <p className="text-sm mt-1">{error?.message}</p>
          </div>
        )}

        {data && data.recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">
              Recommended Songs for You
            </h2>
            {data.recommendations.map((song: SongRecommendation) => (
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
        )}

        {data && data.recommendations.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20">
            <p className="text-xl text-gray-300">
              No songs found for your chord selection. Try different chords!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
