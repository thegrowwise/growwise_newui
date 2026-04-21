import { isAutomatedAuditEnvironment } from '@/lib/consent';
import type { CAPICustomData } from '@/lib/capi';

/**
 * Browser-side helper that POSTs a CAPI event to /api/capi (our own Next.js route).
 * The route forwards it to Meta's Graph API server-side, recovering events that would
 * otherwise be lost to ad blockers and iOS tracking restrictions.
 *
 * The caller is responsible for generating the event_id and passing the same id to the
 * matching browser fbq() call so Meta can deduplicate across browser + server.
 *
 * Usage:
 *   const eventId = generateEventId();
 *   window.fbq('track', 'Lead', params, { eventID: eventId });
 *   sendCAPIEventFromBrowser('Lead', params, eventId);
 */
export function sendCAPIEventFromBrowser(
  event_name: string,
  custom_data?: CAPICustomData,
  event_id?: string
): void {
  // Guard: never fire during Lighthouse or automated audits.
  if (typeof window === 'undefined' || isAutomatedAuditEnvironment()) return;

  const id = event_id ?? crypto.randomUUID();

  // keepalive ensures the request completes even if the user navigates away before it resolves.
  void fetch('/api/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name,
      event_id: id,
      event_source_url: window.location.href,
      custom_data,
    }),
    keepalive: true,
  }).catch(() => {
    // Silently ignore — CAPI errors must never surface to users.
  });
}
