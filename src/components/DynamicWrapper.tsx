'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

interface DynamicWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  ssr?: boolean;
}

// Create a dynamic component that only renders on client
const ClientOnlyComponent = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => <>{children}</>), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
});

export default function DynamicWrapper({ children, fallback, ssr = false }: DynamicWrapperProps) {
  if (ssr) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />}>
      <ClientOnlyComponent>
        {children}
      </ClientOnlyComponent>
    </Suspense>
  );
}
