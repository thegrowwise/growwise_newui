'use client';

import dynamic from 'next/dynamic';
import { ChatbotErrorBoundary } from './ChatbotErrorBoundary';

const Chatbot = dynamic(() => import('./Chatbot'), {
  ssr: false,
});

/**
 * Defers mounting the chat bundle until the browser is idle (or user scrolls / taps).
 * Keeps homepage main-thread/network work lighter during LCP/TBT-heavy first seconds.
 */
export default function LazyChatbot() {
  return (
    <ChatbotErrorBoundary>
      <Chatbot />
    </ChatbotErrorBoundary>
  );
}
