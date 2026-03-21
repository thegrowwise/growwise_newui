declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

export function trackLotteryEntry(interest: string, grade: string) {
  track('Lead', { content_name: 'Summer Camp Lottery', content_category: interest, content_ids: [grade], value: 0, currency: 'USD' });
}
export function trackEnrollClick(programName: string, price?: number) {
  track('InitiateCheckout', { content_name: programName, content_category: 'Summer Camp', value: price ?? 0, currency: 'USD' });
}
export function trackPurchase(programName: string, value: number) {
  track('Purchase', { content_name: programName, content_category: 'Summer Camp', value, currency: 'USD' });
}
export function trackCampView(programName: string, category: string) {
  track('ViewContent', { content_name: programName, content_type: 'product', content_category: category });
}
export function trackContactForm(source: 'contact_form' | 'book_a_call') {
  track('Contact', { content_name: source });
}
export function trackBrochureDownload() {
  track('ViewContent', { content_name: 'Camp Brochure PDF', content_type: 'document' });
}
export function trackEarlyBirdReveal() {
  track('CustomEvent', { content_name: 'Early Bird Code Reveal', content_category: 'Promotion' });
}
