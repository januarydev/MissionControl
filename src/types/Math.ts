function wrapMax(x: number, max: number) {
  return (max + (x % max)) % max;
}

export function Wrap(min: number, max: number, x: number) {
  return min + wrapMax(x - min, max - min);
};

export function Limit(min: number, max: number, x: number) {
  return Math.max(min, Math.min(max, x));
};
