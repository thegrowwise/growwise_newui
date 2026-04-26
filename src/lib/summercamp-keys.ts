/** Canonical summer camp form keys — shared by summer camp page and summercamp-success route. */
export const SUMMERCAMP_GRADES = [
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

export type SummerCampGrade = (typeof SUMMERCAMP_GRADES)[number];

export const SUMMERCAMP_INTERESTS = [
  'academic',
  'game_development',
  'coding',
  'robotics',
  'math_olympiad',
  'ai',
  'young_authors',
] as const;

export type SummerCampInterest = (typeof SUMMERCAMP_INTERESTS)[number];

export function isSummerCampGrade(value: string): value is SummerCampGrade {
  return (SUMMERCAMP_GRADES as readonly string[]).includes(value);
}

export function isSummerCampInterest(value: string): value is SummerCampInterest {
  return (SUMMERCAMP_INTERESTS as readonly string[]).includes(value);
}
