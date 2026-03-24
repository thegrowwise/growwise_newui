/**
 * Meta Lead Ads: parse webhook leadgen payloads, fetch lead from Graph API, normalize for CRM.
 * Env: META_ACCESS_TOKEN, optional META_GRAPH_API_VERSION (default v21.0).
 */

const LOG_PREFIX = '[meta-lead]';

const DEFAULT_GRAPH_VERSION = 'v21.0';

export interface WebhookLeadgenEvent {
  leadgenId: string | null;
  formId: string | null;
  pageId: string | null;
  adId: string | null;
  adgroupId: string | null;
  /** Raw webhook created_time if present (string or number). */
  createdTimeRaw: string | null;
}

export interface MetaGraphLeadPayload {
  id?: string;
  created_time?: string;
  field_data?: Array<{ name?: string; values?: string[] }>;
  ad_id?: string;
  form_id?: string;
  page_id?: string;
  /** Graph uses adset_id; webhook often says adgroup_id */
  adset_id?: string;
}

export interface NormalizedMetaLead {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phone: string | null;
  source: 'meta';
  sourceDetail: 'meta_lead_form';
  formId: string | null;
  pageId: string | null;
  adId: string | null;
  adgroupId: string | null;
  submittedAt: string | null;
  rawFieldData: Record<string, string>;
}

function normKey(k: string): string {
  return k.trim().toLowerCase().replace(/\s+/g, '_');
}

function readString(v: unknown): string | null {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return null;
}

/**
 * Walk Meta webhook JSON; return one row per leadgen change (other fields ignored).
 */
export function extractLeadgenWebhookEvents(body: unknown): WebhookLeadgenEvent[] {
  const out: WebhookLeadgenEvent[] = [];
  if (typeof body !== 'object' || body === null) return out;

  const root = body as Record<string, unknown>;
  const entries = Array.isArray(root.entry) ? root.entry : [];

  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null) continue;
    const ent = entry as Record<string, unknown>;
    const entryPageId = readString(ent.id);

    const changes = Array.isArray(ent.changes) ? ent.changes : [];
    for (const ch of changes) {
      if (typeof ch !== 'object' || ch === null) continue;
      const change = ch as Record<string, unknown>;
      if (change.field !== 'leadgen') continue;

      const value = change.value;
      if (typeof value !== 'object' || value === null) {
        out.push({
          leadgenId: null,
          formId: null,
          pageId: entryPageId,
          adId: null,
          adgroupId: null,
          createdTimeRaw: null,
        });
        continue;
      }

      const v = value as Record<string, unknown>;
      out.push({
        leadgenId: readString(v.leadgen_id),
        formId: readString(v.form_id),
        pageId: readString(v.page_id) ?? entryPageId,
        adId: readString(v.ad_id),
        adgroupId: readString(v.adgroup_id),
        createdTimeRaw:
          readString(v.created_time) ??
          (typeof v.created_time === 'number' ? String(v.created_time) : null),
      });
    }
  }

  return out;
}

function graphVersion(): string {
  return process.env.META_GRAPH_API_VERSION?.trim() || DEFAULT_GRAPH_VERSION;
}

/**
 * GET /{leadgen-id}?fields=...&access_token=...
 */
export async function fetchMetaLeadFromGraph(
  leadgenId: string,
  accessToken: string
): Promise<MetaGraphLeadPayload | null> {
  const version = graphVersion();
  const fields = [
    'id',
    'created_time',
    'field_data',
    'ad_id',
    'form_id',
    'page_id',
    'adset_id',
  ].join(',');

  const url = new URL(`https://graph.facebook.com/${version}/${encodeURIComponent(leadgenId)}`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('access_token', accessToken);

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const raw = await res.text();
    let parsed: unknown;
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      console.warn(`${LOG_PREFIX} Graph response not JSON`, { leadgenId, status: res.status });
      return null;
    }

    if (!res.ok) {
      const errMsg =
        typeof parsed === 'object' &&
        parsed !== null &&
        'error' in parsed &&
        typeof (parsed as { error?: { message?: string } }).error?.message === 'string'
          ? (parsed as { error: { message: string } }).error.message
          : `HTTP ${res.status}`;
      console.warn(`${LOG_PREFIX} Graph lead fetch failed`, { leadgenId, status: res.status, error: errMsg });
      return null;
    }

    return parsed as MetaGraphLeadPayload;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`${LOG_PREFIX} Graph lead fetch error`, { leadgenId, message });
    return null;
  } finally {
    clearTimeout(id);
  }
}

function buildRawFieldData(graph: MetaGraphLeadPayload): Record<string, string> {
  const raw: Record<string, string> = {};
  const rows = Array.isArray(graph.field_data) ? graph.field_data : [];
  for (const row of rows) {
    const name = typeof row.name === 'string' ? row.name.trim() : '';
    if (!name) continue;
    const vals = Array.isArray(row.values)
      ? row.values.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
      : [];
    raw[name] = vals.join(', ');
  }
  return raw;
}

function getFieldCI(raw: Record<string, string>, ...candidates: string[]): string | null {
  const index = new Map<string, string>();
  for (const [k, v] of Object.entries(raw)) {
    index.set(normKey(k), v.trim());
  }
  for (const cand of candidates) {
    const val = index.get(normKey(cand));
    if (val) return val;
  }
  return null;
}

function splitFullName(full: string): { first: string | null; last: string | null } {
  const t = full.trim();
  if (!t) return { first: null, last: null };
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { first: parts[0], last: null };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

function coalesceId(
  ...vals: Array<string | null | undefined>
): string | null {
  for (const v of vals) {
    const s = typeof v === 'string' ? v.trim() : '';
    if (s) return s;
  }
  return null;
}

function parseSubmittedAt(
  graphCreated?: string,
  webhookRaw: string | null
): string | null {
  if (graphCreated?.trim()) return graphCreated.trim();
  if (!webhookRaw?.trim()) return null;
  const n = Number(webhookRaw);
  if (Number.isFinite(n) && n > 1_000_000_000) {
    try {
      return new Date(n * 1000).toISOString();
    } catch {
      return webhookRaw.trim();
    }
  }
  return webhookRaw.trim();
}

/**
 * Merge webhook context with Graph `field_data` into a CRM-ready shape.
 */
export function normalizeMetaLead(
  webhook: WebhookLeadgenEvent,
  graph: MetaGraphLeadPayload
): NormalizedMetaLead {
  const rawFieldData = buildRawFieldData(graph);

  const email =
    getFieldCI(rawFieldData, 'email', 'e-mail', 'work_email', 'business_email')?.toLowerCase() ?? null;

  const phone =
    getFieldCI(
      rawFieldData,
      'phone_number',
      'phone',
      'mobile_phone',
      'mobile',
      'cell_phone',
      'your_phone_number'
    ) ?? null;

  let firstName = getFieldCI(rawFieldData, 'first_name', 'firstname', 'given_name');
  let lastName = getFieldCI(rawFieldData, 'last_name', 'lastname', 'family_name', 'surname');
  let fullName = getFieldCI(rawFieldData, 'full_name', 'name', 'your_name');

  if (!fullName && (firstName || lastName)) {
    fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || null;
  }
  if ((!firstName || !lastName) && fullName) {
    const sp = splitFullName(fullName);
    if (!firstName) firstName = sp.first;
    if (!lastName) lastName = sp.last;
  }

  const formId = coalesceId(readString(graph.form_id), webhook.formId);
  const pageId = coalesceId(readString(graph.page_id), webhook.pageId);
  const adId = coalesceId(readString(graph.ad_id), webhook.adId);
  const adgroupId = coalesceId(readString(graph.adset_id), webhook.adgroupId);

  const submittedAt = parseSubmittedAt(graph.created_time, webhook.createdTimeRaw);

  return {
    email,
    firstName,
    lastName,
    fullName,
    phone,
    source: 'meta',
    sourceDetail: 'meta_lead_form',
    formId,
    pageId,
    adId,
    adgroupId,
    submittedAt,
    rawFieldData,
  };
}
