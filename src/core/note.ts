export enum Note {C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B}

export const allNotes = () => {
  return [Note.C, Note.Db, Note.D, Note.Eb, Note.E, Note.F, Note.Gb, Note.G, Note.Ab, Note.A, Note.Bb, Note.B];
};

export const noteName = (note: Note) => {
  switch (note) {
  case Note.C: return 'C';
  case Note.Db: return 'Db / C#';
  case Note.D: return 'D';
  case Note.Eb: return 'Eb / D#';
  case Note.E: return 'E';
  case Note.F: return 'F';
  case Note.Gb: return 'Gb / F#';
  case Note.G: return 'G';
  case Note.Ab: return 'Ab / G#';
  case Note.A: return 'A';
  case Note.Bb: return 'Bb / A#';
  case Note.B: return 'B';
  }
};
