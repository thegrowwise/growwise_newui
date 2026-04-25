import {
  ADV_MATH_ALGEBRA_WEEK_SESSIONS,
  ADV_MATH_PRECAL_WEEK_SESSIONS,
  formatAdvMathWeekSessions,
  formatAdvMathWeekSlotHeading,
  getAdvMathSlotDateLabel,
} from '@/lib/adv-math-week-sessions';

describe('adv-math-week-sessions', () => {
  it('has eight weeks for each track', () => {
    expect(ADV_MATH_ALGEBRA_WEEK_SESSIONS).toHaveLength(8);
    expect(ADV_MATH_PRECAL_WEEK_SESSIONS).toHaveLength(8);
  });

  it('formats same-month algebra week 1', () => {
    expect(formatAdvMathWeekSessions(ADV_MATH_ALGEBRA_WEEK_SESSIONS[0]!)).toBe('Jun 8, 10, 12');
  });

  it('formats algebra week spanning June–July', () => {
    expect(formatAdvMathWeekSessions(ADV_MATH_ALGEBRA_WEEK_SESSIONS[3]!)).toBe('Jun 29, Jul 1, 3');
  });

  it('formats precal week 1', () => {
    expect(formatAdvMathWeekSessions(ADV_MATH_PRECAL_WEEK_SESSIONS[0]!)).toBe('Jun 9, 10, 11');
  });

  it('getAdvMathSlotDateLabel matches week index', () => {
    expect(getAdvMathSlotDateLabel('algebra', 7)).toBe('Jul 27, 29, 31');
    expect(getAdvMathSlotDateLabel('precalculus', 7)).toBe('Jul 28, 29, 30');
  });

  it('formatAdvMathWeekSlotHeading matches camp-wide Week N (…) pattern', () => {
    expect(formatAdvMathWeekSlotHeading('algebra', 0)).toBe('Week 1 (Jun 8, 10, 12)');
    expect(formatAdvMathWeekSlotHeading('precalculus', 0)).toBe('Week 1 (Jun 9, 10, 11)');
  });
});
