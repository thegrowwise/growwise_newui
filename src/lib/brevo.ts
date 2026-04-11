/**
 * Brevo (Sendinblue) REST API v3 — transactional email + contacts/lists.
 * Env: BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME (optional),
 * BREVO_LIST_LOTTERY (numeric list id — summer camp guide leads + Meta Lead Ads upsert; legacy env name).
 */

import type { SendEmailResult } from '@/lib/email';
import type { NormalizedMetaLead } from '@/lib/meta-lead';

const BREVO_API_BASE = 'https://api.brevo.com/v3';

/** Fetch with timeout — works on Node 16+; avoids AbortSignal.timeout (Node 17.3+ only). */
async function fetchWithTimeout(
  url: string,
  init: Omit<RequestInit, 'signal'>,
  timeoutMs = 25_000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function getBrevoApiKey(): string | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  return apiKey || null;
}

function getBrevoSender(): { apiKey: string; email: string; name: string } | null {
  const apiKey = getBrevoApiKey();
  const email = process.env.BREVO_SENDER_EMAIL?.trim();
  const name = process.env.BREVO_SENDER_NAME?.trim() || 'GrowWise';
  if (!apiKey || !email) return null;
  return { apiKey, email, name };
}

export function isBrevoTransactionalReady(): boolean {
  return getBrevoSender() !== null;
}

export interface BrevoTransactionalEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: { email: string; name?: string };
}

/** POST /v3/smtp/email — same logical inputs as Nodemailer send (html/text), mapped to Brevo field names. */
export async function sendBrevoTransactionalEmail(
  options: BrevoTransactionalEmailOptions
): Promise<SendEmailResult> {
  const sender = getBrevoSender();
  if (!sender) {
    console.warn('[brevo] BREVO_API_KEY or BREVO_SENDER_EMAIL not set; skipping transactional send.');
    return { success: false, error: 'Brevo not configured' };
  }

  const toList = Array.isArray(options.to) ? options.to : [options.to];
  const to = toList.map((e) => ({ email: e.trim() })).filter((x) => x.email.length > 0);
  if (to.length === 0) {
    return { success: false, error: 'No recipients' };
  }

  try {
    const res = await fetchWithTimeout(`${BREVO_API_BASE}/smtp/email`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': sender.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: sender.name, email: sender.email },
        to,
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text,
        ...(options.replyTo ? { replyTo: options.replyTo } : {}),
      }),
    });

    const raw = await res.text();
    let parsed: { messageId?: string; message?: string } = {};
    try {
      parsed = raw ? (JSON.parse(raw) as typeof parsed) : {};
    } catch {
      /* non-JSON error body */
    }

    if (!res.ok) {
      const errMsg = parsed.message || raw || `HTTP ${res.status}`;
      console.error('[brevo] Transactional send failed:', errMsg);
      return { success: false, error: errMsg };
    }

    return { success: true, messageId: parsed.messageId };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Send failed';
    console.error('[brevo] Transactional send error:', error);
    return { success: false, error };
  }
}

/** POST /v3/contacts — add/update contact and attach to the summer camp guide / nurture list. */
export async function addSummerCampLotteryContactToBrevoList(email: string): Promise<SendEmailResult> {
  const sender = getBrevoSender();
  const listIdRaw = process.env.BREVO_LIST_LOTTERY?.trim();

  if (!sender) {
    return { success: false, error: 'Brevo not configured' };
  }
  if (!listIdRaw) {
    console.warn('[brevo] BREVO_LIST_LOTTERY not set; skipping list add.');
    return { success: false, error: 'BREVO_LIST_LOTTERY not set' };
  }

  const listId = Number.parseInt(listIdRaw, 10);
  if (!Number.isFinite(listId)) {
    console.warn('[brevo] BREVO_LIST_LOTTERY must be a numeric list id.');
    return { success: false, error: 'Invalid BREVO_LIST_LOTTERY' };
  }

  try {
    const res = await fetchWithTimeout(`${BREVO_API_BASE}/contacts`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': sender.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    const raw = await res.text();
    let parsed: { message?: string } = {};
    try {
      parsed = raw ? (JSON.parse(raw) as typeof parsed) : {};
    } catch {
      /* ignore */
    }

    if (!res.ok) {
      const errMsg = parsed.message || raw || `HTTP ${res.status}`;
      console.warn('[brevo] Lottery list contact failed:', errMsg);
      return { success: false, error: errMsg };
    }

    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'List add failed';
    console.warn('[brevo] Lottery list contact error:', error);
    return { success: false, error };
  }
}

/** Meta Lead form `field_data.name` from Graph — keys must match exactly. */
const META_FIELD_CAMP_INTEREST = 'which_camp_interests_your_child_most?';
const META_FIELD_GRADE_FALL_2026 = 'what_grade_is_your_child_entering_in_fall_2026?';

function metaRawFieldValue(raw: Record<string, string>, exactKey: string): string | undefined {
  const v = raw[exactKey];
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

/**
 * POST /v3/contacts — upsert Meta Lead Ads contact with CRM attributes (requires email).
 * In Brevo: create Text attributes (CAMP_INTEREST, GRADE, FIRSTNAME, PHONE, SOURCE, etc.) as needed.
 */
export async function upsertMetaLeadContactInBrevo(lead: NormalizedMetaLead): Promise<SendEmailResult> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    console.warn('[brevo] BREVO_API_KEY not set; skipping Meta lead upsert.');
    return { success: false, error: 'Brevo not configured' };
  }

  const email = lead.email?.trim().toLowerCase();
  if (!email) {
    console.warn('[brevo] Meta lead upsert skipped: no email on normalized lead.');
    return { success: false, error: 'No email' };
  }

  const listIdRaw = process.env.BREVO_LIST_LOTTERY?.trim();
  let listIds: number[] | undefined;
  if (listIdRaw) {
    const n = Number.parseInt(listIdRaw, 10);
    if (Number.isFinite(n)) {
      listIds = [n];
    } else {
      console.warn('[brevo] BREVO_LIST_LOTTERY must be numeric; omitting listIds for Meta upsert.');
    }
  }

  const attributes: Record<string, string> = {
    SOURCE: lead.source,
    SOURCE_DETAIL: lead.sourceDetail,
  };
  if (lead.firstName) attributes.FIRSTNAME = lead.firstName;
  if (lead.lastName) attributes.LASTNAME = lead.lastName;
  if (lead.phone) attributes.PHONE = lead.phone;
  if (lead.formId) attributes.FORM_ID = lead.formId;
  if (lead.pageId) attributes.PAGE_ID = lead.pageId;
  if (lead.adId) attributes.AD_ID = lead.adId;
  if (lead.adgroupId) attributes.ADGROUP_ID = lead.adgroupId;
  if (lead.submittedAt) attributes.SUBMITTED_AT = lead.submittedAt;

  const campInterest = metaRawFieldValue(lead.rawFieldData, META_FIELD_CAMP_INTEREST);
  if (campInterest) attributes.CAMP_INTEREST = campInterest;
  const grade = metaRawFieldValue(lead.rawFieldData, META_FIELD_GRADE_FALL_2026);
  if (grade) attributes.GRADE = grade;

  try {
    const res = await fetchWithTimeout(`${BREVO_API_BASE}/contacts`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes,
        ...(listIds ? { listIds } : {}),
        updateEnabled: true,
      }),
    });

    const raw = await res.text();
    let parsed: { message?: string } = {};
    try {
      parsed = raw ? (JSON.parse(raw) as typeof parsed) : {};
    } catch {
      /* ignore */
    }

    if (!res.ok) {
      const errMsg = parsed.message || raw || `HTTP ${res.status}`;
      console.warn('[brevo] Meta lead contact upsert failed:', errMsg);
      return { success: false, error: errMsg };
    }

    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Meta lead upsert failed';
    console.warn('[brevo] Meta lead contact upsert error:', error);
    return { success: false, error };
  }
}
