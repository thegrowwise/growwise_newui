'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
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