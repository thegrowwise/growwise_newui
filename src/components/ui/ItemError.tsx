"use client";
import React from 'react';

export function ItemError({ title = 'Item unavailable', message = 'This item could not be loaded.' }: { title?: string; message?: string }) {
  return (
    <div className="w-full h-full p-4 rounded-xl border border-red-200 bg-red-50/60 text-red-700 text-sm">
      <div className="font-semibold mb-1">{title}</div>
      <div>{message}</div>
    </div>
  );
}



