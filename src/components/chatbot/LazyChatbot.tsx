'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Chatbot = dynamic(() => import('./Chatbot'), {
  ssr: false,
});

/**
 * Defers mounting the chat bundle until the browser is idle (or user scrolls / taps).
 * Keeps homepage main-thread/network work lighter during LCP/TBT-heavy first seconds.
 */
export default function LazyChatbot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return undefined;
    const w = typeof window !== 'undefined' ? window : undefined;
    if (!w) return undefined;

    let cancelled = false;
    const show = () => {
      if (!cancelled) setMounted(true);
    };

    w.addEventListener('scroll', show, { once: true, passive: true });
    w.addEventListener('pointerdown', show, { once: true, passive: true });

    let idleHandle: ReturnType<typeof window.requestIdleCallback> | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    if ('requestIdleCallback' in w) {
      idleHandle = w.requestIdleCallback(show, { timeout: 8000 });
    } else {
      timeoutHandle = w.setTimeout(show, 5000);
    }

    return () => {
      cancelled = true;
      w.removeEventListener('scroll', show);
      w.removeEventListener('pointerdown', show);
      if (idleHandle !== undefined && 'cancelIdleCallback' in w) {
        w.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return <Chatbot />;
}
