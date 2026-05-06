/**
 * Single-week Event JSON-LD for flagship summer camp landing slugs.
 * Dates align with marketing 2026 one-week sessions; adjust when schedules change.
 */
export const CAMP_SLUG_SUMMER_WEEK_EVENT: Record<
  string,
  { name: string; startDate: string; endDate: string; description: string }
> = {
  'ai-studio-dublin-ca': {
    name: 'AI Studio Summer Camp — Dublin, CA',
    startDate: '2026-06-16',
    endDate: '2026-06-20',
    description:
      'Project-based AI and machine learning summer camp for grades 6–12 in Dublin, CA. Students build real AI models and leave with a completed project.',
  },
  'game-development-camp-dublin-ca': {
    name: 'Game Development Summer Camp — Dublin, CA',
    startDate: '2026-06-23',
    endDate: '2026-06-27',
    description:
      'Game development summer camp for grades 5–12 in Dublin, CA. Students design, build, and publish a complete game using industry tools.',
  },
  'math-olympiad-camp-dublin-ca': {
    name: 'Math Olympiad Summer Camp — Dublin, CA',
    startDate: '2026-07-07',
    endDate: '2026-07-11',
    description:
      'AMC8-focused math competition prep camp for grades 5–8 in Dublin, CA. Small groups, structured problem-solving, and expert instruction at GrowWise.',
  },
  'young-authors-camp-dublin-ca': {
    name: 'Young Authors Summer Camp — Dublin, CA',
    startDate: '2026-07-14',
    endDate: '2026-07-18',
    description:
      'Creative and structured writing summer camp for grades 3–8 in Dublin, CA. Students draft, revise, and finish a publishing-ready manuscript.',
  },
  'robotics-camp-dublin-ca': {
    name: 'Robotics Summer Camp — Dublin, CA',
    startDate: '2026-07-21',
    endDate: '2026-07-25',
    description:
      'Hands-on robotics summer camp for grades 4–9 in Dublin, CA. Students build and program robots from scratch using real engineering principles.',
  },
}
