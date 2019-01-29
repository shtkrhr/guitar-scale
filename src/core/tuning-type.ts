import { Note } from './note';

export enum TuningType {
  GuitarRegular = 'Guitar Regular',
  BassRegular = 'Bass Regular',
}

export const allTuningTypes = () => [TuningType.GuitarRegular, TuningType.BassRegular];

export const stringsForTuning = (tuning: TuningType): Note[] => {
  switch (tuning) {
  case TuningType.GuitarRegular:
    return [Note.E, Note.B, Note.G, Note.D, Note.A, Note.E];
  case TuningType.BassRegular:
    return [Note.G, Note.D, Note.A, Note.E];
  }
};
