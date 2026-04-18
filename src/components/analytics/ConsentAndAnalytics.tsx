'use client';

import { AnalyticsAfterConsent } from '@/components/analytics/AnalyticsAfterConsent';
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner';

/**
 * Loads GTM / GA / Meta Pixel only after analytics consent (localStorage).
 * Keeps third-party cookies off the critical path until the user accepts — improves Lighthouse Best Practices.
 */
export function ConsentAndAnalytics() {
  return (
    <>
      <AnalyticsAfterConsent />
      <CookieConsentBanner />
    </>
  );
}
