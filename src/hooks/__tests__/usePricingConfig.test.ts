/**
 * Unit tests for usePricingConfig data and helpers.
 *
 * Validates: fixture pricing JSON shape, getProgramsByTrack counts,
 * robotics studio_only, and getTierPrice/getLevelPrice logic.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type {
  PricingConfig,
  Program,
  Track,
  Tier,
  JourneyLevel,
  DeliveryMode,
} from '../usePricingConfig';

/** Test fixture only (same file the backend may read); API route does not serve this. */
const PRICING_FIXTURE_PATH = join(
  process.cwd(),
  'public',
  'api',
  'mock',
  'en',
  'pricing-config.json',
);

function loadPricingConfig(): PricingConfig {
  const raw = readFileSync(PRICING_FIXTURE_PATH, 'utf8');
  return JSON.parse(raw);
}

function getProgramsByTrack(data: PricingConfig | null, track: Track): Program[] {
  return (data?.programs ?? [])
    .filter((p) => p.track === track && p.active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

function getTierPrice(tier: Tier, mode: DeliveryMode): number {
  return mode === 'studio' ? tier.price_studio : (tier.price_live ?? tier.price_studio);
}

function getLevelPrice(level: JourneyLevel, mode: DeliveryMode): number {
  return mode === 'studio' ? level.price_studio : (level.price_live ?? level.price_studio);
}

describe('usePricingConfig data and helpers', () => {
  let config: PricingConfig;

  beforeAll(() => {
    config = loadPricingConfig();
  });

  it('loads pricing config with programs array', () => {
    expect(config).toBeDefined();
    expect(config.programs).toBeInstanceOf(Array);
    expect(config.last_updated).toBeDefined();
  });

  it('getProgramsByTrack("coding") returns 3 programs', () => {
    const programs = getProgramsByTrack(config, 'coding');
    expect(programs).toHaveLength(3);
    expect(programs.map((p) => p.name)).toContain('Python Programming');
    expect(programs.map((p) => p.name)).toContain('Machine Learning and Generative AI');
    expect(programs.map((p) => p.name)).toContain('AppSpark - App Development');
  });

  it('getProgramsByTrack("game-dev") returns 4 programs', () => {
    const programs = getProgramsByTrack(config, 'game-dev');
    expect(programs).toHaveLength(4);
    expect(programs.map((p) => p.name)).toContain('Scratch Game Development');
    expect(programs.map((p) => p.name)).toContain('Roblox Game Development');
    expect(programs.map((p) => p.name)).toContain('Minecraft Game Development');
    expect(programs.map((p) => p.name)).toContain('Robotics Fundamentals');
  });

  it('robotics program has studio_only: true', () => {
    const robotics = config.programs.find((p) => p.id === 'robotics');
    expect(robotics).toBeDefined();
    expect(robotics!.studio_only).toBe(true);
  });

  it('getTierPrice returns studio price for studio mode', () => {
    const program = config.programs[0];
    const tier = program.tiers[0];
    expect(getTierPrice(tier, 'studio')).toBe(tier.price_studio);
  });

  it('getTierPrice returns live price when available, else studio', () => {
    const programWithLive = config.programs.find((p) =>
      p.tiers.some((t) => t.price_live != null),
    );
    expect(programWithLive).toBeDefined();
    const tier = programWithLive!.tiers[0];
    expect(getTierPrice(tier, 'live')).toBe(tier.price_live ?? tier.price_studio);
  });

  it('getLevelPrice returns studio price for robotics (live null)', () => {
    const robotics = config.programs.find((p) => p.id === 'robotics');
    expect(robotics).toBeDefined();
    const level = robotics!.journey_levels[0];
    expect(level.price_live).toBeNull();
    expect(getLevelPrice(level, 'live')).toBe(level.price_studio);
    expect(getLevelPrice(level, 'studio')).toBe(level.price_studio);
  });
});
