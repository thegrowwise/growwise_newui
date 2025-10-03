"use client";
import React from 'react';

export function SectionError({ title = 'Unable to load content', message = 'Something went wrong. Please try again.', onRetry }: { title?: string; message?: string; onRetry?: () => void }) {
  return (
    <div className="w-full py-16 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full text-center bg-white/70 backdrop-blur-md border border-red-200 rounded-2xl p-8 shadow-sm">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-red-50 text-red-600">!
        </div>
        <h3 className="text-xl font-bold text-red-700 mb-2">{title}</h3>
        <p className="text-sm text-red-600 mb-6">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}


