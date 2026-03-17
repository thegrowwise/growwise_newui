/**
 * Unit tests for EnrollContext.
 *
 * Validates: setProgram, setTier, setDeliveryMode, toggleAddon, buildEnrollUrl.
 */

import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { EnrollProvider, useEnroll } from '../EnrollContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <EnrollProvider>{children}</EnrollProvider>;
}

describe('EnrollContext', () => {
  it('setProgram updates programId', () => {
    const { result } = renderHook(() => useEnroll(), { wrapper });
    expect(result.current.programId).toBeNull();
    act(() => result.current.setProgram('python'));
    expect(result.current.programId).toBe('python');
  });

  it('setTier updates tierName', () => {
    const { result } = renderHook(() => useEnroll(), { wrapper });
    expect(result.current.tierName).toBeNull();
    act(() => result.current.setTier('plus'));
    expect(result.current.tierName).toBe('plus');
  });

  it('setDeliveryMode updates deliveryMode', () => {
    const { result } = renderHook(() => useEnroll(), { wrapper });
    expect(result.current.deliveryMode).toBe('live');
    act(() => result.current.setDeliveryMode('studio'));
    expect(result.current.deliveryMode).toBe('studio');
  });

  it('buildEnrollUrl returns /enroll?program=python&tier=plus&mode=live&children=1', () => {
    const { result } = renderHook(() => useEnroll(), { wrapper });
    act(() => {
      result.current.setProgram('python');
      result.current.setTier('plus');
      result.current.setDeliveryMode('live');
    });
    const url = result.current.buildEnrollUrl();
    expect(url).toContain('/enroll?');
    expect(url).toContain('program=python');
    expect(url).toContain('tier=plus');
    expect(url).toContain('mode=live');
    expect(url).toContain('children=1');
  });

  it('toggleAddon adds on first call, removes on second call', () => {
    const { result } = renderHook(() => useEnroll(), { wrapper });
    expect(result.current.addonIds).toEqual([]);
    act(() => result.current.toggleAddon('kit'));
    expect(result.current.addonIds).toEqual(['kit']);
    act(() => result.current.toggleAddon('kit'));
    expect(result.current.addonIds).toEqual([]);
  });

  it('reset restores default state', () => {
    const { result } = renderHook(() => useEnroll(), { wrapper });
    act(() => {
      result.current.setProgram('python');
      result.current.setTier('plus');
      result.current.toggleAddon('kit');
    });
    act(() => result.current.reset());
    expect(result.current.programId).toBeNull();
    expect(result.current.tierName).toBeNull();
    expect(result.current.addonIds).toEqual([]);
    expect(result.current.childCount).toBe(1);
  });
});
