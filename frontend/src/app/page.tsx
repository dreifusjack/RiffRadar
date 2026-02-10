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
  const { playGuitarRiff, playChordSound, isSoundEnabled, toggleSound } =
    useGuitarAudio();

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
          <div className="relative mb-4">
            <h1 className="text-6xl font-bold text-white tracking-tight">
              <button
                onClick={playGuitarRiff}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer inline-block"
                aria-label="Play guitar riff"
              >
                🎸
              </button>{" "}
              RiffRadar
            </h1>
            <button
              onClick={toggleSound}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors border border-white/20"
              aria-label={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
            >
              {isSoundEnabled ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                </>
              )}
            </button>
          </div>
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
