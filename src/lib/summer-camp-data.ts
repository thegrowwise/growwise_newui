import type { LucideIcon } from 'lucide-react';
import { Calculator, Brain, Gamepad2, Bot, Code2, Lightbulb, PenTool } from 'lucide-react';

export type Slot = {
  id: string;
  label: string;
  time: string;
  format: 'Online' | 'In-Person';
  price: number;
};

/** Price by delivery format; used when the same program/level is offered online and in-person at different prices. */
export type PriceByFormat = Record<'Online' | 'In-Person', number>;

export type Level = {
  id: string;
  name: string;
  description: string;
  slots: Slot[];
  /**
   * Price by program key and format. Use "default" for single-variant programs;
   * use "algebra" / "precalculus" for Adv Math. Resolves slot price in the UI.
   */
  priceByProgramAndFormat?: Record<string, PriceByFormat>;
};

export type ProgramDetails = {
  schedule: string;
  daysPerWeek: number;
  dailyHours: string;
  /** When set, used as the label instead of "Daily hours" (e.g. "Session hours"). */
  hoursLabel?: string;
  includes: string[];
};

export type Program = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'Half-Day Camps' | 'Full Day Camps';
  hoursPerWeek: string;
  ageGroup: string;
  /** When set (e.g. "Grade"), used as the label instead of "Age Group" in the details modal. */
  ageGroupLabel?: string;
  startingPrice: number;
  image: string;
  levels: Level[];
  details: ProgramDetails;
};

// ---------------------------------------------------------------------------
// Configurable program-variant types — structural data only, no display text.
// Display strings are owned by the i18n layer (summerCamp namespace).
// ---------------------------------------------------------------------------

/** Identifies a learner's delivery preference. Used as an i18n key suffix. */
export type LearningModeKey = 'inPerson' | 'online';

/** Identifies the Advanced Math sub-program. Used as an i18n key suffix. */
export type AdvMathProgramKey = 'algebra' | 'precalculus';

/** Identifies a Math Olympiad pricing tier. Used as an i18n key suffix. */
export type OlympiadTierId = 'tier1' | 'tier2';

/** Ordered list of learning mode selection keys. */
export const LEARNING_MODE_KEYS: LearningModeKey[] = ['inPerson', 'online'];

/** Ordered list of Advanced Math program selection keys. */
export const ADV_MATH_PROGRAM_KEYS: AdvMathProgramKey[] = ['algebra', 'precalculus'];

/** Maps a learning mode key to the canonical Slot.format value. */
export const LEARNING_MODE_FORMAT: Record<LearningModeKey, Slot['format']> = {
  inPerson: 'In-Person',
  online: 'Online',
};

/** Maps a learning mode key to the default session time string. */
export const LEARNING_MODE_TIME: Record<LearningModeKey, string> = {
  inPerson: '9:00 AM - 12:00 PM',
  online: '1:00 PM - 4:00 PM',
};

export type OlympiadTierConfig = {
  readonly id: OlympiadTierId;
  readonly slotCount: number;
  readonly weeksPerSlot: number;
  readonly hoursPerSlot: number;
  readonly slotId: (index: number) => string;
  /** Price by delivery format (online vs in-person). */
  readonly priceByFormat: PriceByFormat;
};

// ---------------------------------------------------------------------------
// JSON schema types (data only; icons and slotId functions added at load).
// Data source: public/api/mock/{locale}/summer-camp-programs.json
// ---------------------------------------------------------------------------

export type SlotTemplate = {
  slotIdPrefix: string;
  count: number;
  /** Default format used when generating slots (time + initial price). */
  defaultFormat: 'Online' | 'In-Person';
  /**
   * Price by program key and format. Use "default" for single-variant programs;
   * use "algebra" / "precalculus" for Adv Math. Same shape for every program.
   */
  priceByProgramAndFormat: Record<string, PriceByFormat>;
  time?: string;
};

type LevelJson = {
  id: string;
  name: string;
  description: string;
  slots?: Slot[];
  slotTemplate?: SlotTemplate;
};

/** Tier structure for Math Olympiad; price comes from level.priceByProgramAndFormat[tierId]. */
type ProgramTierJson = {
  id: OlympiadTierId;
  slotCount: number;
  weeksPerSlot: number;
  hoursPerSlot: number;
};

type ProgramJson = {
  id: string;
  title: string;
  description: string;
  iconId: string;
  category: 'Half-Day Camps' | 'Full Day Camps';
  hoursPerWeek: string;
  ageGroup: string;
  ageGroupLabel?: string;
  startingPrice: number;
  image: string;
  details: ProgramDetails;
  /** Tier definitions for Math Olympiad (tier1, tier2). Pricing in level.priceByProgramAndFormat. */
  tiers?: ProgramTierJson[];
  levels: LevelJson[];
};

export type SummerCampDataJson = {
  programs: ProgramJson[];
};

const ICON_BY_ID: Record<string, LucideIcon> = {
  Calculator,
  Brain,
  Gamepad2,
  Bot,
  Code2,
  Lightbulb,
  PenTool,
};

const DEFAULT_TIME_BY_FORMAT: Record<'Online' | 'In-Person', string> = {
  'In-Person': '9:00 AM - 12:00 PM',
  Online: '1:00 PM - 4:00 PM',
};

function expandSlotTemplate(template: SlotTemplate): Slot[] {
  const time = template.time ?? DEFAULT_TIME_BY_FORMAT[template.defaultFormat];
  const firstProgramPrices = Object.values(template.priceByProgramAndFormat)[0];
  const price = firstProgramPrices?.[template.defaultFormat] ?? 0;
  return Array.from({ length: template.count }).map((_, i) => ({
    id: `${template.slotIdPrefix}-w${i + 1}`,
    label: `Week ${i + 1}`,
    time,
    format: template.defaultFormat,
    price,
  }));
}

function hydrateLevel(level: LevelJson): Level {
  const slots =
    level.slots ?? (level.slotTemplate ? expandSlotTemplate(level.slotTemplate) : []);
  const priceByProgramAndFormat = level.slotTemplate?.priceByProgramAndFormat;
  return {
    id: level.id,
    name: level.name,
    description: level.description,
    slots,
    ...(priceByProgramAndFormat && { priceByProgramAndFormat }),
  };
}

function hydrateProgram(program: ProgramJson): Program {
  const icon = ICON_BY_ID[program.iconId];
  if (!icon) {
    throw new Error(`Unknown iconId: ${program.iconId}`);
  }
  return {
    id: program.id,
    title: program.title,
    description: program.description,
    icon,
    category: program.category,
    hoursPerWeek: program.hoursPerWeek,
    ageGroup: program.ageGroup,
    ...(program.ageGroupLabel && { ageGroupLabel: program.ageGroupLabel }),
    startingPrice: program.startingPrice,
    image: program.image,
    details: program.details,
    levels: program.levels.map(hydrateLevel),
  };
}

function buildOlympiadTierConfig(
  tier: ProgramTierJson,
  priceByFormat: PriceByFormat
): OlympiadTierConfig {
  const slotId =
    tier.weeksPerSlot === 1
      ? (i: number) => `math-olympiad-${tier.id}-w${i + 1}`
      : (i: number) =>
          `math-olympiad-${tier.id}-w${i * 2 + 1}-${i * 2 + 2}`;
  return {
    id: tier.id,
    slotCount: tier.slotCount,
    weeksPerSlot: tier.weeksPerSlot,
    hoursPerSlot: tier.hoursPerSlot,
    slotId,
    priceByFormat,
  };
}

/** Hydrates raw JSON from public/api/mock/{locale}/summer-camp-programs.json into Program[] and OlympiadTierConfig[]. */
export function hydrateSummerCampData(raw: SummerCampDataJson): {
  programs: Program[];
  olympiadTierConfigs: OlympiadTierConfig[];
} {
  const programs = raw.programs.map(hydrateProgram);
  const mathOlympiad = raw.programs.find((p) => p.id === 'math-olympiad');
  const level0 = mathOlympiad?.levels[0];
  const priceByProgramAndFormat = level0?.slotTemplate?.priceByProgramAndFormat;
  const olympiadTierConfigs: OlympiadTierConfig[] =
    mathOlympiad?.tiers && priceByProgramAndFormat
      ? mathOlympiad.tiers.map((tier) =>
          buildOlympiadTierConfig(
            tier,
            priceByProgramAndFormat[tier.id] ?? {
              'In-Person': 0,
              Online: 0,
            }
          )
        )
      : [];
  return { programs, olympiadTierConfigs };
}

/** Fetches summer camp data from the mock API (same pattern as FAQ, academic, math, steam). Fallback to en if locale file missing. */
export async function fetchSummerCampData(locale: string): Promise<{
  programs: Program[];
  olympiadTierConfigs: OlympiadTierConfig[];
}> {
  const res = await fetch(`/api/mock/${locale}/summer-camp-programs.json`);
  if (!res.ok && locale !== 'en') {
    const fallback = await fetch('/api/mock/en/summer-camp-programs.json');
    if (!fallback.ok) throw new Error('Summer camp programs not found');
    const data: SummerCampDataJson = await fallback.json();
    return hydrateSummerCampData(data);
  }
  if (!res.ok) throw new Error('Summer camp programs not found');
  const data: SummerCampDataJson = await res.json();
  return hydrateSummerCampData(data);
}
