/**
 * Client-side Analytics Provider
 * Initializes Firebase Analytics on the client side only
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAnalytics } from '@/lib/analytics';
import { getAnalyticsConfig } from '@/lib/analytics/init';

interface AnalyticsContextType {
  isInitialized: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface ClientAnalyticsProviderProps {
  children: React.ReactNode;
}

export function ClientAnalyticsProvider({ children }: ClientAnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        const config = getAnalyticsConfig();
        if (config) {
          const success = await firebaseAnalytics.initialize(config);
          setIsInitialized(success);
          if (success) {
            console.log('Firebase Analytics initialized successfully');
          } else {
            console.warn('Firebase Analytics initialization failed');
          }
        } else {
          console.warn('Firebase Analytics configuration not found');
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };

    initializeAnalytics();
  }, []);

  const contextValue: AnalyticsContextType = {
    isInitialized,
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
    throw new Error('useAnalytics must be used within a ClientAnalyticsProvider');
  }
  return context;
}
