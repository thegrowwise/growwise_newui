import type { LucideIcon } from 'lucide-react';
import { Calculator, Brain, Gamepad2, Bot, Code2, Lightbulb, PenTool } from 'lucide-react';

export type Slot = {
  id: string;
  label: string;
  time: string;
  format: 'Online' | 'In-Person';
  price: number;
};

export type Level = {
  id: string;
  name: string;
  description: string;
  slots: Slot[];
};

export type ProgramDetails = {
  /** e.g. "Monday – Friday" */
  schedule: string;
  daysPerWeek: number;
  /** e.g. "3 hours / day" */
  dailyHours: string;
  /** Bullet-point list of what is included */
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
  /** Total number of bookable slots offered under this tier. */
  readonly slotCount: number;
  /** Calendar weeks covered per slot (1 for Tier 1, 2 for Tier 2). */
  readonly weeksPerSlot: number;
  /** Training hours included per slot. */
  readonly hoursPerSlot: number;
  /** Generates a stable, unique slot ID for the given slot index. */
  readonly slotId: (index: number) => string;
  readonly price: number;
};

/** Ordered, exhaustive list of Olympiad tier configurations. */
export const MATH_OLYMPIAD_TIER_CONFIGS: OlympiadTierConfig[] = [
  {
    id: 'tier1',
    slotCount: 8,
    weeksPerSlot: 1,
    hoursPerSlot: 15,
    slotId: (i: number) => `math-olympiad-tier1-w${i + 1}`,
    price: 449,
  },
  {
    id: 'tier2',
    slotCount: 4,
    weeksPerSlot: 2,
    hoursPerSlot: 30,
    slotId: (i: number) => `math-olympiad-tier2-w${i * 2 + 1}-${i * 2 + 2}`,
    price: 449,
  },
];

const generateWeeklySlots = (
  programId: string,
  basePrice: number,
  format: 'Online' | 'In-Person',
  hours: string
): Slot[] => {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: `${programId}-w${i + 1}`,
    label: `Week ${i + 1} (${hours})`,
    time: format === 'Online' ? '1:00 PM - 4:00 PM' : '9:00 AM - 12:00 PM',
    format,
    price: basePrice,
  }));
};

export const SUMMER_CAMP_PROGRAMS: Program[] = [
  // Half-Day
  {
    id: 'adv-math',
    title: 'Advanced Math (Alg + Precal)',
    description: 'Accelerated track covering Algebra and Pre-Calculus fundamentals.',
    icon: Calculator,
    category: 'Half-Day Camps',
    hoursPerWeek: '9 hours a week',
    ageGroup: 'Grades 7-10',
    startingPrice: 299,
    image: '/images/camps/advanced-math.png',
    details: {
      schedule: 'Monday – Friday',
      daysPerWeek: 5,
      dailyHours: '3 hours / day',
      includes: [
        'Algebra or Pre-Calculus curriculum (your choice)',
        'Expert instructor-led sessions',
        'Daily practice problem sets',
        'Weekly progress report for parents',
        'Certificate of completion',
      ],
    },
    levels: [
      {
        id: 'math-weekly',
        name: 'Weekly Intensive',
        description: 'Master one major topic per week with expert guidance.',
        slots: generateWeeklySlots('adv-math', 299, 'In-Person', '9 hrs/wk'),
      },
    ],
  },
  {
    id: 'math-olympiad',
    title: 'Math Olympiad (AMC8/MOEMS)',
    description: 'Competitive math strategies focusing on AMC8 and MOEMS.',
    icon: Brain,
    category: 'Half-Day Camps',
    hoursPerWeek: '15 hours a week',
    ageGroup: 'Grades 4-8',
    startingPrice: 449,
    image: '/images/camps/math-olympiad.png',
    details: {
      schedule: 'Monday – Friday',
      daysPerWeek: 5,
      dailyHours: 'Tier 1: 3 hrs / day · Tier 2: 6 hrs / day',
      includes: [
        'AMC8 & MOEMS-aligned curriculum',
        'Timed mock competition tests',
        'Competition strategy & problem-solving techniques',
        'Detailed score analysis after each test',
        'Take-home practice workbook',
      ],
    },
    levels: [
      {
        id: 'mo-weekly',
        name: 'Competition Track',
        description: 'High-intensity problem solving and rally races.',
        slots: generateWeeklySlots('math-olympiad', 449, 'In-Person', '15 hrs/wk'),
      },
    ],
  },
  {
    id: 'ai-entrepreneur',
    title: 'AI Entrepreneur Studio',
    description: 'Learn to build businesses leveraging AI automation tools.',
    icon: Lightbulb,
    category: 'Half-Day Camps',
    hoursPerWeek: '30 hours a week',
    ageGroup: 'Grades 8-12',
    startingPrice: 349,
    image: '/images/camps/ai-entrepreneur.png',
    details: {
      schedule: 'Monday – Friday',
      daysPerWeek: 5,
      dailyHours: '6 hours / day',
      includes: [
        'Hands-on AI tools: ChatGPT, Midjourney, automation platforms',
        'Business model canvas & pitch deck creation',
        'Prompt engineering fundamentals',
        'Live demo day — present your startup idea',
        'Mentor feedback sessions',
      ],
    },
    levels: [
      {
        id: 'ai-weekly',
        name: 'Startup Lab',
        description: 'Prompt engineering meets business development.',
        slots: generateWeeklySlots('ai-entrepreneur', 349, 'Online', '30 hrs/wk'),
      },
    ],
  },
  {
    id: 'scratch-online',
    title: 'Scratch (Online)',
    description: 'Introductory visual programming for young creators.',
    icon: Code2,
    category: 'Half-Day Camps',
    hoursPerWeek: '9 hours a week',
    ageGroup: 'Ages 7-10',
    startingPrice: 249,
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=85&w=650&h=450',
    details: {
      schedule: 'Monday – Friday',
      daysPerWeek: 5,
      dailyHours: '1.5 hours / day',
      includes: [
        'Scratch visual programming environment',
        'Animated story & interactive game projects',
        'Introduction to loops, conditionals & variables',
        'Shareable project portfolio at end of week',
        'Live online sessions with screen-share support',
      ],
    },
    levels: [
      {
        id: 'scratch-weekly',
        name: 'Visual Coding',
        description: 'Fundamental logic through drag-and-drop games.',
        slots: generateWeeklySlots('scratch-online', 249, 'Online', '9 hrs/wk'),
      },
    ],
  },

  // Full Day
  {
    id: 'robotics-camp',
    title: 'Robotics Camp',
    description: 'Full-day engineering immersive with advanced sensor arrays.',
    icon: Bot,
    category: 'Full Day Camps',
    hoursPerWeek: '30 hours per week',
    ageGroup: 'Ages 9-14',
    startingPrice: 539,
    image: '/images/camps/robotics.png',
    details: {
      schedule: 'Monday – Friday',
      daysPerWeek: 5,
      dailyHours: '6 hours / day',
      includes: [
        'Build & program a working robot from scratch',
        'Sensor arrays: ultrasonic, IR & colour sensors',
        'Mechanical design + logic programming',
        'Daily team engineering challenges',
        'Final robot showcase on Friday',
      ],
    },
    levels: [
      {
        id: 'bot-weekly',
        name: 'Engineering Lab',
        description: 'Full day on-site mechanical design and logic programming.',
        slots: Array.from({ length: 8 }).map((_, i) => ({
          id: `robotics-camp-f-w${i + 1}`,
          label: `Week ${i + 1} (30 hrs/wk)`,
          time: '9:00 AM - 4:00 PM',
          format: 'In-Person' as const,
          price: 539,
        })),
      },
    ],
  },
  {
    id: 'young-authors',
    title: 'Young Authors Camp',
    description: 'Immersive full-day writing studio for aspiring novelists.',
    icon: PenTool,
    category: 'Full Day Camps',
    hoursPerWeek: '30 hours per week',
    ageGroup: 'Grades 3-7',
    startingPrice: 499,
    image: '/images/camps/young-authors.png',
    details: {
      schedule: 'Monday – Friday',
      daysPerWeek: 5,
      dailyHours: '6 hours / day',
      includes: [
        'Story structure, plot & character development',
        'Daily creative writing workshops',
        'Peer review & revision sessions',
        'Illustration basics for your story',
        'Professionally printed copy of your finished book',
      ],
    },
    levels: [
      {
        id: 'author-weekly',
        name: 'Writing Studio',
        description: 'Comprehensive daily workshop to publish your own story.',
        slots: Array.from({ length: 8 }).map((_, i) => ({
          id: `authors-f-w${i + 1}`,
          label: `Week ${i + 1} (30 hrs/wk)`,
          time: '9:00 AM - 4:00 PM',
          format: 'In-Person' as const,
          price: 499,
        })),
      },
    ],
  },
  // Roblox (In-Person) — Half-Day
  {
    id: 'roblox-in-person',
    title: 'Roblox (In-Person)',
    description: 'Master Lua scripting in a collaborative on-site environment.',
    icon: Gamepad2,
    category: 'Half-Day Camps',
    hoursPerWeek: '15 hours per week',
    ageGroup: 'Ages 8-12',
    startingPrice: 399,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=85&w=650&h=450',
    details: {
      schedule: 'Monday – Friday',
      daysPerWeek: 5,
      dailyHours: '3 hours / day',
      includes: [
        'Lua scripting fundamentals in Roblox Studio',
        'Game mechanics design & world-building',
        'Multiplayer scripting & game testing',
        'Collaborative team game project',
        'Published game on Roblox platform by end of week',
      ],
    },
    levels: [
      {
        id: 'rob-ip-weekly',
        name: 'Dev Studio',
        description: 'Deep dive into game mechanics and multiplayer scripting.',
        slots: Array.from({ length: 8 }).map((_, i) => ({
          id: `roblox-h-w${i + 1}`,
          label: `Week ${i + 1} (15 hrs/wk)`,
          time: '9:00 AM - 12:00 PM',
          format: 'In-Person' as const,
          price: 399,
        })),
      },
    ],
  },
];
