import type { CartItem } from '@/components/gw/CartContext';

export interface EnrollPreviewRequestBody {
  program_id: string;
  tier_name: string;
  delivery_mode: string;
  addon_ids: string[];
  child_count: number;
}

export interface EnrollPreviewLineItem {
  label: string;
  amount: number;
  type: 'recurring' | 'one_time';
}

export interface EnrollPreviewData {
  program_id: string;
  tier_name: string;
  delivery_mode: string;
  line_items: EnrollPreviewLineItem[];
  first_purchase_aov: number;
  recurring_monthly_aov: number;
  aov_to_asp_ratio: number;
}

export interface EnrollPreviewResponse {
  success: boolean;
  data: EnrollPreviewData;
}

/**
 * Loads pricing for a journey enrollment (same source as /enroll review step).
 */
export async function fetchEnrollPreview(
  body: EnrollPreviewRequestBody,
): Promise<EnrollPreviewResponse> {
  const response = await fetch('/api/enroll/preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  let message = 'Unable to load pricing. Please try again.';

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      try {
        const json = (await response.json()) as { message?: string };
        if (typeof json.message === 'string') message = json.message;
      } catch {
        /* use default */
      }
    }
    throw new Error(message);
  }

  return response.json() as Promise<EnrollPreviewResponse>;
}

function programTitleFromPreview(data: EnrollPreviewData): string {
  const first = data.line_items[0]?.label;
  if (!first) return data.program_id;
  return first.split(' — ')[0] || data.program_id;
}

/**
 * Stable cart line id so the same selection updates instead of duplicating.
 */
export function journeyEnrollCartItemId(req: EnrollPreviewRequestBody): string {
  const addonKey = [...req.addon_ids].sort().join(',');
  return `journey-enroll:${req.program_id}:${req.tier_name}:${req.delivery_mode}:${addonKey}:${req.child_count}`;
}

/**
 * Builds a cart row for Stripe Checkout (same shape as other courses).
 */
export function buildJourneyEnrollCartItem(
  preview: EnrollPreviewData,
  req: EnrollPreviewRequestBody,
): CartItem {
  const programTitle = programTitleFromPreview(preview);
  const tierLabel = req.tier_name.charAt(0).toUpperCase() + req.tier_name.slice(1);
  const modeLabel = req.delivery_mode === 'studio' ? 'In-person studio' : 'Live online';

  return {
    id: journeyEnrollCartItemId(req),
    name: `${programTitle} — ${tierLabel}`,
    price: Math.max(0, preview.first_purchase_aov),
    quantity: 1,
    category: 'Coding journey',
    level: modeLabel,
  };
}
