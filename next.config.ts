import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    // Smaller bundles + less parse time in prod (Lighthouse "Minify JS" is largely third-party;
    // this trims our code and drops noisy logs.)
    removeConsole: isProd ? { exclude: ['error', 'warn'] } : false,
  },
  // Ensure these ESM packages are transpiled and bundled by Next.js
  transpilePackages: [
    'next-intl',
    '@formatjs/icu-messageformat-parser',
    '@formatjs/icu-skeleton-parser',
    '@formatjs/ecma402-abstract',
    '@formatjs/intl-localematcher',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Performance optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'thegrowwise.com',
      },
      {
        protocol: 'https',
        hostname: 'growwiseschool.org',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Use modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Include 70 for summer hero / program cards; 75 default; 85 where explicitly requested.
    qualities: [70, 75, 85],
    // Short TTL in dev; longer in prod so repeat views hit the image optimizer cache more often.
    minimumCacheTTL: isProd ? 86_400 : 60,
  },
  
  // Experimental features for better performance
  experimental: {
    // Dev-only: avoid distDir lockfile acquisition (can ETIMEDOUT on iCloud/synced or slow disks).
    // Production builds keep the default lock behavior via NODE_ENV.
    ...(process.env.NODE_ENV === 'development' ? { lockDistDir: false as const } : {}),
    // Smaller dev graphs for Webpack + Turbopack (tree-shake barrel imports)
    optimizePackageImports: [
      'lucide-react',
      'next-intl',
      'recharts',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-visually-hidden',
    ],
  },
  
  // Headers for caching and security
  async headers() {
    /** Camp guide PDF — inline in browser (avoid attachment download). */
    const campGuidePdf = [
      {
        source: '/assets/camps/SummerCampBrochure.pdf',
        headers: [
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline' },
        ],
      },
    ];

    const security = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];

    // Long immutable cache breaks Next dev HMR for /_next/static; apply only in production.
    if (!isProd) {
      return [...campGuidePdf, ...security];
    }

    return [
      ...campGuidePdf,
      ...security,
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Legacy `/camp/*` SEO landings → `/camps/*` (canonical namespace aligns with /camps/summer, /camps/winter).
  // `/en/camp/*` listed before `/en/:path*` so one redirect hop to `/camps/*`.
  async redirects() {
    return [
      { source: '/camp', destination: '/camps/summer', permanent: true },
      { source: '/camp/:slug', destination: '/camps/:slug', permanent: true },
      { source: '/en/camp', destination: '/camps/summer', permanent: true },
      { source: '/en/camp/:slug', destination: '/camps/:slug', permanent: true },
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
