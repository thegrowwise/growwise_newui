/**
 * Type-safe form thank-you page content. Copy lives in per-locale JSON (currently en).
 */

export const FORM_THANK_YOU_IDS = [
  'book-assessment',
  'enroll',
  'enroll-academic',
  'contact',
] as const;

export type FormThankYouId = (typeof FORM_THANK_YOU_IDS)[number];

export interface FormThankYouCta {
  label: string;
  /** Site path without locale prefix, e.g. /book-assessment */
  path: string;
}

export interface FormThankYouContent {
  version: number;
  /** Used for <title> and Open Graph */
  metaTitle: string;
  metaDescription: string;
  /** H1 (visible) */
  title: string;
  /** Optional short line above the title */
  kicker?: string;
  /** One or more body paragraphs */
  body: string[];
  /** Optional icon rows (e.g. assessment) */
  highlights?: ReadonlyArray<{ text: string }>;
  /** Primary CTA (e.g. "Book again") */
  primaryCta: FormThankYouCta;
  /** Optional second action */
  secondaryCta?: FormThankYouCta;
  /** Text link back to a parent page */
  backLink: FormThankYouCta;
}

export type FormThankYouContentMap = Record<FormThankYouId, FormThankYouContent>;
