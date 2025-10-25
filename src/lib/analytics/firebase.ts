/**
 * Firebase Analytics Service (robust)
 * - Async initialize with isSupported()
 * - Queues events until ready
 * - Guards SSR and missing measurementId
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAnalytics,
  isSupported,
  Analytics,
  logEvent as gaLogEvent,
  setUserProperties as gaSetUserProperties,
  setUserId as gaSetUserId,
} from 'firebase/analytics';
import { AnalyticsConfig } from './config';

type PendingJob =
  | { kind: 'event'; name: string; params?: Record<string, any> }
  | { kind: 'props'; props: Record<string, string | number | boolean> }
  | { kind: 'uid'; uid: string };

class FirebaseAnalyticsService {
  private app: FirebaseApp | null = null;
  private analytics: Analytics | null = null;

  private initStarted = false;
  private initDone = false;
  private initPromise: Promise<boolean> | null = null;

  // Buffer calls that happen before init completes
  private queue: PendingJob[] = [];

  /**
   * Initialize Firebase Analytics (call once, but safe to call multiple times)
   */
  public async initialize(config: AnalyticsConfig): Promise<boolean> {
    if (this.initDone) return true;
    if (this.initPromise) return this.initPromise;

    this.initStarted = true;

    this.initPromise = (async () => {
      try {
        // SSR guard
        if (typeof window === 'undefined') {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Firebase Analytics: skipped on server.');
          }
          return false;
        }

        // Must have a Web stream (G-XXXX) for Analytics
        const measurementId = (config as any).measurementId;
        if (!measurementId) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Firebase Analytics: missing measurementId in config.');
          }
          return false;
        }

        // Initialize / reuse Firebase app
        const existingApps = getApps();
        this.app = existingApps.length ? existingApps[0] : initializeApp(config);

        // Respect environments that don’t support Analytics (e.g., Safari Private, strict blockers)
        const supported = await isSupported().catch(() => false);
        if (!supported) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Firebase Analytics not supported in this environment.');
          }
          return false;
        }

        this.analytics = getAnalytics(this.app);
        this.initDone = true;
        if (process.env.NODE_ENV !== 'production') {
          console.log('Firebase Analytics initialized.');
        }

        // Drain any queued calls
        this.flushQueue();

        return true;
      } catch (err) {
        console.error('Failed to initialize Firebase Analytics:', err);
        return false;
      }
    })();

    return this.initPromise;
  }

  /**
   * Whether analytics is ready to accept events
   */
  public isAvailable(): boolean {
    return this.initDone && this.analytics !== null;
  }

  /**
   * Log a custom event (safe to call before init finishes)
   */
  public logEvent(eventName: string, parameters?: Record<string, any>): void {
    if (this.isAvailable() && this.analytics) {
      try {
        gaLogEvent(this.analytics, eventName, parameters);
      } catch (e) {
        console.error('Failed to log event:', eventName, e);
      }
      return;
    }

    // Not ready yet — queue it
    this.queue.push({ kind: 'event', name: eventName, params: parameters });
    if (!this.initStarted) {
      console.warn(`Analytics not initialized yet, queued event: ${eventName}`);
    }
  }

  /**
   * Set user properties (safe before init)
   */
  public setUserProperties(properties: Record<string, string | number | boolean>): void {
    if (this.isAvailable() && this.analytics) {
      try {
        gaSetUserProperties(this.analytics, properties);
      } catch (e) {
        console.error('Failed to set user properties:', e);
      }
      return;
    }
    this.queue.push({ kind: 'props', props: properties });
    if (!this.initStarted) {
      console.warn('Analytics not initialized yet, queued user properties.');
    }
  }

  /**
   * Set user ID (safe before init)
   */
  public setUserId(userId: string): void {
    if (this.isAvailable() && this.analytics) {
      try {
        gaSetUserId(this.analytics, userId);
      } catch (e) {
        console.error('Failed to set user ID:', e);
      }
      return;
    }
    this.queue.push({ kind: 'uid', uid: userId });
    if (!this.initStarted) {
      console.warn('Analytics not initialized yet, queued user id.');
    }
  }

  /**
   * Get analytics instance (for advanced usage)
   */
  public getAnalytics(): Analytics | null {
    return this.analytics;
  }

  /**
   * Flush buffered calls after init
   */
  private flushQueue(): void {
    if (!this.analytics) return;
    const a = this.analytics;

    for (const job of this.queue) {
      try {
        switch (job.kind) {
          case 'event':
            gaLogEvent(a, job.name, job.params);
            break;
          case 'props':
            gaSetUserProperties(a, job.props);
            break;
          case 'uid':
            gaSetUserId(a, job.uid);
            break;
        }
      } catch (e) {
        console.warn('Deferred analytics call failed:', job, e);
      }
    }
    this.queue = [];
  }
}

// Export singleton instance
export const firebaseAnalytics = new FirebaseAnalyticsService();
