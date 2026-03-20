import { useState, useEffect } from 'react';

export type DeliveryMode = 'live' | 'studio';
export type TierName = 'core' | 'plus' | 'elite';
export type Track = 'coding' | 'game-dev';

export interface JourneyLevel {
  id: string;
  program_id: string;
  level_num: number;
  name: string;
  milestones: string;
  price_live: number | null;
  price_studio: number;
}

export interface Tier {
  id: string;
  program_id: string;
  name: TierName;
  price_live: number | null;
  price_studio: number;
  is_featured: boolean;
  includes: string[];
  sort_order: number;
}

export interface ProgramFee {
  id: string;
  program_id: string;
  fee_type: 'enrollment' | 'diagnostic' | 'kit';
  name: string;
  amount: number;
  description: string;
}

export interface ProgramAddon {
  id: string;
  program_id: string;
  name: string;
  price: number;
  active: boolean;
  sort_order: number;
}

export interface Program {
  id: string;
  track: Track;
  name: string;
  tagline: string;
  age_min: number;
  age_max: number;
  studio_only: boolean;
  active: boolean;
  sort_order: number;
  journey_levels: JourneyLevel[];
  tiers: Tier[];
  program_fees: ProgramFee[];
  program_addons: ProgramAddon[];
}

export interface AgeRecommenderRule {
  min: number;
  max: number;
  program_id: string;
  reason_key: string;
}

export interface PricingConfig {
  programs: Program[];
  last_updated: string;
  age_recommender?: {
    game_dev?: AgeRecommenderRule[];
  };
}

let globalCache: PricingConfig | null = null;

export function usePricingConfig() {
  const [data, setData] = useState<PricingConfig | null>(globalCache);
  const [loading, setLoading] = useState(!globalCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (globalCache) return;
    setLoading(true);
    fetch('/api/pricing-config')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          globalCache = json.data;
          setData(json.data);
        } else {
          setError('Failed to load pricing');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  const getProgramsByTrack = (track: Track) =>
    (data?.programs ?? [])
      .filter((p) => p.track === track && p.active)
      .sort((a, b) => a.sort_order - b.sort_order);

  const getProgramById = (id: string) =>
    data?.programs.find((p) => p.id === id) ?? null;

  const getTierPrice = (tier: Tier, mode: DeliveryMode) =>
    mode === 'studio' ? tier.price_studio : (tier.price_live ?? tier.price_studio);

  const getLevelPrice = (level: JourneyLevel, mode: DeliveryMode) =>
    mode === 'studio' ? level.price_studio : (level.price_live ?? level.price_studio);

  return {
    data,
    loading,
    error,
    getProgramsByTrack,
    getProgramById,
    getTierPrice,
    getLevelPrice,
  };
}
