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
};

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
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1509228468518-180dd482180c?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400',
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
  {
    id: 'roblox-in-person',
    title: 'Roblox (In-Person)',
    description: 'Master Lua scripting in a collaborative on-site environment.',
    icon: Gamepad2,
    category: 'Full Day Camps',
    hoursPerWeek: '30 hours per week',
    ageGroup: 'Ages 8-12',
    startingPrice: 399,
    image: 'https://images.unsplash.com/photo-1605898399738-4e3a9870630b?auto=format&fit=crop&q=80&w=400',
    levels: [
      {
        id: 'rob-ip-weekly',
        name: 'Dev Studio',
        description: 'Deep dive into game mechanics and multiplayer scripting.',
        slots: Array.from({ length: 8 }).map((_, i) => ({
          id: `roblox-f-w${i + 1}`,
          label: `Week ${i + 1} (30 hrs/wk)`,
          time: '9:00 AM - 4:00 PM',
          format: 'In-Person' as const,
          price: 399,
        })),
      },
    ],
  },
];
