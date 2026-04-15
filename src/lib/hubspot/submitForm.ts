/**
 * Server-only HubSpot Forms API v3 — CRM / lead capture without loading js.hs-scripts.com (no chat widget).
 */

import type { HubSpotFieldRow } from './formsSubmit';

const HS_FORMS_SUBMIT_BASE =
  'https://api.hsforms.com/submissions/v3/integration/submit';

export function isHubSpotFormsConfigured(): boolean {
  const portalId = process.env.HUBSPOT_PORTAL_ID?.trim();
  const formGuid = process.env.HUBSPOT_FORM_GUID?.trim();
  return Boolean(portalId && formGuid);
}

export type SubmitHubSpotFormResult =
  | { ok: true }
  | { ok: false; message: string; status?: number };

/**
 * POST field rows to the HubSpot form configured by env (same as /api/hubspot-submit).
 */
export async function submitHubSpotForm(
  fields: HubSpotFieldRow[],
  context?: { pageUri?: string; pageName?: string }
): Promise<SubmitHubSpotFormResult> {
  const portalId = process.env.HUBSPOT_PORTAL_ID?.trim();
  const formGuid = process.env.HUBSPOT_FORM_GUID?.trim();

  if (!portalId || !formGuid) {
    return { ok: false, message: 'HubSpot Forms API is not configured' };
  }

  const hubspotBody = {
    fields,
    context: {
      pageUri: context?.pageUri ?? '',
      pageName: context?.pageName ?? '',
    },
  };

  const url = `${HS_FORMS_SUBMIT_BASE}/${portalId}/${formGuid}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hubspotBody),
    });

    if (!response.ok) {
      const errorSnippet = (await response.text()).slice(0, 500);
      console.error(
        '[hubspot] Form submission rejected:',
        response.status,
        errorSnippet
      );
      return {
        ok: false,
        message: 'HubSpot submission failed',
        status: response.status,
      };
    }

    return { ok: true };
  } catch (err) {
    console.error('[hubspot] Network error:', err);
    return { ok: false, message: 'HubSpot submission failed' };
  }
}

/** Split full name for HubSpot default `firstname` / `lastname` properties. */
export function splitFullName(fullName: string): { firstname: string; lastname: string } {
  const t = fullName.trim();
  const i = t.indexOf(' ');
  if (i === -1) return { firstname: t, lastname: '' };
  return { firstname: t.slice(0, i), lastname: t.slice(i + 1).trim() };
}
