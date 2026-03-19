export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

function loadRecaptchaScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (!RECAPTCHA_SITE_KEY) {
    return Promise.resolve();
  }

  if (document.querySelector('script[data-recaptcha="v3"]')) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
      RECAPTCHA_SITE_KEY
    )}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'v3';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
    document.head.appendChild(script);
  });
}

export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!RECAPTCHA_SITE_KEY) {
    return null;
  }

  await loadRecaptchaScript();

  return new Promise((resolve) => {
    if (!window.grecaptcha) {
      return resolve(null);
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then((token) => resolve(token))
        .catch(() => resolve(null));
    });
  });
}

