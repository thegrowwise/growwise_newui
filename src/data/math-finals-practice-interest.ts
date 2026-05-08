export const MATH_FINALS_INTEREST_VALUES = ['structured_prep'] as const

export type MathFinalsPracticeInterest = (typeof MATH_FINALS_INTEREST_VALUES)[number]

/** Short labels for staff-facing emails and logs */
export const MATH_FINALS_INTEREST_LABELS: Record<MathFinalsPracticeInterest, string> = {
  structured_prep: 'Four-session structured finals prep course',
}

export function isMathFinalsPracticeInterest(v: string): v is MathFinalsPracticeInterest {
  return (MATH_FINALS_INTEREST_VALUES as readonly string[]).includes(v)
}
