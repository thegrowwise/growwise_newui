/**
 * Mirrors growwise_backend/src/routes/pricingConfig.js — journey level prices
 * are derived from tier core→elite deltas so the UI ladder stays consistent.
 */

import type { Program } from '@/hooks/usePricingConfig';

const LADDER_TRACKS = new Set(['coding', 'game-dev']);

function findTierByName(
  tiers: Program['tiers'] | undefined,
  name: string,
): Program['tiers'][0] | null {
  if (!Array.isArray(tiers)) return null;
  const lower = name.toLowerCase();
  const found = tiers.find((t) => String(t.name).toLowerCase() === lower);
  return found ?? null;
}

/** Same behavior as Express `applyJourneyLevelLadder`. */
export function applyJourneyLevelLadder(program: Program): Program {
  if (!program || !LADDER_TRACKS.has(program.track)) return program;

  const core = findTierByName(program.tiers, 'core');
  const elite = findTierByName(program.tiers, 'elite');
  if (!core || !elite) return program;

  const deltaStudio = Number(elite.price_studio) - Number(core.price_studio);
  if (!Number.isFinite(deltaStudio)) return program;

  const hasLive =
    core.price_live != null &&
    elite.price_live != null &&
    Number.isFinite(Number(core.price_live)) &&
    Number.isFinite(Number(elite.price_live));
  const deltaLive = hasLive ? Number(elite.price_live) - Number(core.price_live) : null;

  const levels = [...(program.journey_levels ?? [])].sort((a, b) => a.level_num - b.level_num);
  if (levels.length === 0) return program;

  const first = levels[0];
  const baseStudio = Number(first.price_studio);
  const baseLive = first.price_live != null ? Number(first.price_live) : null;

  const journey_levels = levels.map((level, index) => {
    const i = index;
    const nextStudio = baseStudio + i * deltaStudio;
    let nextLive: number | null = null;
    if (deltaLive != null && baseLive != null && Number.isFinite(baseLive)) {
      nextLive = baseLive + i * deltaLive;
    }
    return {
      ...level,
      price_studio: nextStudio,
      ...(nextLive != null && Number.isFinite(nextLive)
        ? { price_live: nextLive }
        : { price_live: null as number | null }),
    };
  });

  return { ...program, journey_levels };
}

export function applyLadderToPrograms(programs: Program[]): Program[] {
  return programs.map(applyJourneyLevelLadder);
}
