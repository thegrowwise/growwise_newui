/**
 * Program accent theme helpers (by backend program id).
 * UI layout only — business data remains from pricing API.
 */

const PROGRAM_ACCENT_BG: Record<string, string> = {
  python: 'bg-blue-600',
  aiml: 'bg-purple-600',
  appdev: 'bg-teal-600',
  scratch: 'bg-amber-500',
  roblox: 'bg-rose-600',
  minecraft: 'bg-green-600',
  robotics: 'bg-orange-600',
};

// Used for inline styles (e.g. enroll button background).
const PROGRAM_ACCENT_HEX: Record<string, string> = {
  python: '#2563EB', // blue-600
  aiml: '#7C3AED', // purple-600
  appdev: '#14B8A6', // teal-500/600-ish
  scratch: '#F59E0B', // amber-500
  roblox: '#E11D48', // rose-600
  minecraft: '#16A34A', // green-600
  robotics: '#F97316', // orange-500-ish
};

export function getProgramAccentColorClass(programId: string): string {
  return PROGRAM_ACCENT_BG[programId] ?? 'bg-[#1F396D]';
}

export function getProgramAccentHex(programId: string): string {
  return PROGRAM_ACCENT_HEX[programId] ?? '#1F396D';
}

// Backward compatibility (if any component still uses it).
export function getProgramAccentBorderClass(programId: string): string {
  const bg = getProgramAccentColorClass(programId).replace(/^bg-/, 'border-');
  return bg || 'border-[#1F396D]';
}
