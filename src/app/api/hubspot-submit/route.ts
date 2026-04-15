import { NextRequest, NextResponse } from 'next/server';
import {
  extractContext,
  normalizeHubSpotFormBody,
} from '@/lib/hubspot/formsSubmit';
import { submitHubSpotForm } from '@/lib/hubspot/submitForm';

/**
 * Server-side proxy to HubSpot Forms API v3 (CRM leads — no client HubSpot script).
 * Configure `HUBSPOT_PORTAL_ID` + `HUBSPOT_FORM_GUID` (never expose form GUID to the client).
 *
 * POST body: `{ fields: Record<string, string> | Array<{ name, value }>, context?: { pageUri?, pageName? } }`
 */
export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const normalized = normalizeHubSpotFormBody(json);
  if (!normalized.ok) {
    return NextResponse.json(
      { success: false, message: normalized.message },
      { status: 400 }
    );
  }

  const ctx = extractContext(json);
  const referer = request.headers.get('referer') ?? '';

  const result = await submitHubSpotForm(normalized.fields, {
    pageUri: ctx?.pageUri ?? referer,
    pageName: ctx?.pageName ?? '',
  });

  if (!result.ok) {
    if (result.message === 'HubSpot Forms API is not configured') {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 503 }
      );
    }
    const status =
      typeof result.status === 'number' &&
      result.status >= 400 &&
      result.status < 600
        ? result.status
        : 502;
    return NextResponse.json(
      { success: false, message: result.message },
      { status }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Form submitted successfully',
  });
}
