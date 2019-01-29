export enum Sound {C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B}

export const allSounds = () => {
  return [Sound.C, Sound.Db, Sound.D, Sound.Eb, Sound.E, Sound.F, Sound.Gb, Sound.G, Sound.Ab, Sound.A, Sound.Bb, Sound.B];
};

export const soundName = (sound: Sound) => {
  switch (sound) {
  case Sound.C: return 'C';
  case Sound.Db: return 'Db / C#';
  case Sound.D: return 'D';
  case Sound.Eb: return 'Eb / D#';
  case Sound.E: return 'E';
  case Sound.F: return 'F';
  case Sound.Gb: return 'Gb / F#';
  case Sound.G: return 'G';
  case Sound.Ab: return 'Ab / G#';
  case Sound.A: return 'A';
  case Sound.Bb: return 'Bb / A#';
  case Sound.B: return 'B';
  }
};
