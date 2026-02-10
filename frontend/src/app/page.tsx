"use client";

import { useRecommendations } from "@/hooks/useRecommendations";
import { useGuitarAudio } from "@/hooks/useGuitarAudio";
import { useState } from "react";
import SongRecommendations from "@/components/SongRecommendations";
import { COMMON_CHORDS } from "@/types/constants";

export default function Home() {
  const [selectedChords, setSelectedChords] = useState<string[]>([]);
  const [customChord, setCustomChord] = useState("");
  const { mutate, data, isPending, isError, error } = useRecommendations();
  const { playGuitarRiff, playChordSound } = useGuitarAudio();

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            <button
              onClick={playGuitarRiff}
              className="hover:scale-110 transition-transform duration-200 cursor-pointer inline-block"
              aria-label="Play guitar riff"
            >
              🎸
            </button>{" "}
            RiffRadar
          </h1>
          <p className="text-xl text-gray-300">
            Enter the chords you know, discover songs you can learn
          </p>
        </div>

        {/* Chord Selection */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Select Your Chords
          </h2>

          {/* Selected Chords Display */}
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

          {/* Chord Grid */}
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

          {/* Custom Chord Input */}
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

          {/* Search Button */}
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

        {/* Error State */}
        {isError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-red-200">
            <p className="font-semibold">Error loading recommendations</p>
            <p className="text-sm mt-1">{error?.message}</p>
          </div>
        )}

        {/* Results */}
        {data && <SongRecommendations recommendations={data.recommendations} />}
      </div>
    </div>
  );
}
