export type CookieConsentState = 'accepted' | 'rejected';

const KEY = 'gw_cookie_consent';

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

