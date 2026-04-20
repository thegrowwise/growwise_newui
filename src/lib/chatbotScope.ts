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
