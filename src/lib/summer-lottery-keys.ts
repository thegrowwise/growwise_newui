/** Canonical lottery form keys — shared by summer camp page and lottery-success route. */
export const LOTTERY_GRADES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'other',
] as const;

export type LotteryGrade = (typeof LOTTERY_GRADES)[number];

export const LOTTERY_INTERESTS = ['academic', 'game_development', 'coding'] as const;

export type LotteryInterest = (typeof LOTTERY_INTERESTS)[number];

export function isLotteryGrade(value: string): value is LotteryGrade {
  return (LOTTERY_GRADES as readonly string[]).includes(value);
}

export function isLotteryInterest(value: string): value is LotteryInterest {
  return (LOTTERY_INTERESTS as readonly string[]).includes(value);
}
