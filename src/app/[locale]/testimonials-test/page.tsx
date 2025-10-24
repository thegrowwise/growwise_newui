'use client';

import TestimonialsWithBackend from '@/components/sections/TestimonialsWithBackend';
import TestimonialsDebug from '@/components/TestimonialsDebug';

export default function TestimonialsTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Testimonials API Test Page
        </h1>
        <p className="text-center text-gray-600 mb-8">
          This page tests the testimonials API integration with backend fallback.
        </p>
        
        <TestimonialsDebug />
        <TestimonialsWithBackend />
      </div>
    </div>
  );
}
