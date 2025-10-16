import { useEffect, useState, useRef } from 'react';

interface UseHydrationOptions {
  fallback?: React.ReactNode;
  suppressHydrationWarning?: boolean;
}

export function useHydration(options: UseHydrationOptions = {}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const hasRendered = useRef(false);

  useEffect(() => {
    setIsClient(true);
    setIsHydrated(true);
    hasRendered.current = true;
  }, []);

  return {
    isHydrated,
    isClient,
    hasRendered: hasRendered.current,
    suppressHydrationWarning: options.suppressHydrationWarning ?? true
  };
}

// More specific hook for touch detection
export function useTouchDetection() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
      setIsTouchDevice(hasTouch && (isSmallScreen || !hasHover));
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  return { isTouchDevice, isClient };
}
