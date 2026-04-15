/**
 * Normalizes client JSON into HubSpot Forms API v3 `fields` array.
 * Supports either a flat object (`{ email: "a@b.com" }`) or HubSpot-shaped arrays.
 */

export const HUBSPOT_FORM_MAX_FIELDS = 50;
export const HUBSPOT_FORM_MAX_VALUE_LENGTH = 10000;

export type HubSpotFieldRow = { name: string; value: string };

export type NormalizeHubSpotFormResult =
  | { ok: true; fields: HubSpotFieldRow[] }
  | { ok: false; message: string };

function trimValue(value: unknown): string {
  return String(value ?? '').slice(0, HUBSPOT_FORM_MAX_VALUE_LENGTH);
}

/**
 * Parses `body.fields` as either:
 * - `Record<string, unknown>` — keys become HubSpot field `name`s
 * - `Array<{ name: string; value: unknown }>` — HubSpot-native shape
 */
export function normalizeHubSpotFormBody(body: unknown): NormalizeHubSpotFormResult {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, message: 'Request body must be a JSON object' };
  }

  const raw = (body as Record<string, unknown>).fields;

  if (raw === undefined || raw === null) {
    return { ok: false, message: 'Missing `fields`' };
  }

  if (Array.isArray(raw)) {
    const out: HubSpotFieldRow[] = [];
    for (const item of raw) {
      if (item === null || typeof item !== 'object' || Array.isArray(item)) continue;
      const name = (item as { name?: unknown }).name;
      const value = (item as { value?: unknown }).value;
      if (typeof name !== 'string' || !name.trim()) continue;
      out.push({ name: name.trim(), value: trimValue(value) });
    }
    if (out.length === 0) {
      return { ok: false, message: 'No valid field entries' };
    }
    if (out.length > HUBSPOT_FORM_MAX_FIELDS) {
      return { ok: false, message: `At most ${HUBSPOT_FORM_MAX_FIELDS} fields allowed` };
    }
    return { ok: true, fields: out };
  }

  if (typeof raw === 'object') {
    const out: HubSpotFieldRow[] = [];
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof key !== 'string' || !key.trim()) continue;
      out.push({ name: key.trim(), value: trimValue(value) });
    }
    if (out.length === 0) {
      return { ok: false, message: 'No valid fields' };
    }
    if (out.length > HUBSPOT_FORM_MAX_FIELDS) {
      return { ok: false, message: `At most ${HUBSPOT_FORM_MAX_FIELDS} fields allowed` };
    }
    return { ok: true, fields: out };
  }

  return { ok: false, message: '`fields` must be an object or array' };
}

export type HubSpotContextInput = {
  pageUri?: string;
  pageName?: string;
};

export function extractContext(body: unknown): HubSpotContextInput | undefined {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return undefined;
  const ctx = (body as Record<string, unknown>).context;
  if (ctx === null || typeof ctx !== 'object' || Array.isArray(ctx)) return undefined;
  const pageUri = (ctx as { pageUri?: unknown }).pageUri;
  const pageName = (ctx as { pageName?: unknown }).pageName;
  const out: HubSpotContextInput = {};
  if (typeof pageUri === 'string') out.pageUri = pageUri;
  if (typeof pageName === 'string') out.pageName = pageName;
  return Object.keys(out).length > 0 ? out : undefined;
}
