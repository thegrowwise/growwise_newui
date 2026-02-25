/**
 * Analytics Hooks
 * React hooks for easy analytics integration
 */

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsTracker } from './tracker';

/**
 * Hook to automatically track page views
 */
export function usePageTracking(pageTitle?: string) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analyticsTracker.trackPageView(pathname, pageTitle);
    }
  }, [pathname, pageTitle]);
}

/**
 * Hook to track button clicks
 */
export function useButtonTracking() {
  const trackButtonClick = useCallback((
    buttonName: string, 
    location?: string, 
    options?: Record<string, any>
  ) => {
    analyticsTracker.trackButtonClick(buttonName, location, options);
  }, []);

  const trackCTAClick = useCallback((
    ctaName: string, 
    location?: string, 
    options?: Record<string, any>
  ) => {
    analyticsTracker.trackCTAClick(ctaName, location, options);
  }, []);

  const trackEnrollNowClick = useCallback((
    location: string, 
    courseName?: string
  ) => {
    analyticsTracker.trackEnrollNowClick(location, courseName);
  }, []);

  return {
    trackButtonClick,
    trackCTAClick,
    trackEnrollNowClick,
  };
}

/**
 * Hook to track form interactions
 */
export function useFormTracking() {
  const trackFormStart = useCallback((formName: string) => {
    analyticsTracker.trackFormStart(formName);
  }, []);

  const trackFormSubmit = useCallback((
    formName: string, 
    success: boolean = true, 
    errorMessage?: string
  ) => {
    analyticsTracker.trackFormSubmit(formName, success, errorMessage);
  }, []);

  const trackFormAbandon = useCallback((
    formName: string, 
    step?: string
  ) => {
    analyticsTracker.trackFormAbandon(formName, step);
  }, []);

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormAbandon,
  };
}

/**
 * Hook to track course interactions
 */
export function useCourseTracking() {
  const trackCourseView = useCallback((courseName: string, category: string) => {
    analyticsTracker.trackCourseView(courseName, category);
  }, []);

  const trackCourseClick = useCallback((courseName: string, category: string) => {
    analyticsTracker.trackCourseClick(courseName, category);
  }, []);

  return {
    trackCourseView,
    trackCourseClick,
  };
}

/**
 * Hook to track navigation
 */
export function useNavigationTracking() {
  const trackNavigationClick = useCallback((menuItem: string, location: string = 'header') => {
    analyticsTracker.trackNavigationClick(menuItem, location);
  }, []);

  return {
    trackNavigationClick,
  };
}

/**
 * Hook to track search
 */
export function useSearchTracking() {
  const trackSearchQuery = useCallback((searchTerm: string, resultsCount?: number) => {
    analyticsTracker.trackSearchQuery(searchTerm, resultsCount);
  }, []);

  return {
    trackSearchQuery,
  };
}

/**
 * Hook to track session lifecycle
 */
export function useSessionTracking() {
  useEffect(() => {
    // Track session start
    analyticsTracker.trackSessionStart();

    // Track bounce if user leaves quickly (less than 10 seconds)
    const bounceTimeout = setTimeout(() => {
      // If user is still on the page after 10 seconds, they didn't bounce
    }, 10000);

    // Use pagehide (not beforeunload/unload) to preserve bfcache. When persisted is true, page is being cached — skip work.
    const handlePageHide = (event: PageTransitionEvent) => {
      if (event.persisted) return;
      clearTimeout(bounceTimeout);
      const sessionDuration = Date.now() - performance.now();
      if (sessionDuration < 10000) {
        analyticsTracker.trackBounce();
      }
      analyticsTracker.trackSessionEnd();
    };

    window.addEventListener('pagehide', handlePageHide);

    return () => {
      clearTimeout(bounceTimeout);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);
}
