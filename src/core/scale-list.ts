import { ScaleType } from './scale-type';

export const scaleByType = (type: ScaleType): number[] => {
  switch (type) {
  case ScaleType.Major:
    return [0, 2, 4, 5, 7, 9, 11];
  case ScaleType.NaturalMinor:
    return [0, 2, 3, 5, 7, 8, 10];
  }
};
