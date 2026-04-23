/**
 * Single source of truth for 2026 summer camp calendar buckets (Mon–Fri weeks).
 * Season: June 8 (Mon) through July 31 (Fri), 2026 — eight full weeks.
 */

/** Human-readable season span for modal / marketing (matches week list). */
export const SUMMER_CAMP_SEASON_RANGE_TEXT = 'June 8 – July 31, 2026';

/** Short note for parents (July 4, 2026 is a Saturday; still stated for clarity). */
export const SUMMER_CAMP_JULY4_NOTE = 'No camp July 4';

/** ISO-8601 with Pacific offset for Event JSON-LD. */
export const SUMMER_CAMP_EVENT_START_ISO = '2026-06-08T09:00:00-08:00';

export const SUMMER_CAMP_EVENT_END_ISO = '2026-07-31T17:00:00-08:00';

/**
 * Eight Monday–Friday camp weeks, fixed labels (avoids TZ bugs from Date parsing).
 */
export const SUMMER_CAMP_WEEK_LABELS_2026 = [
  'Jun 8–12, 2026',
  'Jun 15–19, 2026',
  'Jun 22–26, 2026',
  'Jun 29 – Jul 3, 2026',
  'Jul 6–10, 2026',
  'Jul 13–17, 2026',
  'Jul 20–24, 2026',
  'Jul 27–31, 2026',
] as const;

export const SUMMER_CAMP_WEEK_COUNT = SUMMER_CAMP_WEEK_LABELS_2026.length;

export function getSummerCampWeekLabel(weekIndex0: number): string {
  const label = SUMMER_CAMP_WEEK_LABELS_2026[weekIndex0];
  if (label) return label;
  return `Week ${weekIndex0 + 1}`;
}

/** Standard slot line: `Week 1 (Jun 8–12, 2026)` — used across camp programs. */
export function formatCampWeekSlotHeading(weekIndex0: number): string {
  const dates = getSummerCampWeekLabel(weekIndex0);
  if (/^Week\s+\d+$/.test(dates)) return dates;
  return `Week ${weekIndex0 + 1} (${dates})`;
}

/** Math Olympiad Tier 2: `Weeks 1-2 (Jun 8 – Jun 19, 2026)` */
export function formatOlympiadTier2SlotHeading(slotIndex0: number): string {
  const dates = getMathOlympiadTier2SlotLabel(slotIndex0);
  if (/^Weeks\s/.test(dates)) return dates;
  const start = slotIndex0 * 2 + 1;
  const end = slotIndex0 * 2 + 2;
  return `Weeks ${start}-${end} (${dates})`;
}

/** Math Olympiad Tier 2: each slot spans two consecutive calendar weeks. */
const MATH_OLYMPIAD_TIER2_SLOT_LABELS = [
  'Jun 8 – Jun 19, 2026',
  'Jun 22 – Jul 3, 2026',
  'Jul 6 – Jul 17, 2026',
  'Jul 20 – Jul 31, 2026',
] as const;

export function getMathOlympiadTier2SlotLabel(slotIndex0: number): string {
  const label = MATH_OLYMPIAD_TIER2_SLOT_LABELS[slotIndex0];
  if (label) return label;
  return `Weeks ${slotIndex0 * 2 + 1}–${slotIndex0 * 2 + 2}`;
}
