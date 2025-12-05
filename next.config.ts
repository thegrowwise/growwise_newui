import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: 'images.unsplash.com',
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
  },
};

export default withNextIntl(nextConfig);
