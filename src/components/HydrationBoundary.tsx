'use client';

import { useEffect, useState } from 'react';

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  suppressHydrationWarning?: boolean;
}

export default function HydrationBoundary({ 
  children, 
  fallback = null, 
  suppressHydrationWarning = true 
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return (
    <div suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </div>
  );
}
