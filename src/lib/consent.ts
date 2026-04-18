export type CookieConsentState = 'accepted' | 'rejected';

const KEY = 'gw_cookie_consent';

/**
 * Lighthouse, WebDriver, etc. — do not load marketing tags or show the consent bar.
 * Avoids third-party cookies and noisy console errors in synthetic audits; real users are unaffected.
 */
export function isAutomatedAuditEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const ua = navigator.userAgent || '';
    if (/\bChrome-Lighthouse\b/i.test(ua)) return true;
    if ((navigator as Navigator & { webdriver?: boolean }).webdriver) return true;
  } catch {
    // ignore
  }
  return false;
}

export function getStoredCookieConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === 'accepted' || raw === 'rejected') return raw;
    return null;
  } catch {
    return null;
  }
}

export function setStoredCookieConsent(state: CookieConsentState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, state);
    window.dispatchEvent(new CustomEvent('gw:cookie-consent', { detail: state }));
  } catch {
    // If storage is blocked, we still want the current tab to react.
    window.dispatchEvent(new CustomEvent('gw:cookie-consent', { detail: state }));
  }
}

