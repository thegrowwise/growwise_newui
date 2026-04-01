'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getStoredCookieConsent, setStoredCookieConsent, type CookieConsentState } from '@/lib/consent';

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Avoid blocking critical UI interactions in automated E2E runs.
    if (typeof navigator !== 'undefined' && (navigator as any).webdriver) {
      setConsent('rejected');
      setReady(true);
      return;
    }

    setConsent(getStoredCookieConsent());
    setReady(true);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as unknown;
      if (detail === 'accepted' || detail === 'rejected') setConsent(detail);
    };
    window.addEventListener('gw:cookie-consent', onChange);
    return () => window.removeEventListener('gw:cookie-consent', onChange);
  }, []);

  if (!ready) return null;
  if (consent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] px-4 pb-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Cookies:</span> We use analytics cookies to understand usage and improve your experience.
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                setStoredCookieConsent('rejected');
                setConsent('rejected');
              }}
            >
              Decline
            </Button>
            <Button
              type="button"
              className="h-9 bg-[#1F396D] hover:bg-[#29335C]"
              onClick={() => {
                setStoredCookieConsent('accepted');
                setConsent('accepted');
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

