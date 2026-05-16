import type { ErrorPattern } from './patterns';

export type AwardTier = 'double_detective' | 'parent_detective' | 'self_aware' | 'keep_digging';

export type ParentPrediction =
  | 'place_value'
  | 'fractions'
  | 'operations'
  | 'integers'
  | 'algebra'
  | 'word_problems'
  | 'not_sure';

export const PREDICTION_OPTIONS: { value: ParentPrediction; label: string }[] = [
  { value: 'place_value',   label: 'Place Value or Number Sense' },
  { value: 'fractions',     label: 'Fractions' },
  { value: 'operations',    label: 'Addition, Subtraction, Multiplication, or Division' },
  { value: 'integers',      label: 'Negative Numbers or Integers' },
  { value: 'algebra',       label: 'Algebra or Equations' },
  { value: 'word_problems', label: 'Word Problems' },
  { value: 'not_sure',      label: "Not sure — that's why I'm here" },
];

const PREDICTION_TO_DOMAINS: Record<string, string[]> = {
  place_value:   ['place_value', 'number_sense'],
  fractions:     ['fractions'],
  operations:    ['addition', 'subtraction', 'multiplication', 'division'],
  integers:      ['integers', 'negative_numbers'],
  algebra:       ['algebra', 'equations', 'distributive', 'exponents'],
  word_problems: ['word_problems', 'proportional_reasoning'],
  not_sure:      [],
};

function predictionMatchesPatterns(prediction: string | string[], patterns: ErrorPattern[]): boolean {
  const values = Array.isArray(prediction) ? prediction : [prediction];
  if (values.length === 0 || (values.length === 1 && values[0] === 'not_sure')) return false;
  return values.some((v) => {
    if (v === 'not_sure') return false;
    const domains = PREDICTION_TO_DOMAINS[v] ?? [];
    return patterns.some((p) => domains.includes(p.domain));
  });
}

export function computeAward(
  confirmedPatterns: ErrorPattern[],
  studentPrediction: string,
  parentPrediction: string | string[],
): AwardTier {
  const studentCorrect = predictionMatchesPatterns(studentPrediction, confirmedPatterns);
  const parentCorrect = predictionMatchesPatterns(parentPrediction, confirmedPatterns);

  if (studentCorrect && parentCorrect) return 'double_detective';
  if (!studentCorrect && parentCorrect) return 'parent_detective';
  if (studentCorrect && !parentCorrect) return 'self_aware';
  return 'keep_digging';
}

export const PREDICTION_LABELS: Record<string, string> = {
  place_value:   'Place Value or Number Sense',
  fractions:     'Fractions',
  operations:    'Addition, Subtraction, Multiplication, or Division',
  integers:      'Negative Numbers or Integers',
  algebra:       'Algebra or Equations',
  word_problems: 'Word Problems',
  not_sure:      "Wasn't sure",
};
