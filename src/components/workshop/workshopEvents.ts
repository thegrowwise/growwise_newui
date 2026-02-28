/**
 * Workshop calendar data and UI constants. Events are driven by programs.json via loadPrograms.
 */
import {
  loadPrograms,
  buildProgramsByDate,
  formatProgramTime,
  type Program,
  type ProgramType
} from '@/lib/programs';

export type { Program, ProgramType };
export { loadPrograms, buildProgramsByDate, formatProgramTime };

export const WORKSHOP_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'
] as const;

export const EVENT_TYPE_CLASSES: Record<ProgramType, string> = {
  reading: 'bg-blue-100 text-blue-700',
  math: 'bg-purple-100 text-purple-700',
  coding: 'bg-amber-100 text-amber-700',
  ai: 'bg-pink-100 text-pink-700',
  webinar: 'bg-emerald-100 text-emerald-700'
};

export const PROGRAM_TYPE_BADGE: Record<ProgramType, string> = {
  reading: '📘',
  math: '🧮',
  coding: '🎮',
  ai: '🤖',
  webinar: '👨‍👩‍👧'
};

export const GRADES_LIST = [
  'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
] as const;

export const HOW_DID_YOU_HEAR_OPTIONS: { value: string; label: string }[] = [
  { value: 'social_media', label: 'Social media' },
  { value: 'google', label: 'Google' },
  { value: 'friends', label: 'Friends' },
  { value: 'whatsapp', label: 'WhatsApp' }
];

/** Calendar events map: dateStr (YYYY-MM-DD) -> Program. Built from programs.json. */
export function getWorkshopEventsMap(): Record<string, Program> {
  return buildProgramsByDate(loadPrograms());
}

/** Display schedule line for a program, e.g. "Sundays · 10:30 AM (PT)". */
export function getScheduleLine(program: Program): string {
  const day = program.dayOfWeek.charAt(0) + program.dayOfWeek.slice(1).toLowerCase() + 's';
  const time = formatProgramTime(program.time);
  return `${day} · ${time} (PT)`;
}
