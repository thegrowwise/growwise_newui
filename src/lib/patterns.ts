export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ErrorPattern = {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  commonGrades: string;
  description: string;
  blocksNext: string;
  domain: string;
};

export const PATTERNS: Record<string, ErrorPattern> = {
  // Math patterns
  fraction_add_error: {
    id: 'fraction_add_error',
    title: 'Fraction Addition Error',
    riskLevel: 'HIGH',
    commonGrades: 'Grades 4–6',
    description:
      'Your child adds numerators and denominators separately instead of finding a common denominator first.',
    blocksNext: 'Pre-algebra and algebra fraction work in Grades 6–8.',
    domain: 'fractions',
  },
  place_value_confusion: {
    id: 'place_value_confusion',
    title: 'Place Value Confusion',
    riskLevel: 'HIGH',
    commonGrades: 'Grades 2–4',
    description:
      'Your child misreads or misaligns digits in multi-digit numbers, leading to errors in addition and subtraction.',
    blocksNext: 'Multi-digit multiplication and long division in Grades 4–5.',
    domain: 'place_value',
  },
  multiplication_skip: {
    id: 'multiplication_skip',
    title: 'Multiplication Facts Gap',
    riskLevel: 'MEDIUM',
    commonGrades: 'Grades 3–5',
    description:
      'Your child skips or guesses multiplication facts rather than recalling them automatically.',
    blocksNext: 'Division, fractions, and multi-step word problems.',
    domain: 'multiplication',
  },
  decimal_place_error: {
    id: 'decimal_place_error',
    title: 'Decimal Placement Error',
    riskLevel: 'MEDIUM',
    commonGrades: 'Grades 5–7',
    description:
      'Your child misplaces the decimal point when multiplying or dividing decimals.',
    blocksNext: 'Percent calculations, money math, and algebra.',
    domain: 'division',
  },
  algebra_sign_error: {
    id: 'algebra_sign_error',
    title: 'Negative Number / Sign Error',
    riskLevel: 'HIGH',
    commonGrades: 'Grades 6–9',
    description:
      'Your child drops or flips negative signs when simplifying expressions or solving equations.',
    blocksNext: 'All of algebra and higher — this error compounds quickly.',
    domain: 'integers',
  },
  order_of_operations: {
    id: 'order_of_operations',
    title: 'Order of Operations Error',
    riskLevel: 'MEDIUM',
    commonGrades: 'Grades 5–7',
    description:
      'Your child evaluates expressions left-to-right instead of following PEMDAS/BODMAS.',
    blocksNext: 'Algebraic expressions and equation solving.',
    domain: 'algebra',
  },
  // English patterns
  subject_verb_agreement: {
    id: 'subject_verb_agreement',
    title: 'Subject-Verb Agreement Errors',
    riskLevel: 'MEDIUM',
    commonGrades: 'Grades 3–6',
    description:
      'Your child uses singular verbs with plural subjects (or vice versa), especially in longer sentences.',
    blocksNext: 'Writing fluency and standardized test grammar sections.',
    domain: 'grammar',
  },
  reading_inference_gap: {
    id: 'reading_inference_gap',
    title: 'Reading Inference Gap',
    riskLevel: 'HIGH',
    commonGrades: 'Grades 4–8',
    description:
      'Your child can recall explicit facts but struggles to draw conclusions not directly stated in the text.',
    blocksNext: 'Critical reading, essay analysis, and standardized test reading sections.',
    domain: 'inference',
  },
  main_idea_confusion: {
    id: 'main_idea_confusion',
    title: 'Main Idea vs. Detail Confusion',
    riskLevel: 'MEDIUM',
    commonGrades: 'Grades 3–6',
    description:
      'Your child picks supporting details when asked for the main idea of a passage.',
    blocksNext: 'Summarizing, note-taking, and essay writing.',
    domain: 'reading',
  },
  comma_splice: {
    id: 'comma_splice',
    title: 'Run-On / Comma Splice',
    riskLevel: 'LOW',
    commonGrades: 'Grades 4–7',
    description:
      'Your child joins two independent clauses with only a comma instead of a conjunction or period.',
    blocksNext: 'Formal writing and grammar test sections.',
    domain: 'grammar',
  },
  vocabulary_context: {
    id: 'vocabulary_context',
    title: 'Vocabulary in Context Weakness',
    riskLevel: 'MEDIUM',
    commonGrades: 'Grades 5–9',
    description:
      'Your child cannot reliably determine the meaning of unfamiliar words from surrounding context.',
    blocksNext: 'SAT/ACT reading comprehension and academic writing.',
    domain: 'vocabulary',
  },
};

/**
 * Maps "question_id_answerIndex" → pattern id.
 * question_id is the Tutor LMS question ID (integer string).
 * answer_index is 0-based index of the selected wrong answer.
 *
 * Fill in real question IDs after creating quizzes in Tutor LMS.
 * Format: `${question_id}_a${answer_index}` → pattern_id
 */
export const QUESTION_ANSWER_PATTERN_MAP: Record<string, string> = {
  // Math quiz — placeholder question IDs (replace with real Tutor LMS IDs)
  'math_q1_a0': 'fraction_add_error',
  'math_q1_a2': 'fraction_add_error',
  'math_q2_a1': 'place_value_confusion',
  'math_q2_a3': 'place_value_confusion',
  'math_q3_a0': 'multiplication_skip',
  'math_q3_a2': 'multiplication_skip',
  'math_q4_a1': 'decimal_place_error',
  'math_q4_a3': 'decimal_place_error',
  'math_q5_a0': 'algebra_sign_error',
  'math_q5_a2': 'algebra_sign_error',
  'math_q6_a1': 'order_of_operations',
  'math_q6_a3': 'order_of_operations',
  // English quiz — placeholder question IDs
  'eng_q1_a0': 'subject_verb_agreement',
  'eng_q1_a2': 'subject_verb_agreement',
  'eng_q2_a1': 'reading_inference_gap',
  'eng_q2_a3': 'reading_inference_gap',
  'eng_q3_a0': 'main_idea_confusion',
  'eng_q3_a2': 'main_idea_confusion',
  'eng_q4_a1': 'comma_splice',
  'eng_q4_a3': 'comma_splice',
  'eng_q5_a0': 'vocabulary_context',
  'eng_q5_a2': 'vocabulary_context',
};

export type WrongAnswer = {
  question_id: string;
  answer_index: number;
};

export type PatternDetectionResult = {
  confirmed: ErrorPattern[];
  possible: ErrorPattern[];
  overallRisk: RiskLevel | 'NONE';
};

export function detectPatterns(wrongAnswers: WrongAnswer[]): PatternDetectionResult {
  const counts: Record<string, number> = {};

  for (const { question_id, answer_index } of wrongAnswers) {
    const key = `${question_id}_a${answer_index}`;
    const patternId = QUESTION_ANSWER_PATTERN_MAP[key];
    if (patternId) {
      counts[patternId] = (counts[patternId] ?? 0) + 1;
    }
  }

  const confirmed: ErrorPattern[] = [];
  const possible: ErrorPattern[] = [];

  for (const [patternId, count] of Object.entries(counts)) {
    const pattern = PATTERNS[patternId];
    if (!pattern) continue;
    if (count >= 2) {
      confirmed.push(pattern);
    } else {
      possible.push(pattern);
    }
  }

  const riskPriority: RiskLevel[] = ['HIGH', 'MEDIUM', 'LOW'];
  const allPatterns = [...confirmed, ...possible];

  let overallRisk: RiskLevel | 'NONE' = 'NONE';
  for (const level of riskPriority) {
    if (allPatterns.some((p) => p.riskLevel === level)) {
      overallRisk = level;
      break;
    }
  }

  return { confirmed, possible, overallRisk };
}
