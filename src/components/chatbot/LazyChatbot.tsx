'use client';

import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('./Chatbot'), {
  ssr: false,
});

/** Mounts chat immediately so the floating control stays bottom-right on first paint (no scroll/idle delay). */
export default function LazyChatbot() {
  return <Chatbot />;
}
