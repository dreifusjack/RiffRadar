import { Riff } from "@/types/guitar";

export const GUITAR_RIFFS: Riff[] = [
  // Money for Nothing - Dire Straits (opening riff)
  {
    notes: [
      { freq: 196.0, duration: 0.15 }, // G
      { freq: 196.0, duration: 0.15 }, // G
      { freq: 233.08, duration: 0.3 }, // Bb
      { freq: 196.0, duration: 0.15 }, // G
      { freq: 196.0, duration: 0.15 }, // G
      { freq: 233.08, duration: 0.3 }, // Bb
      { freq: 196.0, duration: 0.15 }, // G
      { freq: 174.61, duration: 0.3 }, // F
      { freq: 196.0, duration: 0.4 }, // G
    ],
  },
  // Stairway to Heaven - Led Zeppelin (intro arpeggio)
  {
    notes: [
      { freq: 220.0, duration: 0.35 }, // A
      { freq: 246.94, duration: 0.35 }, // B
      { freq: 261.63, duration: 0.7 }, // C (hold)
      { freq: 246.94, duration: 0.35 }, // B
      { freq: 220.0, duration: 0.35 }, // A
      { freq: 246.94, duration: 0.35 }, // B
      { freq: 293.66, duration: 0.35 }, // D
      { freq: 261.63, duration: 0.35 }, // C
      { freq: 220.0, duration: 0.7 }, // A (hold)
    ],
  },
  // Come As You Are - Nirvana (main riff)
  {
    notes: [
      { freq: 164.81, duration: 0.4 }, // E
      { freq: 164.81, duration: 0.15 }, // E
      { freq: 146.83, duration: 0.4 }, // D
      { freq: 164.81, duration: 0.8 }, // E (hold)
      { freq: 164.81, duration: 0.4 }, // E
      { freq: 164.81, duration: 0.15 }, // E
      { freq: 130.81, duration: 0.4 }, // C
      { freq: 123.47, duration: 0.8 }, // B (hold)
    ],
  },
];
