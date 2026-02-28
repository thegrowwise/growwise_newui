/**
 * Program type and loader for workshop/calendar data.
 * Validates required fields at runtime (no heavy libs).
 */

export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export type ProgramType = 'reading' | 'math' | 'coding' | 'ai' | 'webinar';

export interface Program {
  id: string;
  name: string;
  dayOfWeek: DayOfWeek;
  time: string;
  timezone: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  /** Optional for calendar UI (badge/color). */
  type?: ProgramType;
  /** Optional display, e.g. "Grade 3-6". */
  grades?: string;
  /** Optional capacity. */
  seats?: number;
}

const REQUIRED_KEYS: (keyof Program)[] = [
  'id',
  'name',
  'dayOfWeek',
  'time',
  'timezone',
  'durationMinutes',
  'startDate',
  'endDate',
  'location',
  'description'
];

const DAY_OF_WEEK_VALUES: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
];

function isDayOfWeek(s: string): s is DayOfWeek {
  return DAY_OF_WEEK_VALUES.includes(s as DayOfWeek);
}

const PROGRAM_TYPES: ProgramType[] = ['reading', 'math', 'coding', 'ai', 'webinar'];

function isProgramType(s: string): s is ProgramType {
  return PROGRAM_TYPES.includes(s as ProgramType);
}

function validateProgram(raw: unknown): Program | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  for (const key of REQUIRED_KEYS) {
    if (o[key] === undefined || o[key] === null) return null;
  }
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return null;
  if (!isDayOfWeek(String(o.dayOfWeek))) return null;
  if (typeof o.time !== 'string' || typeof o.timezone !== 'string') return null;
  if (typeof o.durationMinutes !== 'number' || o.durationMinutes < 0) return null;
  if (typeof o.startDate !== 'string' || typeof o.endDate !== 'string') return null;
  if (typeof o.location !== 'string' || typeof o.description !== 'string') return null;
  const p: Program = {
    id: o.id as string,
    name: o.name as string,
    dayOfWeek: o.dayOfWeek as DayOfWeek,
    time: o.time as string,
    timezone: o.timezone as string,
    durationMinutes: o.durationMinutes as number,
    startDate: o.startDate as string,
    endDate: o.endDate as string,
    location: o.location as string,
    description: o.description as string
  };
  if (o.type != null && isProgramType(String(o.type))) p.type = o.type as ProgramType;
  if (typeof o.grades === 'string') p.grades = o.grades;
  if (typeof o.seats === 'number' && o.seats >= 0) p.seats = o.seats;
  return p;
}

import rawPrograms from '@/data/programs.json';

/**
 * Load and validate programs from JSON.
 */
export function loadPrograms(): Program[] {
  const arr = Array.isArray(rawPrograms) ? rawPrograms : [];
  const result: Program[] = [];
  for (const item of arr) {
    const p = validateProgram(item);
    if (p) result.push(p);
  }
  return result;
}

const DAY_TO_NUM: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

/**
 * Format time "HH:mm" to display "10:30 AM" or "8:00 PM".
 */
export function formatProgramTime(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr ?? '0', 10);
  const m = parseInt(mStr ?? '0', 10);
  if (h === 0) return `12:${String(m).padStart(2, '0')} AM`;
  if (h === 12) return `12:${String(m).padStart(2, '0')} PM`;
  if (h < 12) return `${h}:${String(m).padStart(2, '0')} AM`;
  return `${h - 12}:${String(m).padStart(2, '0')} PM`;
}

/**
 * Get all calendar date strings (YYYY-MM-DD) for a program within its start/end range
 * where the weekday matches the program's dayOfWeek.
 */
export function getProgramDateStrings(program: Program): string[] {
  const out: string[] = [];
  const start = new Date(program.startDate + 'T12:00:00');
  const end = new Date(program.endDate + 'T12:00:00');
  const wantDay = DAY_TO_NUM[program.dayOfWeek];
  const d = new Date(start);
  while (d <= end) {
    if (d.getDay() === wantDay) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      out.push(`${y}-${m}-${day}`);
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/**
 * Build a map of dateStr -> Program for calendar display.
 * When multiple programs fall on the same date, the first one in the list wins.
 */
export function buildProgramsByDate(programs: Program[]): Record<string, Program> {
  const map: Record<string, Program> = {};
  for (const p of programs) {
    for (const dateStr of getProgramDateStrings(p)) {
      if (!map[dateStr]) map[dateStr] = p;
    }
  }
  return map;
}

/**
 * Get the first session date string (YYYY-MM-DD) for a program on or after a given date.
 * Used for Google Calendar / .ics (first occurrence).
 */
export function getFirstSessionDateString(program: Program, onOrAfterDateStr: string): string | null {
  const dates = getProgramDateStrings(program);
  const after = onOrAfterDateStr.replace(/-/g, '');
  for (const d of dates) {
    if (d.replace(/-/g, '') >= after) return d;
  }
  return dates.length > 0 ? dates[0]! : null;
}

/**
 * Build start/end as YYYYMMDDTHHmmss strings in program timezone (PT).
 * Used for Google Calendar URL (with ctz=) and for .ics UTC conversion.
 */
function getSessionStartEndStrings(
  program: Program,
  dateStr: string
): { startStr: string; endStr: string; start: Date; end: Date } {
  const datePart = dateStr.replace(/-/g, '');
  const [th, tm] = program.time.split(':').map((x) => parseInt(x ?? '0', 10));
  const startStr = `${datePart}T${String(th).padStart(2, '0')}${String(tm).padStart(2, '0')}00`;
  const endMin = th * 60 + tm + program.durationMinutes;
  const eh = Math.floor(endMin / 60) % 24;
  const em = endMin % 60;
  const endStr = `${datePart}T${String(eh).padStart(2, '0')}${String(em).padStart(2, '0')}00`;
  const [y, m, d] = dateStr.split('-').map(Number);
  const ptOffsetHours = 8;
  const start = new Date(Date.UTC(y!, m! - 1, d!, th + ptOffsetHours, tm, 0, 0));
  const end = new Date(start.getTime() + program.durationMinutes * 60 * 1000);
  return { startStr, endStr, start, end };
}

/**
 * Build Google Calendar "Add event" URL. Uses ctz= so start/end are in PT.
 */
export function buildGoogleCalendarUrl(
  program: Program,
  dateStr: string,
  details?: string
): string {
  const { startStr, endStr } = getSessionStartEndStrings(program, dateStr);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: program.name,
    dates: `${startStr}/${endStr}`,
    details: details ?? program.description,
    location: program.location,
    ctz: program.timezone
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Build .ics file content for a single session.
 */
export function buildIcsContent(
  program: Program,
  dateStr: string,
  details?: string
): string {
  const { start, end } = getSessionStartEndStrings(program, dateStr);
  const formatUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const escape = (s: string) => s.replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GrowWise//Workshop//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escape(program.name)}`,
    `DESCRIPTION:${escape(details ?? program.description)}`,
    `LOCATION:${escape(program.location)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
