/**
 * Server-side field length caps for marketing lead forms.
 * Client forms should mirror these with `maxLength` where applicable.
 */
export const FIELD_MAX = {
  name: 100,
  email: 254,
  phone: 32,
  shortText: 200,
  longText: 2000,
} as const;

export function clip(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export function exceedsMax(value: unknown, max: number): boolean {
  return typeof value === 'string' && value.trim().length > max;
}

/** Stricter than the legacy `/^[^\\s@]+@/` pattern; blocks obvious junk. */
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/;

export function isValidEmailShape(email: string): boolean {
  return email.length <= FIELD_MAX.email && EMAIL_RE.test(email);
}
