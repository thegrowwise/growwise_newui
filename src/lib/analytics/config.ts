/**
 * Firebase Analytics Configuration
 * Centralized configuration for analytics tracking
 */

export interface AnalyticsConfig {
  measurementId: string;
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket: string;
}

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

export interface UserProperties {
  [key: string]: string | number | boolean;
}

// Event names constants for consistency
export const ANALYTICS_EVENTS = {
  // Navigation Events
  PAGE_VIEW: 'page_view',
  NAVIGATION_CLICK: 'navigation_click',
  MENU_ITEM_CLICK: 'menu_item_click',
  
  // Course Events
  COURSE_VIEW: 'course_view',
  COURSE_CLICK: 'course_click',
  COURSE_ENROLL_CLICK: 'course_enroll_click',
  
  // Form Events
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ABANDON: 'form_abandon',
  ENROLLMENT_START: 'enrollment_start',
  ENROLLMENT_COMPLETE: 'enrollment_complete',
  
  // Button Events
  BUTTON_CLICK: 'button_click',
  CTA_CLICK: 'cta_click',
  ENROLL_NOW_CLICK: 'enroll_now_click',
  
  // User Journey Events
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  BOUNCE: 'bounce',
  
  // Business Events
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  TESTIMONIAL_VIEW: 'testimonial_view',
  SEARCH_QUERY: 'search_query',
} as const;

// Event parameters constants
export const ANALYTICS_PARAMS = {
  PAGE_TITLE: 'page_title',
  PAGE_PATH: 'page_path',
  PAGE_LOCATION: 'page_location',
  BUTTON_NAME: 'button_name',
  BUTTON_LOCATION: 'button_location',
  COURSE_NAME: 'course_name',
  COURSE_CATEGORY: 'course_category',
  FORM_NAME: 'form_name',
  FORM_STEP: 'form_step',
  USER_TYPE: 'user_type',
  SESSION_DURATION: 'session_duration',
  BOUNCE_RATE: 'bounce_rate',
  SEARCH_TERM: 'search_term',
  ERROR_MESSAGE: 'error_message',
} as const;
