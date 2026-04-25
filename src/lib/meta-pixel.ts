import { sendCAPIEventFromBrowser } from '@/lib/capiClient';
import type { CAPICustomData } from '@/lib/capi';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a UUID for event deduplication.
 * crypto.randomUUID() is available in Node 14.17+ and all modern browsers.
 * Falls back to a timestamp+random string for older Safari.
 */
function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Fire a browser fbq() call and a parallel CAPI server call with the same event_id.
 *
 * Meta uses the shared event_id to deduplicate: it counts the event once in reporting
 * while preferring the higher-quality server signal for attribution.
 *
 * CAPI call is fire-and-forget — it never blocks the UI or throws.
 */
function trackWithCAPI(
  event: string,
  params?: CAPICustomData,
  userData?: { em?: string; ph?: string; fn?: string; ln?: string }
): void {
  const eventId = generateEventId();

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params ?? {}, { eventID: eventId });
  }

  sendCAPIEventFromBrowser(event, params, eventId, userData);
}

/** Browser-only fbq track — for non-standard events not in the CAPI allowed list. */
function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

// ---------------------------------------------------------------------------
// Public track functions
// ---------------------------------------------------------------------------

/** Summer camp "Get guide + 15% off" form submission. */
export function trackSummerCampGuideLead(
  interest: string,
  grade: string,
  userData?: { em?: string; ph?: string; fn?: string; ln?: string }
): void {
  trackWithCAPI('Lead', {
    content_name: 'Summer Camp Guide',
    content_category: interest,
    content_ids: [grade],
    value: 0,
    currency: 'USD',
  }, userData);
}

/** @deprecated Use trackSummerCampGuideLead */
export function trackSummercampEntry(interest: string, grade: string): void {
  trackSummerCampGuideLead(interest, grade);
}

export function trackEnrollClick(programName: string, price?: number): void {
  trackWithCAPI('InitiateCheckout', {
    content_name: programName,
    content_category: 'Summer Camp',
    value: price ?? 0,
    currency: 'USD',
  });
}

export function trackPurchase(programName: string, value: number): void {
  trackWithCAPI('Purchase', {
    content_name: programName,
    content_category: 'Summer Camp',
    value,
    currency: 'USD',
  });
}

export function trackCampView(programName: string, category: string): void {
  trackWithCAPI('ViewContent', {
    content_name: programName,
    content_type: 'product',
    content_category: category,
  });
}

export function trackContactForm(source: 'contact_form' | 'book_a_call'): void {
  trackWithCAPI('Contact', { content_name: source });
}

/** Browser-only — brochure PDF view is informational, not a key conversion. */
export function trackBrochureDownload(): void {
  track('ViewContent', { content_name: 'Camp Brochure PDF', content_type: 'document' });
}

/** Browser-only — CustomEvent is not in CAPI's standard event list. */
export function trackEarlyBirdReveal(): void {
  track('CustomEvent', { content_name: 'Early Bird Code Reveal', content_category: 'Promotion' });
}
