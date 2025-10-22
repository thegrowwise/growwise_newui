'use client';

import { useState, useEffect } from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { testimonialsApi } from '@/lib/testimonialsApi';

export default function TestimonialsDebug() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
  
  const { 
    testimonials, 
    loading, 
    error, 
    source,
    cached,
    fallback 
  } = useTestimonials({
    limit: 3,
    autoRefresh: false
  });

  // Check server status
  useEffect(() => {
    const checkServer = async () => {
      setServerStatus('checking');
      try {
        const isHealthy = await testimonialsApi.isHealthy();
        setServerStatus(isHealthy ? 'online' : 'offline');
      } catch (error) {
        setServerStatus('offline');
      }
    };
    
    checkServer();
  }, []);

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'checking': return 'text-yellow-600';
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
    }
  };

  const getSourceText = () => {
    if (source === 'default') {
      return 'Using default testimonials (server unavailable)';
    } else if (cached) {
      return 'Using cached data from server';
    } else {
      return 'Using live data from Google Reviews';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-lg font-semibold mb-4">🔍 API Debug Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Server Status */}
        <div className="p-4 border rounded">
          <h4 className="font-medium mb-2">Server Status</h4>
          <p className={`font-semibold ${getStatusColor()}`}>
            {serverStatus === 'checking' && '🔄 Checking...'}
            {serverStatus === 'online' && '✅ Server Online'}
            {serverStatus === 'offline' && '❌ Server Offline'}
          </p>
          <p className="text-sm text-gray-600">Backend: {apiUrl}</p>
        </div>

        {/* Data Source */}
        <div className="p-4 border rounded">
          <h4 className="font-medium mb-2">Data Source</h4>
          <p className="font-semibold">
            {source === 'default' && '⚠️ Default Data'}
            {source === 'api' && cached && '📦 Cached Data'}
            {source === 'api' && !cached && '🔄 Live Data'}
          </p>
          <p className="text-sm text-gray-600">{getSourceText()}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800">🔄 Loading testimonials...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">❌ Error: {error}</p>
        </div>
      )}

      {/* Success State */}
      {!loading && !error && testimonials && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">
            ✅ Loaded {testimonials.length} testimonials
            {fallback && ' (using fallback data)'}
          </p>
        </div>
      )}

      {/* Testimonials Preview */}
      {testimonials && testimonials.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Preview (First 2 testimonials):</h4>
          <div className="space-y-2">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                <p><strong>{testimonial.name}</strong> - {testimonial.role}</p>
                <p className="text-gray-600">"{testimonial.content.substring(0, 100)}..."</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
