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
  
  // Track page views with GTM (dataLayer) or Google Analytics (gtag) fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    const isDev = process.env.NODE_ENV !== 'production';

    // If Google Tag Manager is present, push a custom event to dataLayer to avoid duplicate automatic page_view sends.
    // Configure your GTM workspace with a GA4 Event tag that listens for 'virtual_page_view' (or disable automatic page_view in the GA4 Configuration tag).
    if (w.dataLayer) {
      const payload: Record<string, any> = {
        event: 'virtual_page_view',
        page_path: pathname,
        page_title: document.title,
        ...(isDev ? { debug_mode: true } : {}),
      };
      w.dataLayer.push(payload);
      if (isDev) console.debug('[Analytics][dataLayer] pushed', payload);
      return;
    }

    // fallback to gtag if available (include debug_mode in dev)
    if (w.gtag) {
      const payload = {
        page_path: pathname,
        page_title: document.title,
        debug_mode: isDev,
      };
      w.gtag('event', 'page_view', payload);
      if (isDev) console.debug('[Analytics][gtag] event', 'page_view', payload);
    }
  }, [pathname]);

  return <>{children}</>;
}
