/**
 * Analytics Initialization
 * Handles Firebase Analytics setup and configuration
 */

import { AnalyticsConfig } from './config';

/**
 * Get Firebase configuration from environment variables
 */
export function getAnalyticsConfig(): AnalyticsConfig | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };

  // Validate required configuration
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId || !config.measurementId || !config.storageBucket) {
    console.warn('Firebase Analytics configuration is incomplete. Analytics will not be initialized.');
    return null;
  }

  return config as AnalyticsConfig;
}

/**
 * Initialize analytics with environment configuration
 */
export async function initializeAnalytics(): Promise<boolean> {
  const config = getAnalyticsConfig();
  
  if (!config) {
    return false;
  }

  try {
    const { firebaseAnalytics } = require('./firebase');
    return await firebaseAnalytics.initialize(config);
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
    return false;
  }
}
