'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

const HUB_ID_PATTERN = /^\d{5,12}$/;

type HubSpotWindow = Window & {
  _hsq?: Array<[string, ...string[]] | [string]>;
};

function HubSpotSpaRouteSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const skipFirstManualPageView = useRef(true);

  useEffect(() => {
    const fullPath = search ? `${pathname}?${search}` : pathname;

    if (skipFirstManualPageView.current) {
      skipFirstManualPageView.current = false;
      return;
    }

    const w = window as HubSpotWindow;
    const hsq = w._hsq;
    if (!hsq || typeof hsq.push !== 'function') return;

    hsq.push(['setPath', fullPath]);
    hsq.push(['trackPageView']);
  }, [pathname, search]);

  return null;
}

interface HubSpotSpaTrackerProps {
  hubId: string;
}

/** HubSpot — loads tracking once; fires setPath + trackPageView on client navigations (not the first render). */
export default function HubSpotSpaTracker({ hubId }: HubSpotSpaTrackerProps) {
  const id = hubId.trim();
  if (!id || !HUB_ID_PATTERN.test(id)) return null;

  return (
    <>
      {/* lazyOnload — same tier as MetaPixel / gtag fallback: defer third-party until after load so LCP/INP are not contended. */}
      <Script
        id="hs-script-loader"
        strategy="lazyOnload"
        src={`https://js.hs-scripts.com/${id}.js`}
      />
      <Suspense fallback={null}>
        <HubSpotSpaRouteSync />
      </Suspense>
    </>
  );
}
