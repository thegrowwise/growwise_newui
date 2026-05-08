/**
 * Origin allowlist for browser POSTs to public form APIs.
 * Requests without an `Origin` header (curl, server-to-server) pass through;
 * rate limiting still applies.
 */
export function isOriginAllowed(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;

  const norm = (u: string) => u.replace(/\/$/, '');
  const o = norm(origin);

  const allowed: string[] = [];
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) allowed.push(norm(site));
  allowed.push(
    'https://growwiseschool.org',
    'https://www.growwiseschool.org',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3003',
    'http://127.0.0.1:3003',
  );

  return allowed.includes(o);
}

/**
 * Honeypot: hidden field `_hp` (or legacy `company`) must be empty.
 * Bots often fill every input; humans never see the field.
 */
export function honeypotTriggered(body: Record<string, unknown>): boolean {
  const v = body._hp ?? body.company;
  if (v === undefined || v === null) return false;
  return typeof v === 'string' && v.trim().length > 0;
}
