import { useCallback } from 'react';

interface Note {
  freq: number;
  duration: number;
}

interface Riff {
  notes: Note[];
}

export const useGuitarAudio = () => {
  const GUITAR_RIFFS: Riff[] = [
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

  const synthesizeString = useCallback(
    (
      audioContext: AudioContext,
      freq: number,
      duration: number,
      startTime: number
    ) => {
      const stringLength = audioContext.sampleRate / freq;
      const bufferSize = audioContext.sampleRate * (duration + 0.5);
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      // Noise burst for pluck
      for (let i = 0; i < stringLength * 2; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Karplus-Strong string resonance
      for (let i = Math.floor(stringLength * 2); i < bufferSize; i++) {
        data[i] =
          ((data[i - Math.floor(stringLength)] +
            data[i - Math.floor(stringLength) - 1]) *
            0.5) *
          0.995;
      }

      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Guitar tone filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, startTime);
      filter.frequency.exponentialRampToValueAtTime(900, startTime + duration);
      filter.Q.setValueAtTime(3, startTime);

      gainNode.gain.setValueAtTime(0.4, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.3);

      source.start(startTime);
      source.stop(startTime + duration + 0.5);
    },
    []
  );

  const playGuitarRiff = useCallback(() => {
    const riff = GUITAR_RIFFS[Math.floor(Math.random() * GUITAR_RIFFS.length)];
    const audioContext = new (window.AudioContext ||
      (window).AudioContext)();

    let currentTime = audioContext.currentTime;

    riff.notes.forEach((note) => {
      synthesizeString(audioContext, note.freq, note.duration, currentTime);
      currentTime += note.duration;
    });
  }, [synthesizeString]);

  const playChordSound = useCallback((chord: string) => {
    const audioContext = new (window.AudioContext ||
      (window).AudioContext)();

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

    const isMinor = chord.includes('m') && !chord.includes('7');
    const isSeventh = chord.includes('7');

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
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      // Short noise burst at the beginning (pluck attack)
      for (let i = 0; i < stringLength * 2; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Karplus-Strong loop - simulate string resonance
      for (let i = Math.floor(stringLength * 2); i < bufferSize; i++) {
        data[i] =
          ((data[i - Math.floor(stringLength)] +
            data[i - Math.floor(stringLength) - 1]) *
            0.5) *
          0.996;
      }

      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bright filter that dulls over time (like string damping)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3500, audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(
        800,
        audioContext.currentTime + 1.5
      );
      filter.Q.setValueAtTime(2, audioContext.currentTime);

      // Volume envelope - sharp attack, natural decay
      const volume = 0.25 / intervals.length;
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1.8
      );

      source.start(audioContext.currentTime);
      source.stop(audioContext.currentTime + 1.8);
    });
  }, []);

  return {
    playGuitarRiff,
    playChordSound,
  };
};