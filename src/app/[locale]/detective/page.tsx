'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DetectivePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/self-check');
  }, [router]);

  return null;
}
