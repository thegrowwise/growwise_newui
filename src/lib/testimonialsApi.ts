/**
 * Testimonials API service for fetching Google Reviews with fallback to default testimonials
 */

import defaultTestimonials from '@/data/defaultTestimonials.json';

export interface TestimonialVM {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string | null;
  initials?: string;
  hasPhoto?: boolean;
  metadata?: {
    authorUrl?: string;
    reviewTime?: number;
    relativeTime?: string;
    originalRating?: number;
  };
}

export interface TestimonialsResponse {
  success: boolean;
  data: {
    testimonials: TestimonialVM[];
    pagination: {
      total: number;
      limit: number | null;
      offset: number;
      hasMore: boolean;
    };
    cached: boolean;
    fallback?: boolean;
    source?: 'api' | 'default';
  };
  meta: {
    count: number;
    limit: number | null;
    offset: number;
    cached: boolean;
    timestamp: string;
    source?: 'api' | 'default';
  };
}

export interface TestimonialsStats {
  success: boolean;
  data: {
    type: 'redis' | 'memory';
    connected: boolean;
    stats?: any;
    testimonials: {
      cached: boolean;
      count: number;
      ttl: number;
    };
  };
}

class TestimonialsApiService {
  private baseUrl: string;
  private timeout: number;
  private defaultTestimonials: TestimonialVM[];

  constructor() {
    // Use environment variable or default to localhost
    // Try NEXT_PUBLIC_BACKEND_URL first (more common), then NEXT_PUBLIC_API_URL, then localhost
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    this.timeout = 10000; // 10 seconds
    this.defaultTestimonials = defaultTestimonials.testimonials;
  }

  /**
   * Fetch testimonials from the backend API with fallback to default testimonials
   * @param options - Query options
   * @returns Promise<TestimonialsResponse>
   */
  async getTestimonials(options: {
    limit?: number;
    offset?: number;
    forceRefresh?: boolean;
    minRating?: number;
  } = {}): Promise<TestimonialsResponse> {
    const { limit, offset = 0, forceRefresh = false, minRating = 1 } = options;
    
    const params = new URLSearchParams({
      offset: offset.toString(),
      forceRefresh: forceRefresh.toString(),
      minRating: minRating.toString()
    });
    
    // Only add limit parameter if it's specified
    if (limit !== undefined) {
      params.append('limit', limit.toString());
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/testimonials?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if the response indicates an error (even with 200 status)
      if (!data.success && data.error) {
        console.warn('⚠️ Backend API error, using default testimonials:', data.error);
        return this.getDefaultTestimonials(limit || null, offset, minRating);
      }
      
      return data;
    } catch (error) {
      console.warn('⚠️ Backend API unavailable, using default testimonials:', error);
      return this.getDefaultTestimonials(limit || null, offset, minRating);
    }
  }

  /**
   * Get default testimonials from JSON file
   * @param limit - Number of testimonials to return
   * @param offset - Starting index
   * @param minRating - Minimum rating to filter
   * @returns TestimonialsResponse with default data
   */
  private getDefaultTestimonials(limit: number | null, offset: number, minRating: number = 1): TestimonialsResponse {
    // Filter by minimum rating first
    const filteredTestimonials = this.defaultTestimonials.filter(testimonial => testimonial.rating >= minRating);
    
    let paginatedTestimonials;
    if (limit === null) {
      // Return all testimonials if no limit specified
      paginatedTestimonials = filteredTestimonials.slice(offset);
    } else {
      const startIndex = offset;
      const endIndex = startIndex + limit;
      paginatedTestimonials = filteredTestimonials.slice(startIndex, endIndex);
    }
    
    return {
      success: true,
      data: {
        testimonials: paginatedTestimonials,
        pagination: {
          total: filteredTestimonials.length,
          limit,
          offset,
          hasMore: limit === null ? false : (offset + (limit || 0)) < filteredTestimonials.length
        },
        cached: false,
        fallback: true,
        source: 'default'
      },
      meta: {
        count: paginatedTestimonials.length,
        limit,
        offset,
        cached: false,
        timestamp: new Date().toISOString(),
        source: 'default'
      }
    };
  }

  /**
   * Force refresh testimonials from Google API with fallback
   * @returns Promise<TestimonialsResponse>
   */
  async refreshTestimonials(): Promise<TestimonialsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/testimonials/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('⚠️ Backend API unavailable for refresh, using default testimonials:', error);
      return this.getDefaultTestimonials(10, 0);
    }
  }

  /**
   * Get cache statistics with fallback
   * @returns Promise<TestimonialsStats>
   */
  async getCacheStats(): Promise<TestimonialsStats> {
    try {
      const response = await fetch(`${this.baseUrl}/api/testimonials/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('⚠️ Backend API unavailable for stats, returning default stats:', error);
      return {
        success: true,
        data: {
          type: 'memory',
          connected: false,
          stats: {
            keys: 0,
            hits: 0,
            misses: 0,
            ksize: 0,
            vsize: 0
          },
          testimonials: {
            cached: false,
            count: this.defaultTestimonials.length,
            ttl: 0
          }
        }
      };
    }
  }

  /**
   * Check if the backend service is healthy
   * @returns Promise<boolean>
   */
  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      });

      return response.ok;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Get default testimonials directly (for testing or manual use)
   * @returns TestimonialVM[]
   */
  getDefaultTestimonialsData(): TestimonialVM[] {
    return this.defaultTestimonials;
  }
}

// Export singleton instance
export const testimonialsApi = new TestimonialsApiService();

// Export default for convenience
export default testimonialsApi;
