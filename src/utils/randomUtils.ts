// Server-safe random number generation
let seed = 0;

export function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

export function generateSeededArray<T>(
  count: number, 
  generator: (index: number, random: number) => T,
  seedValue?: number
): T[] {
  if (seedValue !== undefined) {
    seed = seedValue;
  }
  
  return Array.from({ length: count }, (_, i) => 
    generator(i, seededRandom())
  );
}

// Client-side random with fallback
export function getRandomValue() {
  if (typeof window !== 'undefined') {
    return Math.random();
  }
  return seededRandom();
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(getRandomValue() * (max - min + 1)) + min;
}
