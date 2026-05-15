'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function ErrorBanner({ message }: { message: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start gap-3">
      <p className="flex-1 text-sm text-amber-900 font-medium">{message}</p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="flex-shrink-0 text-amber-600 hover:text-amber-900 transition-colors mt-0.5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
