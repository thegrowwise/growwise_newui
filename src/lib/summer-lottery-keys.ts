/**
 * Shared enums for summer camp “lottery” / guide funnel (API + success page query params).
 * Keep in sync with `summerCamp.summercamp.interests` / `grades` in i18n and API body validation.
 */

export const LOTTERY_INTEREST_KEYS = [
  'academic',
  'game_development',
  'coding',
  'robotics',
  'math_olympiad',
  'ai',
  'young_authors',
] as const;

export type LotteryInterestKey = (typeof LOTTERY_INTEREST_KEYS)[number];

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

export function isLotteryGrade(value: string): value is LotteryGrade {
  return (LOTTERY_GRADES as readonly string[]).includes(value);
}

export function isLotteryInterest(value: string): value is LotteryInterestKey {
  return (LOTTERY_INTEREST_KEYS as readonly string[]).includes(value);
}
