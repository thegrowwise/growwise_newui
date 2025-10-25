/**
 * Analytics Tracker
 * High-level analytics tracking with business logic
 */

import { firebaseAnalytics } from './firebase';
import { ANALYTICS_EVENTS, ANALYTICS_PARAMS } from './config';

export interface TrackingOptions {
  pageTitle?: string;
  pagePath?: string;
  buttonName?: string;
  buttonLocation?: string;
  courseName?: string;
  courseCategory?: string;
  formName?: string;
  formStep?: string;
  searchTerm?: string;
  errorMessage?: string;
  [key: string]: any;
}

class AnalyticsTracker {
  private sessionStartTime: number = Date.now();
  private currentPage: string = '';

  /**
   * Track page view
   */
  public trackPageView(pagePath: string, pageTitle?: string): void {
    this.currentPage = pagePath;
    
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      [ANALYTICS_PARAMS.PAGE_TITLE]: pageTitle || document.title,
      [ANALYTICS_PARAMS.PAGE_PATH]: pagePath,
      [ANALYTICS_PARAMS.PAGE_LOCATION]: window.location.href,
    });
  }

  /**
   * Track navigation clicks
   */
  public trackNavigationClick(menuItem: string, location: string = 'header'): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.NAVIGATION_CLICK, {
      [ANALYTICS_PARAMS.BUTTON_NAME]: menuItem,
      [ANALYTICS_PARAMS.BUTTON_LOCATION]: location,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track button clicks
   */
  public trackButtonClick(buttonName: string, location?: string, options?: TrackingOptions): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.BUTTON_CLICK, {
      [ANALYTICS_PARAMS.BUTTON_NAME]: buttonName,
      [ANALYTICS_PARAMS.BUTTON_LOCATION]: location || 'unknown',
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
      ...options,
    });
  }

  /**
   * Track CTA clicks
   */
  public trackCTAClick(ctaName: string, location?: string, options?: TrackingOptions): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.CTA_CLICK, {
      [ANALYTICS_PARAMS.BUTTON_NAME]: ctaName,
      [ANALYTICS_PARAMS.BUTTON_LOCATION]: location || 'unknown',
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
      ...options,
    });
  }

  /**
   * Track "Enroll Now" button clicks
   */
  public trackEnrollNowClick(location: string, courseName?: string): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.ENROLL_NOW_CLICK, {
      [ANALYTICS_PARAMS.BUTTON_LOCATION]: location,
      [ANALYTICS_PARAMS.COURSE_NAME]: courseName || 'general',
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track course views
   */
  public trackCourseView(courseName: string, category: string): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.COURSE_VIEW, {
      [ANALYTICS_PARAMS.COURSE_NAME]: courseName,
      [ANALYTICS_PARAMS.COURSE_CATEGORY]: category,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track course clicks
   */
  public trackCourseClick(courseName: string, category: string): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.COURSE_CLICK, {
      [ANALYTICS_PARAMS.COURSE_NAME]: courseName,
      [ANALYTICS_PARAMS.COURSE_CATEGORY]: category,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track form interactions
   */
  public trackFormStart(formName: string): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.FORM_START, {
      [ANALYTICS_PARAMS.FORM_NAME]: formName,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track form submission
   */
  public trackFormSubmit(formName: string, success: boolean = true, errorMessage?: string): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.FORM_SUBMIT, {
      [ANALYTICS_PARAMS.FORM_NAME]: formName,
      success,
      [ANALYTICS_PARAMS.ERROR_MESSAGE]: errorMessage || null,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track form abandonment
   */
  public trackFormAbandon(formName: string, step?: string): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.FORM_ABANDON, {
      [ANALYTICS_PARAMS.FORM_NAME]: formName,
      [ANALYTICS_PARAMS.FORM_STEP]: step || 'unknown',
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track enrollment process
   */
  public trackEnrollmentStart(): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.ENROLLMENT_START, {
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track enrollment completion
   */
  public trackEnrollmentComplete(success: boolean = true): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.ENROLLMENT_COMPLETE, {
      success,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track search queries
   */
  public trackSearchQuery(searchTerm: string, resultsCount?: number): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.SEARCH_QUERY, {
      [ANALYTICS_PARAMS.SEARCH_TERM]: searchTerm,
      results_count: resultsCount || 0,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track testimonial views
   */
  public trackTestimonialView(testimonialId?: string): void {
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.TESTIMONIAL_VIEW, {
      testimonial_id: testimonialId || 'unknown',
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track session start
   */
  public trackSessionStart(): void {
    this.sessionStartTime = Date.now();
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.SESSION_START, {
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track session end
   */
  public trackSessionEnd(): void {
    const sessionDuration = Date.now() - this.sessionStartTime;
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.SESSION_END, {
      [ANALYTICS_PARAMS.SESSION_DURATION]: sessionDuration,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Track bounce (user leaves quickly)
   */
  public trackBounce(): void {
    const sessionDuration = Date.now() - this.sessionStartTime;
    firebaseAnalytics.logEvent(ANALYTICS_EVENTS.BOUNCE, {
      [ANALYTICS_PARAMS.SESSION_DURATION]: sessionDuration,
      [ANALYTICS_PARAMS.PAGE_PATH]: this.currentPage,
    });
  }

  /**
   * Set user properties
   */
  public setUserProperties(properties: Record<string, string | number | boolean>): void {
    firebaseAnalytics.setUserProperties(properties);
  }

  /**
   * Set user ID
   */
  public setUserId(userId: string): void {
    firebaseAnalytics.setUserId(userId);
  }
}

// Export singleton instance
export const analyticsTracker = new AnalyticsTracker();
