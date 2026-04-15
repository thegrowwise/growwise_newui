'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

const HUB_ID_PATTERN = /^\d{5,12}$/;

/** HubSpot command queue — commands are string tuples consumed by the tracking script. */
type HubSpotWindow = Window & {
  _hsq?: unknown[][];
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
    w._hsq = w._hsq || [];
    w._hsq.push(['setPath', fullPath]);
    w._hsq.push(['trackPageView']);
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
      <Script
        id="hs-script-loader"
        strategy="afterInteractive"
        src={`https://js.hs-scripts.com/${id}.js`}
      />
      <Suspense fallback={null}>
        <HubSpotSpaRouteSync />
      </Suspense>
    </>
  );
}
