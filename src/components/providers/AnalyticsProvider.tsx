/**
 * Analytics Provider
 * Initializes and provides analytics context to the app
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAnalytics } from '@/lib/analytics';
import { AnalyticsConfig } from '@/lib/analytics/config';

interface AnalyticsContextType {
  isInitialized: boolean;
  initializeAnalytics: (config: AnalyticsConfig) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: AnalyticsConfig;
}

export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAnalytics = async (analyticsConfig: AnalyticsConfig) => {
    try {
      const success = await firebaseAnalytics.initialize(analyticsConfig);
      setIsInitialized(success);
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  };

  useEffect(() => {
    if (config) {
      initializeAnalytics(config);
    }
  }, [config]);

  const contextValue: AnalyticsContextType = {
    isInitialized,
    initializeAnalytics,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
