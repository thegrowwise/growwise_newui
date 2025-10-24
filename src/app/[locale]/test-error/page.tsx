"use client";

import { useEffect } from 'react';

export default function TestErrorPage() {
  useEffect(() => {
    // This will trigger the error boundary
    throw new Error('Test error for error page');
  }, []);

  return <div>This should not render</div>;
}

