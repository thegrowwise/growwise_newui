import type { ReactNode } from 'react';

// LCP: preload hero image only on home so it's discoverable from HTML immediately (no lazy-load).
const LCP_HERO_URL =
  'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop';

export default function HomeLayout({ children }: { children: ReactNode }) {
  const preloadHref = `/_next/image?url=${encodeURIComponent(LCP_HERO_URL)}&w=1200&q=75`;
  return (
    <>
      <link rel="preload" as="image" href={preloadHref} fetchPriority="high" />
      {children}
    </>
  );
}
