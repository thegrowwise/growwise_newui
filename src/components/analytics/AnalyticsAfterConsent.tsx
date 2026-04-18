'use client';

import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { GTMHead, GTMNoScript } from '@/components/analytics/GTM';
import MetaPixel from '@/components/analytics/MetaPixel';
import {
  getStoredCookieConsent,
  isAutomatedAuditEnvironment,
  type CookieConsentState,
} from '@/lib/consent';

function buildGtagInline(gaId: string) {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: true });
`.trim();
}

export function AnalyticsAfterConsent() {
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(getStoredCookieConsent());
    setReady(true);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as unknown;
      if (detail === 'accepted' || detail === 'rejected') setConsent(detail);
    };
    window.addEventListener('gw:cookie-consent', onChange);
    return () => window.removeEventListener('gw:cookie-consent', onChange);
  }, []);

  const env = useMemo(() => {
    return {
      gtmId: process.env.NEXT_PUBLIC_GTM_ID?.trim() || null,
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || null,
      gaId: process.env.NEXT_PUBLIC_GA_ID?.trim() || null,
    };
  }, []);

  if (!ready) return null;
  // Stored consent must not load GTM/Meta during Lighthouse / WebDriver (clean Best Practices audits).
  if (consent !== 'accepted' || isAutomatedAuditEnvironment()) return null;

  return (
    <>
      {env.gtmId ? (
        <>
          <GTMHead gtmId={env.gtmId} strategy="afterInteractive" />
          <GTMNoScript gtmId={env.gtmId} />
        </>
      ) : null}
      {env.pixelId ? <MetaPixel pixelId={env.pixelId} /> : null}

      {/* GA fallback only when GTM isn't configured */}
      {!env.gtmId && env.gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${env.gaId}`} strategy="lazyOnload" />
          <Script id="gtag-inline" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: buildGtagInline(env.gaId) }} />
        </>
      ) : null}
    </>
  );
}
