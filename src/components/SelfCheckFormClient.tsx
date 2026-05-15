'use client';

import dynamic from 'next/dynamic';

// Loaded client-side only so password-manager extensions (LastPass, 1Password)
// cannot inject DOM nodes before React hydrates and cause a mismatch error.
const SelfCheckForm = dynamic(() => import('./SelfCheckForm'), { ssr: false });

export default function SelfCheckFormClient() {
  return <SelfCheckForm />;
}
