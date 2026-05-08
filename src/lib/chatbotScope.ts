/**
 * Shared GrowWise School chatbot scope (GWA-162).
 * SSOT for approved program categories, public contact email in chatbot UI, and contact-form intent keywords.
 */

import { CONTACT_INFO } from '@/lib/constants';

/** User-facing chatbot / LLM contact email (not legacy marketing domains). */
export const CHATBOT_PUBLIC_CONTACT_EMAIL = 'contact@growwiseschool.org' as const;

export const CHATBOT_BRAND_NAME = 'GrowWise School' as const;

/** Approved high-level categories for chatbot and assistant scope. */
export const CHATBOT_APPROVED_PROGRAM_CATEGORIES = [
  'Tutoring',
  'Accelerated Math',
  'English and Writing',
  'STEM Enrichment',
  'Coding',
  'AI',
  'Robotics',
  'Workshops',
  'Camps',
] as const;

export function formatChatbotApprovedCategoriesList(): string {
  return CHATBOT_APPROVED_PROGRAM_CATEGORIES.join(', ');
}

/** Rule-based intents that open the in-chat contact form (substring match on lowercased user text). */
export const CHATBOT_CONTACT_INTENTS = {
  assessment: ['assessment', 'trial', 'demo', 'free', 'evaluate', 'test'] as const,
  pricing: ['price', 'cost', 'fee', 'payment'] as const,
  scheduling: ['schedule', 'book', 'appointment', 'register', 'enroll'] as const,
  gettingStarted: ['start', 'begin', 'join', 'sign up', 'get started', 'interested'] as const,
} as const;

function inputMatchesAnyPhrase(input: string, phrases: readonly string[]): boolean {
  const lower = input.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}

export function chatbotAssessmentContactIntent(input: string): boolean {
  return inputMatchesAnyPhrase(input, CHATBOT_CONTACT_INTENTS.assessment);
}

export function chatbotPricingContactIntent(input: string): boolean {
  return inputMatchesAnyPhrase(input, CHATBOT_CONTACT_INTENTS.pricing);
}

export function chatbotSchedulingContactIntent(input: string): boolean {
  return inputMatchesAnyPhrase(input, CHATBOT_CONTACT_INTENTS.scheduling);
}

export function chatbotGettingStartedContactIntent(input: string): boolean {
  return inputMatchesAnyPhrase(input, CHATBOT_CONTACT_INTENTS.gettingStarted);
}

/** Contact blurb for rule-based replies and fallbacks (phone/address from shared site constants). */
export function buildChatbotContactReplyBody(): string {
  return `You can reach ${CHATBOT_BRAND_NAME} at:\n\n📞 Phone: ${CONTACT_INFO.phone}\n📧 Email: ${CHATBOT_PUBLIC_CONTACT_EMAIL}\n📍 Address: ${CONTACT_INFO.address}\n\nWe're here to answer questions about our programs. Our team typically responds within 24 hours.`;
}

/** Which in-chat lead form to open when intent matches (GWA-162). */
export type ChatbotFormType = 'assessment' | 'trial' | 'camp' | 'enroll' | 'contact';

/** Namespaced `source` string sent with form payloads for CRM filtering. */
export function chatbotFormSource(type: ChatbotFormType): string {
  return `chatbot-${type}`;
}

function normalizeUserText(input: unknown): string | null {
  if (input === undefined || input === null) return null;
  if (typeof input !== 'string') return null;
  const t = input.trim();
  return t.length === 0 ? null : t;
}

function matchesAssessment(lower: string): boolean {
  return lower.includes('assessment');
}

function matchesTrial(lower: string): boolean {
  return (
    lower.includes('30-minute') ||
    lower.includes('30 minute') ||
    lower.includes('trial') ||
    lower.includes('demo class')
  );
}

function matchesCamp(lower: string): boolean {
  return /\b(camps?)\b/i.test(lower);
}

/** Prefer whole-word `sign up` / `enroll` — avoid substring `book` inside e.g. `facebook`. */
function matchesEnroll(lower: string): boolean {
  if (lower.includes('enroll')) return true;
  if (lower.includes('sign up')) return true;
  return false;
}

function matchesContact(lower: string): boolean {
  if (lower.includes('talk to someone')) return true;
  if (lower.includes('send a message')) return true;
  if (lower.includes('reach out')) return true;
  if (lower.includes('contact form')) return true;
  if (lower.includes('talk to') && lower.includes('team')) return true;
  return false;
}

/**
 * Fixed priority when multiple keyword families match: assessment → trial → camp → enroll → contact.
 */
function explicitFormIntent(lower: string): ChatbotFormType | null {
  if (matchesAssessment(lower)) return 'assessment';
  if (matchesTrial(lower)) return 'trial';
  if (matchesCamp(lower)) return 'camp';
  if (matchesEnroll(lower)) return 'enroll';
  if (matchesContact(lower)) return 'contact';
  return null;
}

function isVagueAffirmative(lower: string, trimmedLower: string): boolean {
  if (trimmedLower === 'yes' || trimmedLower === 'yep') return true;
  if (lower.includes('tell me more')) return true;
  if (lower.includes("i'm interested") || lower.includes('im interested')) return true;
  if (trimmedLower === 'interested') return true;
  return false;
}

/**
 * Maps free-text user input to an in-chat form type, or null.
 * When `pageDefault` is set (from page-aware context), bare affirmatives like "yes" map to that form.
 */
export function chatbotFormIntent(
  input: unknown,
  pageDefault?: ChatbotFormType | null,
): ChatbotFormType | null {
  const trimmed = normalizeUserText(input);
  if (trimmed === null) return null;
  const lower = trimmed.toLowerCase();

  const explicit = explicitFormIntent(lower);
  if (explicit) return explicit;

  if (pageDefault != null && isVagueAffirmative(lower, lower)) {
    return pageDefault;
  }

  return null;
}
