import { useState, useEffect, useCallback } from 'react';
import { testimonialsApi, TestimonialVM, TestimonialsResponse } from '@/lib/testimonialsApi';

interface UseTestimonialsOptions {
  limit?: number;
  offset?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  minRating?: number;
}

interface UseTestimonialsReturn {
  testimonials: TestimonialVM[];
  loading: boolean;
  error: string | null;
  cached: boolean;
  fallback: boolean;
  source: 'api' | 'default';
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  } | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
}

/**
 * Custom hook for managing testimonials data
 */
export function useTestimonials(options: UseTestimonialsOptions = {}): UseTestimonialsReturn {
  const {
    limit = 10,
    offset = 0,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    minRating = 1
  } = options;

  const [testimonials, setTestimonials] = useState<TestimonialVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [source, setSource] = useState<'api' | 'default'>('api');
  const [pagination, setPagination] = useState<{
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  } | null>(null);

  const fetchTestimonials = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const response: TestimonialsResponse = await testimonialsApi.getTestimonials({
        limit,
        offset,
        forceRefresh,
        minRating
      });

      if (response.success && response.data) {
        setTestimonials(response.data.testimonials);
        setCached(response.data.cached);
        setFallback(response.data.fallback || false);
        setSource(response.data.source || 'api');
        setPagination(response.data.pagination);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch testimonials';
      setError(errorMessage);
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, minRating]);

  const refresh = useCallback(async () => {
    await fetchTestimonials(true);
  }, [fetchTestimonials]);

  const loadMore = useCallback(async () => {
    if (!pagination?.hasMore) return;

    try {
      setLoading(true);
      const response: TestimonialsResponse = await testimonialsApi.getTestimonials({
        limit,
        offset: testimonials.length
      });

      if (response.success && response.data) {
        setTestimonials(prev => [...prev, ...response.data.testimonials]);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more testimonials';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit, testimonials.length, pagination?.hasMore]);

  const retry = useCallback(async () => {
    await fetchTestimonials();
  }, [fetchTestimonials]);

  // Initial load
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTestimonials();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    cached,
    fallback,
    source,
    pagination,
    refresh,
    loadMore,
    retry
  };
}

/**
 * Hook for getting a single testimonial by index
 */
export function useTestimonial(index: number, options: UseTestimonialsOptions = {}) {
  const { testimonials, loading, error } = useTestimonials(options);
  
  return {
    testimonial: testimonials[index] || null,
    loading,
    error
  };
}

/**
 * Hook for getting testimonials with infinite scroll
 */
export function useInfiniteTestimonials(options: Omit<UseTestimonialsOptions, 'offset'> = {}) {
  const [allTestimonials, setAllTestimonials] = useState<TestimonialVM[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { testimonials, loading, error, cached, fallback, source, pagination, refresh, retry } = useTestimonials({
    ...options,
    limit: options.limit || 10
  });

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await testimonialsApi.getTestimonials({
        limit: options.limit || 10,
        offset: allTestimonials.length
      });

      if (response.success && response.data) {
        setAllTestimonials(prev => [...prev, ...response.data.testimonials]);
        setHasMore(response.data.pagination.hasMore);
      }
    } catch (err) {
      console.error('Error loading more testimonials:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, allTestimonials.length, options.limit]);

  // Update all testimonials when new data comes in
  useEffect(() => {
    if (testimonials.length > 0) {
      setAllTestimonials(testimonials);
      setHasMore(pagination?.hasMore || false);
    }
  }, [testimonials, pagination]);

  return {
    testimonials: allTestimonials,
    loading,
    error,
    cached,
    fallback,
    source,
    hasMore,
    loadingMore,
    refresh,
    loadMore,
    retry
  };
}
