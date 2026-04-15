/**
 * Maps the 3 conversion “program track” cards to real program ids for scroll + pre-select in booking.
 * Order matches `summerCamp.conversion.programGroups` in en.json:
 * Academic → AI & game dev → Young Authors.
 */
export const SUMMER_CAMP_PROGRAM_GROUP_IDS = [
  ['math-olympiad', 'adv-math'],
  ['ai-entrepreneur', 'scratch-online', 'roblox-in-person', 'robotics-camp'],
  ['young-authors'],
] as const;

export type SummerCampProgramTrack = 'academic' | 'aiGameDev' | 'creativeWriting';

/** Section / filter chip order for the booking grid. */
export const SUMMER_CAMP_PROGRAM_TRACK_ORDER: SummerCampProgramTrack[] = [
  'academic',
  'aiGameDev',
  'creativeWriting',
];

const PROGRAM_ID_TO_TRACK: Record<string, SummerCampProgramTrack> = (() => {
  const m: Record<string, SummerCampProgramTrack> = {};
  const tracks: SummerCampProgramTrack[] = ['academic', 'aiGameDev', 'creativeWriting'];
  SUMMER_CAMP_PROGRAM_GROUP_IDS.forEach((ids, i) => {
    const track = tracks[i];
    for (const id of ids) m[id] = track;
  });
  return m;
})();

export function getSummerCampProgramTrack(programId: string): SummerCampProgramTrack | undefined {
  return PROGRAM_ID_TO_TRACK[programId];
}

/** Flat order from group definitions; unknown ids sort last by title. */
export function orderProgramsBySummerCampTrack<T extends { id: string; title: string }>(
  programs: T[]
): T[] {
  const flatOrder = SUMMER_CAMP_PROGRAM_GROUP_IDS.flat();
  const rank = new Map<string, number>(flatOrder.map((id, i) => [id, i]));
  return [...programs].sort((a, b) => {
    const ra = rank.get(a.id) ?? 1_000;
    const rb = rank.get(b.id) ?? 1_000;
    if (ra !== rb) return ra - rb;
    return a.title.localeCompare(b.title);
  });
}
