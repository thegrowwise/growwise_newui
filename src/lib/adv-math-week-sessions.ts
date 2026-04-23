/**
 * Advanced Math (summer): per-week session dates by track.
 * Algebra II: Mon / Wed / Fri. Precalculus: Tue / Wed / Thu.
 * Source: 2026 camp schedule (8 weeks).
 */

/** Matches `AdvMathProgramKey` in summer-camp-data (kept local to avoid a runtime import cycle). */
export type AdvMathSessionProgram = 'algebra' | 'precalculus';

/** ISO date (YYYY-MM-DD) for each of the three sessions in that enrollment week. */
export type AdvMathWeekSessions = readonly [string, string, string];

/** Summer Adv Algebra 2 — Mon/Wed/Fri pattern per week. */
export const ADV_MATH_ALGEBRA_WEEK_SESSIONS: readonly AdvMathWeekSessions[] = [
  ['2026-06-08', '2026-06-10', '2026-06-12'],
  ['2026-06-15', '2026-06-17', '2026-06-18'],
  ['2026-06-22', '2026-06-24', '2026-06-26'],
  ['2026-06-29', '2026-07-01', '2026-07-03'],
  ['2026-07-06', '2026-07-08', '2026-07-10'],
  ['2026-07-13', '2026-07-15', '2026-07-17'],
  ['2026-07-20', '2026-07-22', '2026-07-24'],
  ['2026-07-27', '2026-07-29', '2026-07-31'],
] as const;

/** Summer PreCal — Tue/Wed/Thu pattern per week. */
export const ADV_MATH_PRECAL_WEEK_SESSIONS: readonly AdvMathWeekSessions[] = [
  ['2026-06-09', '2026-06-10', '2026-06-11'],
  ['2026-06-16', '2026-06-17', '2026-06-18'],
  ['2026-06-23', '2026-06-24', '2026-06-25'],
  ['2026-06-30', '2026-07-01', '2026-07-02'],
  ['2026-07-07', '2026-07-08', '2026-07-09'],
  ['2026-07-14', '2026-07-15', '2026-07-16'],
  ['2026-07-21', '2026-07-22', '2026-07-23'],
  ['2026-07-28', '2026-07-29', '2026-07-30'],
] as const;

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function parseIso(iso: string): { month: number; day: number } {
  const parts = iso.split('-');
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!month || !day || month < 1 || month > 12) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }
  return { month, day };
}

/** e.g. "Jun 8" */
function monthDay(iso: string): string {
  const { month, day } = parseIso(iso);
  return `${MONTH_SHORT[month - 1]} ${day}`;
}

/**
 * Compact label: same month → "Jun 8, 10, 12"; mixed months → "Jun 30, Jul 1, 2".
 */
export function formatAdvMathWeekSessions(week: AdvMathWeekSessions): string {
  const [a, b, c] = week;
  const ma = parseIso(a).month;
  const mb = parseIso(b).month;
  const mc = parseIso(c).month;
  const da = parseIso(a).day;
  const db = parseIso(b).day;
  const dc = parseIso(c).day;

  if (ma === mb && mb === mc) {
    return `${MONTH_SHORT[ma - 1]} ${da}, ${db}, ${dc}`;
  }
  /* e.g. Jun 29 + Jul 1 + Jul 3 → "Jun 29, Jul 1, 3" */
  if (mb === mc && ma !== mb) {
    return `${MONTH_SHORT[ma - 1]} ${da}, ${MONTH_SHORT[mb - 1]} ${db}, ${dc}`;
  }
  if (ma === mb) {
    return `${MONTH_SHORT[ma - 1]} ${da}, ${db}, ${MONTH_SHORT[mc - 1]} ${dc}`;
  }
  return `${monthDay(a)}, ${monthDay(b)}, ${monthDay(c)}`;
}

export function getAdvMathWeekSessions(
  program: AdvMathSessionProgram,
  weekIndex0: number
): AdvMathWeekSessions | undefined {
  const rows =
    program === 'algebra' ? ADV_MATH_ALGEBRA_WEEK_SESSIONS : ADV_MATH_PRECAL_WEEK_SESSIONS;
  return rows[weekIndex0];
}

/** Session dates only (no "Week N" wrapper), e.g. `Jun 8, 10, 12`. */
export function getAdvMathSlotDateLabel(program: AdvMathSessionProgram, weekIndex0: number): string {
  const week = getAdvMathWeekSessions(program, weekIndex0);
  if (!week) return `Week ${weekIndex0 + 1}`;
  return formatAdvMathWeekSessions(week);
}

/** Same pattern as other camps: `Week 1 (Jun 8, 10, 12) — …` */
export function formatAdvMathWeekSlotHeading(program: AdvMathSessionProgram, weekIndex0: number): string {
  const inner = getAdvMathSlotDateLabel(program, weekIndex0);
  if (/^Week\s+\d+$/.test(inner)) return inner;
  return `Week ${weekIndex0 + 1} (${inner})`;
}
