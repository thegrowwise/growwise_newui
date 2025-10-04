export function getCurrentLocale(defaultLocale: string = 'en'): string {
  if (typeof window === 'undefined') return defaultLocale;
  try {
    const path = window.location.pathname || '';
    const seg = path.split('/').filter(Boolean)[0];
    return seg || defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export function buildLocalizedMockPaths(locale: string, file: string): string[] {
  return [
    `/api/mock/${locale}/${file}`,
    `/api/mock/${file}`,
  ];
}

export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE || '';
  return base.replace(/\/$/, '');
}

export function useMock(): boolean {
  return (process.env.NEXT_PUBLIC_USE_MOCK || 'true') === 'true';
}


