export interface PositionDot {
  fret: number;
  string: number;
  color?: string;
  opacity?: number;
  text?: string;
  textColor?: string;
}

export const validateDot = (dot: PositionDot) => {
  if (dot.string < 1 ||
    dot.fret < 0 ||
    dot.string !== parseInt(dot.string + '', 10) ||
    dot.fret !== parseInt(dot.fret + '', 10)) {
    throw new Error;
  }

  return true;
};
