export const MATH_FINALS_PRACTICE_SUBJECTS = [
  'Algebra 1',
  'Algebra 2',
  'Pre-Calculus',
] as const

export type MathFinalsPracticeSubject = (typeof MATH_FINALS_PRACTICE_SUBJECTS)[number]
