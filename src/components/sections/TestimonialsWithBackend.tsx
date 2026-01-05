'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ClientOnly from '@/components/providers/ClientOnly';
import { useTestimonials } from '@/hooks/useTestimonials';
import { TestimonialVM } from '@/lib/testimonialsApi';
import { StructuredDataScript } from '@/components/seo/StructuredDataScript';
import { generateReviewSchema, generateAggregateRatingSchema } from '@/lib/seo/structuredData';
import { OptimizedImage } from '@/components/gw/OptimizedImage';

export default function TestimonialsWithBackend() {
  const [currentSet, setCurrentSet] = useState(0);
  const { 
    testimonials, 
    loading, 
    error, 
    cached, 
    fallback, 
    source,
    pagination, 
    refresh, 
    retry 
  } = useTestimonials({
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    minRating: 1 // Show all reviews
  });

  // Generate structured data for reviews and aggregate rating
  const structuredData = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return []
    
    const reviews = testimonials.map((testimonial) =>
      generateReviewSchema({
        itemReviewed: {
          "@type": "EducationalOrganization",
          name: "GrowWise"
        },
        reviewRating: {
          ratingValue: testimonial.rating,
        },
        author: {
          name: testimonial.name,
          type: "Person"
        },
        reviewBody: testimonial.content,
      })
    )

    // Calculate average rating
    const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

    const aggregateRating = generateAggregateRatingSchema({
      itemReviewed: {
        "@type": "EducationalOrganization",
        name: "GrowWise"
      },
      ratingValue: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      reviewCount: testimonials.length,
    })

    return [...reviews, aggregateRating]
  }, [testimonials])

  // Show 3 cards per set in slider
  const cardsPerSet = 3;
  const totalSets = Math.ceil((testimonials?.length || 0) / cardsPerSet);

  const nextSet = () => {
    setCurrentSet((prev) => (prev + 1) % totalSets);
  };

  const prevSet = () => {
    setCurrentSet((prev) => (prev - 1 + totalSets) % totalSets);
  };

  const goToSet = (index: number) => {
    setCurrentSet(index);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentSet * cardsPerSet;
    return testimonials?.slice(startIndex, startIndex + cardsPerSet) || [];
  };

  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('Failed to refresh testimonials:', error);
    }
  };

  const handleRetry = async () => {
    try {
      await retry();
    } catch (error) {
      console.error('Failed to retry testimonials:', error);
    }
  };

  // Loading state
  if (loading && !testimonials?.length) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Parents Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading testimonials from Google Reviews...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-white shadow-xl border-0 rounded-2xl animate-pulse">
                <CardContent className="p-6 lg:p-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
                      ))}
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="text-left">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !testimonials?.length) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Parents Say
            </h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="text-lg text-red-600">
                Unable to load high-rated testimonials from Google Reviews
              </p>
            </div>
            <Button 
              onClick={handleRetry}
              className="bg-[#1F396D] hover:bg-[#1F396D]/90 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // No testimonials state
  if (!testimonials?.length) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Parents Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unable to fetch reviews at the moment. Please check back later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      {structuredData.length > 0 && (
        <StructuredDataScript data={structuredData} id="testimonials-backend-structured-data" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            What Parents Say
          </h2>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from families who have experienced the GrowWise difference
          </p>
          
          {/* Cache status indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            {source === 'default' && (
              <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                ⚠️ Using default testimonials (Google Reviews unavailable)
              </span>
            )}
            {source === 'api' && cached && (
              <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                📦 Cached data from Google Reviews
                {fallback && <span className="text-orange-500">(fallback)</span>}
              </span>
            )}
            {source === 'api' && !cached && (
              <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                🔄 Live data from Google Reviews
              </span>
            )}
            {pagination && source === 'api' && (
              <span className="text-gray-600">• {pagination.total} reviews</span>
            )}
          </div>
        </div>

        {/* Testimonials Slider */}
        <ClientOnly fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
            {getCurrentTestimonials().map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        }>
          <div className="relative">
            {/* Navigation Arrows */}
            {totalSets > 1 && (
              <>
                <button
                  onClick={prevSet}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextSet}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
              {getCurrentTestimonials().map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>

            {/* Carousel Indicators */}
            {totalSets > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSets }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSet(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSet 
                        ? 'bg-[#1F396D] scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </ClientOnly>
      </div>
    </section>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: TestimonialVM }) {
  return (
    <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 rounded-2xl">
      <CardContent className="p-6 lg:p-8">
        <div className="text-center">
          {/* Quote Icon */}
          <div className="w-12 h-12 bg-[#1F396D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Quote className="w-6 h-6 text-[#1F396D]" />
          </div>

          {/* Rating */}
          <div className="flex justify-center mb-4">
            {[...Array(testimonial.rating)].map((_, index) => (
              <Star key={index} className="w-4 h-4 text-[#F16112] fill-current" />
            ))}
          </div>

          {/* Testimonial Content */}
          <blockquote className="text-sm lg:text-base text-gray-700 leading-relaxed mb-6 italic line-clamp-4">
            &ldquo;{testimonial.content}&rdquo;
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center justify-center gap-3">
            {(testimonial.hasPhoto !== false && testimonial.image) ? (
              <OptimizedImage
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#1F396D] flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">
                <span className="text-white font-bold text-base">
                  {testimonial.initials || (testimonial.name ? testimonial.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) : 'A')}
                </span>
              </div>
            )}
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-sm">
                {testimonial.name}
              </h4>
              <p className="text-gray-600 text-xs">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
