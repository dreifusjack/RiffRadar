export interface Note {
  freq: number;
  duration: number;
}

export interface Riff {
  notes: Note[];
}