import type { CampLandingPage } from "./camp-types";

const FORM_NOTICE =
  "This inquiry form is not connected to enrollment processing yet. For a timely response, please call (925) 456-4606 or email connect@thegrowwise.com.";

const SHARED_SERVED = [
  { name: "San Ramon", note: "Common commute for camp families" },
  { name: "Pleasanton", note: "Common commute for camp families" },
  { name: "Livermore", note: "Common commute for camp families" },
  { name: "Danville", note: "Common commute for camp families" },
] as const;

const SHARED_DRIVES = [
  {
    areaLabel: "Tri-Valley area",
    description:
      "Drive time varies by route and time of day. Many families from nearby cities reach our Dublin campus in a typical local commute.",
  },
] as const;

const SHARED_SCHEDULE = [
  {
    label: "Season",
    primary: "Summer (specific session dates confirmed at enrollment)",
    detail: "We’ll align you with the correct week and format for this track.",
  },
  {
    label: "Typical day structure",
    primary: "Structured blocks with instruction, practice, and project time",
    detail: "Exact timing depends on the camp format you select.",
  },
  {
    label: "Enrollment",
    primary: "Inquiry → placement conversation → confirmation",
    detail: "We’ll confirm availability and next steps directly with your family.",
  },
] as const;

const BASE_TRUST = [
  { text: "One Dublin, CA campus — clear, consistent operations" },
  { text: "Structured curriculum with accountable outcomes" },
  { text: "Families from across the Tri-Valley choose GrowWise for rigor + care" },
] as const;

export const CAMP_LANDING_PAGES: readonly CampLandingPage[] = [
  {
    slug: "ai-studio-dublin-ca",
    seoTitle: "AI Studio Summer Camp in Dublin, CA | GrowWise School",
    metaDescription:
      "A structured AI Studio summer experience at GrowWise in Dublin, CA—built for Tri-Valley families seeking serious skill-building, not hype. Inquiry-first enrollment.",
    h1: "AI Studio Summer Camp (Dublin, CA)",
    eyebrow: "GrowWise School · Summer · Dublin campus",
    heroSubtext:
      "Learn how modern AI tools fit into real workflows—prompt discipline, evaluation, and responsible use—inside a structured studio format. Instruction happens at our Dublin campus; families routinely join us from across the Tri-Valley.",
    primaryCta: { label: "Request a seat", href: "#inquiry" },
    secondaryCta: { label: "View schedule details", href: "#schedule" },
    earlyBirdText: "Ask about summer timing and placement during your inquiry.",
    trustBarItems: BASE_TRUST,
    programCards: [
      {
        title: "Studio projects",
        description:
          "Work through guided builds that emphasize clarity, iteration, and review—skills that transfer to school and independent learning.",
        bullets: [
          "Emphasis on problem framing and measurable outputs",
          "Explicit expectations for documentation and revision",
        ],
      },
      {
        title: "Responsible use + rigor",
        description:
          "We teach students to treat AI as a tool within constraints: attribution, verification, and academic integrity expectations.",
        bullets: [
          "Structured prompts and evaluation habits",
          "Age-appropriate guardrails discussed in plain language",
        ],
      },
      {
        title: "Presentation-ready finish",
        description:
          "Students consolidate work into a concise artifact they can explain—what changed, why it matters, and what they’d improve next.",
      },
    ],
    scheduleRows: SHARED_SCHEDULE,
    servedCities: SHARED_SERVED,
    driveTimes: SHARED_DRIVES,
    faqItems: [
      {
        question: "Where is the program held?",
        answer:
          "At GrowWise’s Dublin, CA campus. We have one physical campus; nearby cities such as San Ramon, Pleasanton, Livermore, and Danville are served areas families commonly travel from—not separate locations.",
      },
      {
        question: "Is this a “fun-only” camp?",
        answer:
          "It’s designed to be engaging, but the emphasis is structured learning and measurable progress. Expect clear expectations, practice, and instructor feedback.",
      },
      {
        question: "What should we bring?",
        answer:
          "We’ll confirm materials and device expectations after inquiry based on the cohort and week. If you have accessibility needs, tell us during your inquiry.",
      },
    ],
    formConfig: {
      sectionEyebrow: "Inquiry",
      sectionTitle: "Request information (AI Studio)",
      sectionSubtext:
        "Share your child’s grade and city so we can respond with the right next step.",
      defaultCampInterest: "AI Studio — Dublin, CA",
      submitLabel: "Submit inquiry",
      notConnectedNotice: FORM_NOTICE,
    },
    stickyCtaText: "Ready to discuss placement for AI Studio?",
    stickyCtaButton: { label: "Go to inquiry", href: "#inquiry" },
    themeVariant: "stem",
    badges: [{ text: "Dublin campus" }, { text: "Structured studio format" }],
  },
  {
    slug: "robotics-camp-dublin-ca",
    seoTitle: "Robotics Summer Camp in Dublin, CA | GrowWise School",
    metaDescription:
      "Hands-on robotics summer camp at GrowWise in Dublin, CA. Engineering habits, build-test cycles, and accountable instruction for Tri-Valley families.",
    h1: "Robotics Summer Camp (Dublin, CA)",
    eyebrow: "GrowWise School · Summer · Dublin campus",
    heroSubtext:
      "Build engineering habits through repeated build-test cycles: mechanics, sensors, and code coming together as a system. Camp runs at our Dublin campus; many families commute from San Ramon, Pleasanton, Livermore, and Danville.",
    primaryCta: { label: "Request a seat", href: "#inquiry" },
    secondaryCta: { label: "See program structure", href: "#program" },
    earlyBirdText: "Ask about cohort capacity and week placement during inquiry.",
    trustBarItems: BASE_TRUST,
    programCards: [
      {
        title: "Mechanisms + control",
        description:
          "Students work through assemblies and behaviors where small changes have visible results—useful for building real intuition.",
        bullets: ["Iterative debugging as a normal part of learning", "Clear checkpoints instead of open-ended chaos"],
      },
      {
        title: "Sensors and decision-making",
        description:
          "Introduce sensing and logic in a way students can explain: what the robot perceives, what it does next, and why.",
      },
      {
        title: "Team communication",
        description:
          "Roles, handoffs, and short standups—professional habits that keep projects moving without turning camp into chaos.",
      },
    ],
    scheduleRows: SHARED_SCHEDULE,
    servedCities: SHARED_SERVED,
    driveTimes: SHARED_DRIVES,
    faqItems: [
      {
        question: "Do you offer robotics at multiple GrowWise campuses?",
        answer:
          "No. GrowWise operates one physical campus in Dublin, CA. Families join us from nearby cities; those are served areas, not additional campuses.",
      },
      {
        question: "What age range is appropriate?",
        answer:
          "Placement depends on prior experience and cohort fit. Tell us your child’s grade and background in the inquiry form, and we’ll recommend the right entry point.",
      },
      {
        question: "Will students compete?",
        answer:
          "The emphasis is skill-building and engineering practice. If a cohort benefits from a challenge format, we frame it as learning-first—not hype.",
      },
    ],
    formConfig: {
      sectionEyebrow: "Inquiry",
      sectionTitle: "Request information (Robotics)",
      defaultCampInterest: "Robotics — Dublin, CA",
      submitLabel: "Submit inquiry",
      notConnectedNotice: FORM_NOTICE,
    },
    stickyCtaText: "Discuss robotics placement with our team.",
    stickyCtaButton: { label: "Inquiry form", href: "#inquiry" },
    themeVariant: "stem",
    badges: [{ text: "Build-test cycles" }, { text: "Dublin campus" }],
  },
  {
    slug: "game-development-camp-dublin-ca",
    seoTitle: "Game Development Summer Camp in Dublin, CA | GrowWise School",
    metaDescription:
      "Game development summer camp at GrowWise in Dublin, CA: systems thinking, implementation discipline, and reviewable milestones—built for Tri-Valley families who want substance, not gimmicks.",
    h1: "Game Development Summer Camp (Dublin, CA)",
    eyebrow: "GrowWise School · Summer · Dublin campus",
    heroSubtext:
      "Turn an idea into a playable loop with clear milestones: mechanics, pacing, and debugging as core skills. Instruction is at our Dublin campus; families from Pleasanton, San Ramon, Livermore, and Danville regularly enroll.",
    primaryCta: { label: "Request a seat", href: "#inquiry" },
    secondaryCta: { label: "Review the tracks", href: "#program" },
    trustBarItems: BASE_TRUST,
    programCards: [
      {
        title: "Core loop first",
        description:
          "Students anchor on a tight gameplay loop before expanding scope—this prevents endless feature creep and teaches prioritization.",
      },
      {
        title: "Implementation discipline",
        description:
          "Versioning habits, readable structure, and test plans—skills that map directly to future CS coursework and projects.",
        bullets: ["Debugging strategies students can reuse", "Milestones you can observe at home"],
      },
      {
        title: "Playtest + revision",
        description:
          "Short feedback cycles: observe confusion, adjust, repeat—how real products improve without relying on talent myths.",
      },
    ],
    scheduleRows: SHARED_SCHEDULE,
    servedCities: SHARED_SERVED,
    driveTimes: SHARED_DRIVES,
    faqItems: [
      {
        question: "Is this only about playing games?",
        answer:
          "No. The focus is building—design constraints, implementation, debugging, and iteration. Playtesting is part of quality, not the end goal.",
      },
      {
        question: "Where is camp located?",
        answer:
          "At GrowWise in Dublin, CA. We do not operate additional physical campuses in other cities.",
      },
      {
        question: "What platform do you use?",
        answer:
          "We’ll confirm tooling and device expectations after inquiry based on cohort placement. If you have constraints, note them in your message.",
      },
    ],
    formConfig: {
      sectionEyebrow: "Inquiry",
      sectionTitle: "Request information (Game Development)",
      defaultCampInterest: "Game Development — Dublin, CA",
      submitLabel: "Submit inquiry",
      notConnectedNotice: FORM_NOTICE,
    },
    stickyCtaText: "Ask about game dev cohort placement.",
    stickyCtaButton: { label: "Submit inquiry", href: "#inquiry" },
    themeVariant: "creative",
    badges: [{ text: "Milestone-based builds" }],
  },
  {
    slug: "math-olympiad-camp-dublin-ca",
    seoTitle: "Math Olympiad Summer Camp in Dublin, CA | GrowWise School",
    metaDescription:
      "Challenging, structured math olympiad-style summer work at GrowWise in Dublin, CA—problem-solving discipline for motivated Tri-Valley students.",
    h1: "Math Olympiad Summer Camp (Dublin, CA)",
    eyebrow: "GrowWise School · Summer · Dublin campus",
    heroSubtext:
      "Deep problem-solving with explicit strategies: representation, invariants, and proof sketches where appropriate. All instruction is at our Dublin campus; families commute from across the Tri-Valley for focused math work.",
    primaryCta: { label: "Request a seat", href: "#inquiry" },
    secondaryCta: { label: "See how the week is structured", href: "#schedule" },
    trustBarItems: BASE_TRUST,
    programCards: [
      {
        title: "Problem-solving toolkit",
        description:
          "Students practice recognizing structure, choosing tactics, and writing clear justification—habits that transfer to advanced coursework.",
        bullets: ["Explicit reflection after each attempt", "Coachable feedback loops"],
      },
      {
        title: "Tiered challenge",
        description:
          "Problems are sequenced so students can earn progress without getting stuck in guesswork—rigor without theatrics.",
      },
      {
        title: "Mathematical communication",
        description:
          "Short explanations and clean notation matter. We treat clear reasoning as part of the scorecard, not an afterthought.",
      },
    ],
    scheduleRows: SHARED_SCHEDULE,
    servedCities: SHARED_SERVED,
    driveTimes: SHARED_DRIVES,
    faqItems: [
      {
        question: "Is this only for competition winners?",
        answer:
          "No. It’s for students who want serious training. Placement depends on readiness and goals—tell us your child’s background in the inquiry.",
      },
      {
        question: "Where do classes meet?",
        answer:
          "At GrowWise’s Dublin campus. Nearby cities are served areas families travel from; we do not list separate campuses elsewhere.",
      },
      {
        question: "Do you guarantee contest outcomes?",
        answer:
          "We do not promise rankings or awards. We do promise structured practice, feedback, and intellectual honesty about next steps.",
      },
    ],
    formConfig: {
      sectionEyebrow: "Inquiry",
      sectionTitle: "Request information (Math Olympiad)",
      defaultCampInterest: "Math Olympiad — Dublin, CA",
      submitLabel: "Submit inquiry",
      notConnectedNotice: FORM_NOTICE,
    },
    stickyCtaText: "Discuss readiness for Olympiad-style training.",
    stickyCtaButton: { label: "Inquiry", href: "#inquiry" },
    themeVariant: "default",
    badges: [{ text: "Rigor without theatrics" }],
  },
  {
    slug: "robotics-full-day-dublin-ca",
    seoTitle: "Full-Day Robotics Summer Camp in Dublin, CA | GrowWise School",
    metaDescription:
      "Full-day robotics summer option at GrowWise in Dublin, CA—longer build cycles, deeper testing, and structured supervision for working Tri-Valley parents.",
    h1: "Full-Day Robotics Summer Camp (Dublin, CA)",
    eyebrow: "GrowWise School · Summer · Dublin campus",
    heroSubtext:
      "A full-day format gives students time to go deeper: integration, reliability, and iteration across a full project arc. Camp is held at our Dublin campus only; many parents commute from San Ramon and Pleasanton for a single drop-off location they trust.",
    primaryCta: { label: "Request a seat", href: "#inquiry" },
    secondaryCta: { label: "Compare formats", href: "#program" },
    earlyBirdText: "Ask whether full-day is the best fit for your goals and schedule.",
    trustBarItems: BASE_TRUST,
    programCards: [
      {
        title: "Project arc",
        description:
          "Longer blocks support meaningful milestones—design, build, test, refine—without rushing the learning.",
      },
      {
        title: "Reliability engineering",
        description:
          "Students learn why robots fail intermittently: connections, power, sensor noise, and software state—real engineering realities.",
        bullets: ["Checklists and test plans students can reuse", "Coach-led retrospectives"],
      },
      {
        title: "Parent-friendly structure",
        description:
          "Clear start/end expectations and predictable communication—built for families balancing work schedules.",
      },
    ],
    scheduleRows: [
      {
        label: "Format",
        primary: "Full-day schedule (details confirmed at enrollment)",
        detail: "Exact hours and breaks are communicated after inquiry for the selected week.",
      },
      ...SHARED_SCHEDULE.slice(1),
    ],
    servedCities: SHARED_SERVED,
    driveTimes: SHARED_DRIVES,
    faqItems: [
      {
        question: "Is full-day available every week?",
        answer:
          "Availability depends on cohorts and staffing. Submit an inquiry with your preferred weeks and we’ll confirm what’s possible.",
      },
      {
        question: "Is this a different campus than your other robotics offering?",
        answer:
          "No. GrowWise has one physical campus in Dublin, CA. Full-day is a format option, not a different location.",
      },
      {
        question: "What about lunch?",
        answer:
          "We’ll share the camp day structure and any lunch guidance after inquiry based on the week and cohort policies.",
      },
    ],
    formConfig: {
      sectionEyebrow: "Inquiry",
      sectionTitle: "Request information (Robotics — full day)",
      defaultCampInterest: "Robotics Full Day — Dublin, CA",
      submitLabel: "Submit inquiry",
      notConnectedNotice: FORM_NOTICE,
    },
    stickyCtaText: "Ask about full-day robotics availability.",
    stickyCtaButton: { label: "Inquiry form", href: "#inquiry" },
    themeVariant: "stem",
    badges: [{ text: "Full-day format" }, { text: "Dublin campus" }],
  },
  {
    slug: "young-authors-camp-dublin-ca",
    seoTitle: "Young Authors Summer Camp in Dublin, CA | GrowWise School",
    metaDescription:
      "Young Authors summer camp at GrowWise in Dublin, CA: drafting, revision, and publishing-ready habits—structured writing instruction for Tri-Valley families.",
    h1: "Young Authors Summer Camp (Dublin, CA)",
    eyebrow: "GrowWise School · Summer · Dublin campus",
    heroSubtext:
      "Students move from idea to finished piece with explicit stages: planning, drafting, revision, and polish. Camp meets at our Dublin campus; families from Danville, Livermore, Pleasanton, and San Ramon often choose GrowWise for writing that’s both rigorous and kind.",
    primaryCta: { label: "Request a seat", href: "#inquiry" },
    secondaryCta: { label: "See the writing arc", href: "#program" },
    trustBarItems: BASE_TRUST,
    programCards: [
      {
        title: "Process over vibes",
        description:
          "Revision is treated as normal—not punishment—with checkpoints that keep momentum and raise quality.",
        bullets: ["Clear rubric language students can use", "Peer feedback with guardrails"],
      },
      {
        title: "Voice + structure",
        description:
          "We balance mechanics with meaning: sentence clarity, organization, and purpose—without turning writing into a formula stunt.",
      },
      {
        title: "A finish line students can hold",
        description:
          "Students aim for a completed piece they can read aloud or submit—confidence comes from completion habits.",
      },
    ],
    scheduleRows: SHARED_SCHEDULE,
    servedCities: SHARED_SERVED,
    driveTimes: SHARED_DRIVES,
    faqItems: [
      {
        question: "Will my child ‘publish’ a book?",
        answer:
          "The goal is strong finished writing and publishing-ready habits. Any physical publishing talk is optional and depends on cohort plans—ask during inquiry.",
      },
      {
        question: "Where is the camp held?",
        answer:
          "At GrowWise in Dublin, CA. We operate one campus; nearby cities are places families travel from.",
      },
      {
        question: "My child resists writing—will this work?",
        answer:
          "We focus on small wins and predictable steps. Share your context in the inquiry so we can recommend the right entry point.",
      },
    ],
    formConfig: {
      sectionEyebrow: "Inquiry",
      sectionTitle: "Request information (Young Authors)",
      defaultCampInterest: "Young Authors — Dublin, CA",
      submitLabel: "Submit inquiry",
      notConnectedNotice: FORM_NOTICE,
    },
    stickyCtaText: "Discuss Young Authors placement.",
    stickyCtaButton: { label: "Go to inquiry", href: "#inquiry" },
    themeVariant: "creative",
    badges: [{ text: "Draft → revise → polish" }],
  },
];
