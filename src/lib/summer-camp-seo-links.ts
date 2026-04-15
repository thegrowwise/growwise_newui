/**
 * Maps summer hub program ids to `/camps/[slug]` SEO detail pages (pillar → detail).
 * Used on the summer hub only; slugs must match `src/app/[locale]/camps/[slug]`.
 */

export const SUMMER_CAMP_SEO_SLUGS = {
  mathOlympiad: 'math-olympiad-camp-dublin-ca',
  aiStudio: 'ai-studio-dublin-ca',
  gameDevelopment: 'game-development-camp-dublin-ca',
  robotics: 'robotics-camp-dublin-ca',
  roboticsFullDay: 'robotics-full-day-dublin-ca',
  youngAuthors: 'young-authors-camp-dublin-ca',
} as const;

export type SummerCampSeoLinkKey =
  | 'mathOlympiad'
  | 'aiStudio'
  | 'gameDevelopment'
  | 'robotics'
  | 'roboticsFullDay'
  | 'youngAuthors';

export type SummerCampProgramSeoLink = {
  slug: string;
  labelKey: SummerCampSeoLinkKey;
};

const PROGRAM_ID_TO_SEO: Partial<Record<string, SummerCampProgramSeoLink>> = {
  'math-olympiad': { slug: SUMMER_CAMP_SEO_SLUGS.mathOlympiad, labelKey: 'mathOlympiad' },
  'ai-entrepreneur': { slug: SUMMER_CAMP_SEO_SLUGS.aiStudio, labelKey: 'aiStudio' },
  'robotics-camp': { slug: SUMMER_CAMP_SEO_SLUGS.robotics, labelKey: 'robotics' },
  'young-authors': { slug: SUMMER_CAMP_SEO_SLUGS.youngAuthors, labelKey: 'youngAuthors' },
  'roblox-in-person': { slug: SUMMER_CAMP_SEO_SLUGS.gameDevelopment, labelKey: 'gameDevelopment' },
};

export function getSummerCampProgramSeoLink(programId: string): SummerCampProgramSeoLink | undefined {
  return PROGRAM_ID_TO_SEO[programId];
}

export function getRoboticsFullDaySeoLink(): SummerCampProgramSeoLink {
  return { slug: SUMMER_CAMP_SEO_SLUGS.roboticsFullDay, labelKey: 'roboticsFullDay' };
}

/** Pillar “Start with one track” link labels — `summerCamp.programGroup.*` in messages. */
export type SummerCampProgramGroupLinkMsgKey =
  | 'linkMathOlympiad'
  | 'linkAiStudio'
  | 'linkGameDevelopment'
  | 'linkRobotics'
  | 'linkYoungAuthors';

export type SummerCampProgramGroupPillarLink = {
  slug: string;
  msgKey: SummerCampProgramGroupLinkMsgKey;
};

/** Order matches `SUMMER_CAMP_PROGRAM_GROUP_IDS` / conversion cards: Academic → AI & game → Creative writing. No full-day robotics slug here. */
export const SUMMER_CAMP_PROGRAM_GROUP_SEO_LINKS: readonly (readonly SummerCampProgramGroupPillarLink[])[] = [
  [{ slug: SUMMER_CAMP_SEO_SLUGS.mathOlympiad, msgKey: 'linkMathOlympiad' }],
  [
    { slug: SUMMER_CAMP_SEO_SLUGS.aiStudio, msgKey: 'linkAiStudio' },
    { slug: SUMMER_CAMP_SEO_SLUGS.gameDevelopment, msgKey: 'linkGameDevelopment' },
    { slug: SUMMER_CAMP_SEO_SLUGS.robotics, msgKey: 'linkRobotics' },
  ],
  [{ slug: SUMMER_CAMP_SEO_SLUGS.youngAuthors, msgKey: 'linkYoungAuthors' }],
];

/** Message path under `summerCamp` for `useTranslations('summerCamp')`. */
export function summerCampSeoMessagePath(labelKey: SummerCampSeoLinkKey): `seo.${SummerCampSeoLinkKey}` {
  return `seo.${labelKey}`;
}

export function summerCampProgramGroupMessagePath(
  key: SummerCampProgramGroupLinkMsgKey
): `programGroup.${SummerCampProgramGroupLinkMsgKey}` {
  return `programGroup.${key}`;
}
