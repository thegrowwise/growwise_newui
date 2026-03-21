'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Chatbot = dynamic(() => import('./Chatbot'), {
  ssr: false,
  loading: () => null,
});

/**
 * Chatbot is heavy (Radix, forms, icons). Dynamic import alone still evaluates on first paint.
 * Mount after first scroll (engaged user) or idle (max ~6.5s) so Performance / TBT improve.
 */
export default function LazyChatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const onScroll = () => {
      enable();
      window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const useIdle = typeof requestIdleCallback !== 'undefined';
    const idleId = useIdle
      ? requestIdleCallback(enable, { timeout: 6500 })
      : window.setTimeout(enable, 4500);

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', onScroll);
      if (useIdle) cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as ReturnType<typeof setTimeout>);
    };
  }, []);

  if (!ready) return null;
  return <Chatbot />;
}
