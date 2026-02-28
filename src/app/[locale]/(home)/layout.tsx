import type { ReactNode } from 'react';

// LCP: preload hero image only on home so first paint isn't blocked on other routes
const HERO_IMAGE_PRELOAD =
  'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={HERO_IMAGE_PRELOAD}
        fetchPriority="high"
      />
      {children}
    </>
  );
}
