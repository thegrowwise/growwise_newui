/**
 * Pure resolver for `/api/mock/[...path]` — keeps file I/O in the route but logic is unit-tested.
 * Mirrors legacy behavior: 1 segment → locale `en` + file; 2 segments → locale + file.
 */
export type ParseMockApiPathResult =
  | { ok: true; locale: string; fileName: string }
  | { ok: false; reason: 'empty' };

export function parseMockApiPath(path: string[]): ParseMockApiPathResult {
  if (!path || path.length === 0) {
    return { ok: false, reason: 'empty' };
  }

  let locale = 'en';
  let fileName = path[path.length - 1];

  if (path.length === 2) {
    locale = path[0];
    fileName = path[1];
  }

  return { ok: true, locale, fileName };
}
