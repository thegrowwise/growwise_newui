/**
 * Page Tracking Wrapper
 * Automatically tracks page views with Google Analytics 4
 */

'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PageTrackingWrapperProps {
  children: React.ReactNode;
}

export function PageTrackingWrapper({ children }: PageTrackingWrapperProps) {
  const pathname = usePathname();
  
  // Track page views with Google Analytics
  useEffect(() => {
    // gtag is automatically available via the GoogleAnalytics component
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return <>{children}</>;
}
