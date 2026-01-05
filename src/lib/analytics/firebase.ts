/**
 * Firebase Analytics Service (robust)
 * - Async initialize with isSupported()
 * - Queues events until ready
 * - Guards SSR and missing measurementId
 */

	// Lazy import Firebase only in the browser to avoid bundling it on the server
	// Types are declared here to keep the rest of the file typed.
	type FirebaseApp = import('firebase/app').FirebaseApp;
	type Analytics = import('firebase/analytics').Analytics;
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

	        // Dynamically import Firebase SDK only on client
	        const [{ initializeApp, getApps }, analyticsModule] = await Promise.all([
	          import('firebase/app'),
	          import('firebase/analytics'),
	        ]);
	        
	        const { getAnalytics, isSupported, logEvent, setUserId } = analyticsModule;

	        // Initialize / reuse Firebase app
	        const existingApps = getApps();
	        this.app = existingApps.length ? existingApps[0] : initializeApp(config as any);

        // Respect environments that don’t support Analytics (e.g., Safari Private, strict blockers)
        const supported = await isSupported().catch(() => false);
        if (!supported) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Firebase Analytics not supported in this environment.');
          }
          return false;
        }

	        this.analytics = getAnalytics(this.app);
        
        // Store analytics functions for later use
        (this as any)._logEvent = logEvent;
        (this as any)._setUserId = setUserId;
        
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
    // Guard against SSR
    if (typeof window === 'undefined') {
      return;
    }

    if (this.isAvailable() && this.analytics) {
      try {
        const logEventFn = (this as any)._logEvent;
        if (logEventFn && typeof logEventFn === 'function') {
          logEventFn(this.analytics, eventName, parameters);
        } else {
          // Queue if function not available yet
          this.queue.push({ kind: 'event', name: eventName, params: parameters });
        }
      } catch (e) {
        // Silently fail in production, log in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to log event:', eventName, e);
        }
      }
      return;
    }

    // Not ready yet — queue it
    this.queue.push({ kind: 'event', name: eventName, params: parameters });
  }

  /**
   * Set user properties (safe before init)
   * Note: Firebase Analytics doesn't have a direct setUserProperties function.
   * User properties should be sent as custom parameters in events.
   */
  public setUserProperties(properties: Record<string, string | number | boolean>): void {
    // Guard against SSR
    if (typeof window === 'undefined') {
      return;
    }

    if (this.isAvailable() && this.analytics) {
      try {
        // Log user properties as a custom event
        const logEventFn = (this as any)._logEvent;
        if (logEventFn && typeof logEventFn === 'function') {
          logEventFn(this.analytics, 'user_properties_set', properties);
        } else {
          // Queue if function not available yet
          this.queue.push({ kind: 'props', props: properties });
        }
      } catch (e) {
        // Silently fail in production, log in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to set user properties:', e);
        }
      }
      return;
    }
    this.queue.push({ kind: 'props', props: properties });
  }

  /**
   * Set user ID (safe before init)
   */
  public setUserId(userId: string): void {
    // Guard against SSR
    if (typeof window === 'undefined') {
      return;
    }

    if (this.isAvailable() && this.analytics) {
      try {
        const setUserIdFn = (this as any)._setUserId;
        if (setUserIdFn && typeof setUserIdFn === 'function') {
          setUserIdFn(this.analytics, userId);
        } else {
          // Queue if function not available yet
          this.queue.push({ kind: 'uid', uid: userId });
        }
      } catch (e) {
        // Silently fail in production, log in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to set user ID:', e);
        }
      }
      return;
    }
    this.queue.push({ kind: 'uid', uid: userId });
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
    if (!this.analytics || typeof window === 'undefined') return;
    const a = this.analytics;
    const logEventFn = (this as any)._logEvent;
    const setUserIdFn = (this as any)._setUserId;

    for (const job of this.queue) {
      try {
        switch (job.kind) {
          case 'event':
            if (logEventFn && typeof logEventFn === 'function') {
              logEventFn(a, job.name, job.params);
            }
            break;
          case 'props':
            // Log user properties as a custom event
            if (logEventFn && typeof logEventFn === 'function') {
              logEventFn(a, 'user_properties_set', job.props);
            }
            break;
          case 'uid':
            if (setUserIdFn && typeof setUserIdFn === 'function') {
              setUserIdFn(a, job.uid);
            }
            break;
        }
      } catch (e) {
        // Silently fail in production, log in development
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Deferred analytics call failed:', job, e);
        }
      }
    }
    this.queue = [];
  }
}

// Export singleton instance
export const firebaseAnalytics = new FirebaseAnalyticsService();
