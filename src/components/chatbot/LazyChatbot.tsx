'use client';

import dynamic from 'next/dynamic';

// Lazy load Chatbot component for better initial page load
// This wrapper is needed because ssr: false is not allowed in Server Components
const Chatbot = dynamic(() => import('./Chatbot'), {
  ssr: false, // Chatbot doesn't need SSR
  loading: () => null, // Don't show loading indicator
});

export default Chatbot;

