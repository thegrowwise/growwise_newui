'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const Header = dynamic(() => import('@/components/layout/Header/Header'), { ssr: true });
const Footer = dynamic(() => import('@/components/layout/Footer/Footer'), { ssr: true });

export default function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
