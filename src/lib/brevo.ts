/**
 * Brevo (Sendinblue) REST API v3 — transactional email + contacts/lists.
 * Env: BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME (optional), BREVO_LIST_LOTTERY (numeric list id).
 */

import type { SendEmailResult } from '@/lib/email';

const BREVO_API_BASE = 'https://api.brevo.com/v3';

function getBrevoSender(): { apiKey: string; email: string; name: string } | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
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
    const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
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

/** POST /v3/contacts — add/update contact and attach to the summer camp lottery list. */
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
    const res = await fetch(`${BREVO_API_BASE}/contacts`, {
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
