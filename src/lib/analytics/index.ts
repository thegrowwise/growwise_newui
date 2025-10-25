/**
 * Analytics Module Exports
 * Central export point for all analytics functionality
 */

// Core services
export { firebaseAnalytics } from './firebase';
export { analyticsTracker } from './tracker';

// Configuration
export { ANALYTICS_EVENTS, ANALYTICS_PARAMS } from './config';
export type { AnalyticsConfig, AnalyticsEvent, UserProperties } from './config';

// Hooks
export {
  usePageTracking,
  useButtonTracking,
  useFormTracking,
  useCourseTracking,
  useNavigationTracking,
  useSearchTracking,
  useSessionTracking,
} from './hooks';

// Components
export {
  TrackedButton,
  TrackedLink,
  TrackedEnrollButton,
  TrackedForm,
} from './components';

// Re-export types for convenience
export type { TrackingOptions } from './tracker';
