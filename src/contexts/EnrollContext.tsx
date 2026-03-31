'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { TierName, DeliveryMode } from '@/hooks/usePricingConfig';

interface EnrollState {
  programId: string | null;
  tierName: TierName | null;
  deliveryMode: DeliveryMode;
  addonIds: string[];
  childCount: number;
}

interface EnrollContextValue extends EnrollState {
  setProgram: (id: string) => void;
  setTier: (name: TierName) => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  toggleAddon: (id: string) => void;
  setChildCount: (n: number) => void;
  reset: () => void;
  buildEnrollUrl: () => string;
}

const defaultState: EnrollState = {
  programId: null,
  tierName: null,
  deliveryMode: 'live',
  addonIds: [],
  childCount: 1,
};

const EnrollContext = createContext<EnrollContextValue | null>(null);

export function EnrollProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EnrollState>(defaultState);
  const searchParams = useSearchParams();

  const setProgram = (programId: string) =>
    setState((s) => ({ ...s, programId }));

  const setTier = (tierName: TierName) =>
    setState((s) => ({ ...s, tierName }));

  const setDeliveryMode = (deliveryMode: DeliveryMode) =>
    setState((s) => ({ ...s, deliveryMode }));

  const toggleAddon = (id: string) =>
    setState((s) => ({
      ...s,
      addonIds: s.addonIds.includes(id)
        ? s.addonIds.filter((x) => x !== id)
        : [...s.addonIds, id],
    }));

  const setChildCount = (childCount: number) =>
    setState((s) => ({ ...s, childCount }));

  const reset = () => setState(defaultState);

  useEffect(() => {
    const programFromUrl = searchParams.get('program');
    const tierFromUrl = searchParams.get('tier') as TierName | null;
    const modeFromUrl = searchParams.get('mode') as DeliveryMode | null;
    const addonsFromUrl = searchParams.get('addons');
    const childrenFromUrl = searchParams.get('children');

    const hasParams =
      programFromUrl || tierFromUrl || modeFromUrl || addonsFromUrl || childrenFromUrl;

    if (!hasParams) return;

    setState((current) => {
      if (current.programId || current.tierName || current.addonIds.length) {
        return current;
      }

      const next: EnrollState = {
        programId: programFromUrl ?? null,
        tierName:
          tierFromUrl === 'core' || tierFromUrl === 'plus' || tierFromUrl === 'elite'
            ? tierFromUrl
            : null,
        deliveryMode: modeFromUrl === 'studio' || modeFromUrl === 'live'
          ? modeFromUrl
          : current.deliveryMode,
        addonIds: addonsFromUrl ? addonsFromUrl.split(',').filter(Boolean) : [],
        childCount: childrenFromUrl ? Number(childrenFromUrl) || 1 : current.childCount,
      };

      return next;
    });
  }, [searchParams]);

  const buildEnrollUrl = () => {
    const p = new URLSearchParams();
    if (state.programId) p.set('program', state.programId);
    if (state.tierName) p.set('tier', state.tierName);
    p.set('mode', state.deliveryMode);
    if (state.addonIds.length) p.set('addons', state.addonIds.join(','));
    p.set('children', String(state.childCount));
    return `/enroll?${p.toString()}`;
  };

  return (
    <EnrollContext.Provider
      value={{
        ...state,
        setProgram,
        setTier,
        setDeliveryMode,
        toggleAddon,
        setChildCount,
        reset,
        buildEnrollUrl,
      }}
    >
      {children}
    </EnrollContext.Provider>
  );
}

export function useEnroll() {
  const ctx = useContext(EnrollContext);
  if (!ctx) throw new Error('useEnroll must be used inside EnrollProvider');
  return ctx;
}
