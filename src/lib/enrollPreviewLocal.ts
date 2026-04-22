import { readFileSync } from 'fs';
import { join } from 'path';
import type { DeliveryMode, PricingConfig, Tier, TierName } from '@/hooks/usePricingConfig';
import { applyLadderToPrograms } from '@/lib/pricingConfigLadder';
import type { EnrollPreviewRequestBody, EnrollPreviewResponse } from '@/lib/enrollCheckout';

const COMMITTED_CONFIG_PATH = join(
  process.cwd(),
  'public',
  'api',
  'mock',
  'en',
  'pricing-config.json',
);

function tierMonthlyForMode(tier: Tier, mode: DeliveryMode): number {
  return mode === 'studio' ? tier.price_studio : (tier.price_live ?? tier.price_studio);
}

/**
 * Builds the same shape as the Express `/api/enroll/preview` response from the committed
 * pricing JSON + ladder, so the review step works without proxying to another host.
 */
export function buildEnrollPreviewLocal(
  body: EnrollPreviewRequestBody,
): EnrollPreviewResponse | null {
  const tn = body.tier_name as TierName;
  if (tn !== 'core' && tn !== 'plus' && tn !== 'elite') return null;

  const mode: DeliveryMode = body.delivery_mode === 'studio' ? 'studio' : 'live';

  let raw: string;
  try {
    raw = readFileSync(COMMITTED_CONFIG_PATH, 'utf8');
  } catch {
    return null;
  }

  const config = JSON.parse(raw) as PricingConfig;
  if (!Array.isArray(config.programs)) return null;

  const programs = applyLadderToPrograms([...config.programs]);
  const program = programs.find((p) => p.id === body.program_id);
  if (!program) return null;

  const tier = program.tiers.find((t) => t.name === tn);
  if (!tier) return null;

  const childCount = Math.max(1, Math.floor(Number(body.child_count) || 1));
  const tierMonthly = tierMonthlyForMode(tier, mode);

  const line_items: {
    label: string;
    amount: number;
    type: 'recurring' | 'one_time';
  }[] = [];

  const tierLabel = tn.charAt(0).toUpperCase() + tn.slice(1);
  line_items.push({
    label: `${program.name} — ${tierLabel} monthly`,
    amount: tierMonthly * childCount,
    type: 'recurring',
  });

  let oneTimeTotal = 0;
  for (const fee of program.program_fees) {
    const amt = fee.amount * childCount;
    oneTimeTotal += amt;
    line_items.push({
      label: fee.name,
      amount: amt,
      type: 'one_time',
    });
  }

  let addonMonthly = 0;
  for (const addonId of body.addon_ids) {
    const addon = program.program_addons.find((a) => a.id === addonId && a.active);
    if (addon) {
      const amt = addon.price * childCount;
      addonMonthly += amt;
      line_items.push({
        label: `${addon.name} (monthly add-on)`,
        amount: amt,
        type: 'recurring',
      });
    }
  }

  const recurring_monthly_aov = tierMonthly * childCount + addonMonthly;
  const first_purchase_aov = recurring_monthly_aov + oneTimeTotal;
  const baseMonthly = tierMonthly * childCount;
  const aov_to_asp_ratio = baseMonthly > 0 ? first_purchase_aov / baseMonthly : 1;

  return {
    success: true,
    data: {
      program_id: program.id,
      tier_name: tn,
      delivery_mode: mode,
      line_items,
      first_purchase_aov,
      recurring_monthly_aov,
      aov_to_asp_ratio,
    },
  };
}
