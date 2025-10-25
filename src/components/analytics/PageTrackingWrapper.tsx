/**
 * Page Tracking Wrapper
 * Automatically tracks page views and session lifecycle
 */

'use client';

import React, { useEffect } from 'react';
import { usePageTracking, useSessionTracking } from '@/lib/analytics/hooks';
import { usePathname } from 'next/navigation';

interface PageTrackingWrapperProps {
  children: React.ReactNode;
}

export function PageTrackingWrapper({ children }: PageTrackingWrapperProps) {
  const pathname = usePathname();
  
  // Track page views automatically
  usePageTracking();
  
  // Track session lifecycle
  useSessionTracking();

  // Track page title changes
  useEffect(() => {
    const pageTitle = document.title;
    if (pathname && pageTitle) {
      // Additional page tracking logic can be added here
      console.log(`Analytics: Page view tracked - ${pathname} (${pageTitle})`);
    }
  }, [pathname]);

  return <>{children}</>;
}
