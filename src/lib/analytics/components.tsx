/**
 * Analytics Components
 * Reusable components with built-in analytics tracking
 */

import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { analyticsTracker } from './tracker';

interface TrackedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackingName: string;
  trackingLocation?: string;
  trackingOptions?: Record<string, any>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

/**
 * Button component with automatic analytics tracking
 */
export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(
  ({ 
    trackingName, 
    trackingLocation, 
    trackingOptions, 
    onClick, 
    children, 
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track the button click
      analyticsTracker.trackButtonClick(trackingName, trackingLocation, trackingOptions);
      
      // Call the original onClick handler
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

TrackedButton.displayName = 'TrackedButton';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  trackingName: string;
  trackingLocation?: string;
  trackingOptions?: Record<string, any>;
  children: React.ReactNode;
}

/**
 * Link component with automatic analytics tracking
 */
export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  ({ 
    trackingName, 
    trackingLocation, 
    trackingOptions, 
    onClick, 
    children, 
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Track the link click
      analyticsTracker.trackButtonClick(trackingName, trackingLocation, trackingOptions);
      
      // Call the original onClick handler
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <a ref={ref} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }
);

TrackedLink.displayName = 'TrackedLink';

interface TrackedEnrollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  location: string;
  courseName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

/**
 * Specialized button for "Enroll Now" actions with enrollment tracking
 */
export const TrackedEnrollButton = forwardRef<HTMLButtonElement, TrackedEnrollButtonProps>(
  ({ 
    location, 
    courseName, 
    onClick, 
    children, 
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track enrollment click
      analyticsTracker.trackEnrollNowClick(location, courseName);
      
      // Call the original onClick handler
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

TrackedEnrollButton.displayName = 'TrackedEnrollButton';

interface TrackedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formName: string;
  onFormStart?: () => void;
  onFormSubmit?: (success: boolean, errorMessage?: string) => void;
  onFormAbandon?: (step?: string) => void;
  children: React.ReactNode;
}

/**
 * Form component with automatic form tracking
 */
export const TrackedForm = forwardRef<HTMLFormElement, TrackedFormProps>(
  ({ 
    formName, 
    onFormStart, 
    onFormSubmit, 
    onFormAbandon, 
    onSubmit, 
    children, 
    ...props 
  }, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      // Track form start if not already tracked
      analyticsTracker.trackFormStart(formName);
      
      // Call the original onSubmit handler
      if (onSubmit) {
        onSubmit(e);
      }
    };

    // Track form start when component mounts
    React.useEffect(() => {
      analyticsTracker.trackFormStart(formName);
      if (onFormStart) {
        onFormStart();
      }
    }, [formName, onFormStart]);

    return (
      <form ref={ref} onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    );
  }
);

TrackedForm.displayName = 'TrackedForm';
