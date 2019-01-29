// interval > 0
export const arithmeticSequence = (initial: number, interval: number, limit: number): number[] => {
  const sequence = [];
  for (let i = 0; true; i++) {
    const next = interval * i + initial;
    if (next > limit) {
      break;
    }
    sequence.push(next);
  }
  return sequence;
};
