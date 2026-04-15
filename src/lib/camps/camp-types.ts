/**
 * Strongly typed model for SEO camp landing pages.
 * One `CampLandingPage` object = one routable `/camps/[slug]` page.
 * Routing/static params: see `camp-routes.ts` (collision guard vs `/camps/summer` & `/camps/winter`).
 */

export type CampThemeVariant = "default" | "stem" | "creative";

export type CampCta = {
  label: string;
  href: string;
};

export type CampBadge = {
  text: string;
};

export type CampTrustBarItem = {
  text: string;
};

export type CampProgramCard = {
  title: string;
  description: string;
  bullets?: readonly string[];
};

export type CampScheduleRow = {
  /** e.g. "Schedule", "Format", "Capacity" */
  label: string;
  /** Primary cell (time block, format, etc.) */
  primary: string;
  /** Optional supporting detail */
  detail?: string;
};

export type CampServedCity = {
  name: string;
  /** Natural-language note (no fabricated precision). */
  note?: string;
};

export type CampDriveTime = {
  areaLabel: string;
  /** Soft framing only — avoid numeric claims unless verified. */
  description: string;
};

export type CampFaqItem = {
  question: string;
  answer: string;
};

export type CampFormFieldId =
  | "parentName"
  | "email"
  | "phone"
  | "childGrade"
  | "city"
  | "campInterest"
  | "message";

export type CampFormConfig = {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionSubtext?: string;
  /** Pre-filled camp interest value for this page */
  defaultCampInterest: string;
  submitLabel: string;
  /** Shown after submit — honest “not wired yet” messaging */
  notConnectedNotice: string;
};

export type CampLandingPage = {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  /** Used for Open Graph / consistency */
  ogTitle?: string;
  h1: string;
  eyebrow: string;
  heroSubtext: string;
  primaryCta: CampCta;
  secondaryCta: CampCta;
  /** Optional — omit if nothing verified */
  earlyBirdText?: string;
  trustBarItems: readonly CampTrustBarItem[];
  programCards: readonly CampProgramCard[];
  scheduleRows: readonly CampScheduleRow[];
  servedCities: readonly CampServedCity[];
  driveTimes: readonly CampDriveTime[];
  faqItems: readonly CampFaqItem[];
  formConfig: CampFormConfig;
  stickyCtaText: string;
  stickyCtaButton: CampCta;
  themeVariant: CampThemeVariant;
  badges?: readonly CampBadge[];
  /** Optional narrative blocks for bespoke sections (kept structured, not free HTML) */
  pageIntro?: {
    title: string;
    paragraphs: readonly string[];
  };
  proofStrip?: {
    title: string;
    bullets: readonly string[];
  };
  /** Optional short notes for future section scaffolding (not rendered unless wired). */
  notes?: readonly string[];
};
