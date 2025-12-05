"use client";
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { SectionError } from '../../ui/SectionError';
import { OptimizedImage } from '../../gw/OptimizedImage';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { StructuredDataScript } from '../../seo/StructuredDataScript';
import { generateReviewSchema, generateAggregateRatingSchema } from '@/lib/seo/structuredData';

export interface TestimonialVM {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string | null;
  initials?: string;
  hasPhoto?: boolean;
}

// Testimonial Card Component with Show More functionality
function TestimonialCard({ testimonial }: { testimonial: TestimonialVM }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const MAX_LENGTH = 250; // Characters to show before "show more" - increased to use more space
  const shouldTruncate = testimonial.content.length > MAX_LENGTH;
  const displayText = isExpanded || !shouldTruncate 
    ? testimonial.content 
    : testimonial.content.substring(0, MAX_LENGTH) + '...';
  
  // Generate initials from name
  const getInitials = () => {
    if (testimonial.initials) return testimonial.initials;
    if (!testimonial.name) return 'A';
    return testimonial.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Determine if we should show photo or initials
  const shouldShowPhoto = (testimonial.hasPhoto !== false && testimonial.image && !imageError);

  return (
    <Card className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30 h-full flex flex-col min-h-[400px]">
      <CardContent className="p-8 relative flex flex-col flex-grow h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
        <div className="relative z-10 flex flex-col flex-grow h-full">
          {/* Rating Stars - Fixed height */}
          <div className="flex items-center gap-1 mb-6 flex-shrink-0">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#F16112] text-[#F16112] drop-shadow-sm flex-shrink-0" />
            ))}
          </div>
          
          {/* Review Text Container - Flexible but constrained */}
          <div className="flex-grow flex flex-col min-h-0">
            <p className={`text-gray-700 italic text-base leading-relaxed mb-4 ${!isExpanded && shouldTruncate ? 'line-clamp-6' : ''}`}>
              "{displayText}"
            </p>
            
            {/* Show More/Less Button - Right after text */}
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#F16112] hover:text-[#F1894F] font-semibold text-sm self-start transition-colors flex-shrink-0 mb-6"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
          
          {/* Author Info - Fixed at bottom */}
          <div className="flex items-center gap-4 mt-auto flex-shrink-0">
            {shouldShowPhoto ? (
              <div className="relative w-14 h-14 flex-shrink-0">
                <img
                  src={testimonial.image!}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover shadow-[0px_8px_20px_rgba(255,255,255,0.4)] border-2 border-white/70 ring-1 ring-white/50"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
                {imageError && (
                  <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#1F396D] flex items-center justify-center shadow-[0px_8px_20px_rgba(255,255,255,0.4)] border-2 border-white/70 ring-1 ring-white/50">
                    <span className="text-white font-bold text-lg">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#1F396D] flex items-center justify-center shadow-[0px_8px_20px_rgba(255,255,255,0.4)] border-2 border-white/70 ring-1 ring-white/50 flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {getInitials()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-base drop-shadow-sm truncate">{testimonial.name}</p>
              <p className="text-sm text-gray-500 truncate">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsSection({ testimonials, error, onRetry }: { testimonials: TestimonialVM[] | null; error?: string | null; onRetry?: () => void }) {
  const [currentSet, setCurrentSet] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  if (error) return <SectionError title="Testimonials unavailable" message={error} onRetry={onRetry} />;
  if (!testimonials || testimonials.length === 0) return <SectionError title="No testimonials yet" message="Check back later." onRetry={onRetry} />;
  
  // Show 3 cards per set in carousel
  const cardsPerSet = 3;
  const totalSets = Math.ceil(testimonials.length / cardsPerSet);
  
  // Handle smooth transitions
  const handleSetChange = (newSet: number) => {
    if (newSet === currentSet) return;
    
    setIsTransitioning(true);
    // Fade out, change content, then fade in
    setTimeout(() => {
      setCurrentSet(newSet);
      // Small delay before fading in to ensure DOM update
      requestAnimationFrame(() => {
        setTimeout(() => setIsTransitioning(false), 10);
      });
    }, 200);
  };

  const nextSet = () => {
    const newSet = (currentSet + 1) % totalSets;
    handleSetChange(newSet);
  };

  const prevSet = () => {
    const newSet = (currentSet - 1 + totalSets) % totalSets;
    handleSetChange(newSet);
  };

  const goToSet = (index: number) => {
    if (index !== currentSet) {
      handleSetChange(index);
    }
  };
  
  // Generate structured data for reviews and aggregate rating
  const structuredData = useMemo(() => {
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

  const getCurrentTestimonials = () => {
    const startIndex = currentSet * cardsPerSet;
    return testimonials.slice(startIndex, startIndex + cardsPerSet);
  };

  // Create a stable key generator based on testimonial content
  // This ensures React doesn't unmount/remount components when navigating
  const getTestimonialKey = (testimonial: TestimonialVM, globalIndex: number) => {
    // Use the global index in the testimonials array as the primary key
    // This ensures the key stays stable across carousel navigation
    return `testimonial-${globalIndex}`;
  };

  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <StructuredDataScript data={structuredData} id="testimonials-structured-data" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Parents Love <span className="text-[#F16112]">GrowWise</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Personalized learning. Real growth. Measurable success — every student, every grade.
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {totalSets > 1 && (
            <>
              <button
                onClick={prevSet}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSet}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Testimonials Grid with smooth transitions */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 lg:px-8 transition-opacity duration-300 items-stretch ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {getCurrentTestimonials().map((t, idx) => {
              const globalIndex = currentSet * cardsPerSet + idx;
              return (
                <TestimonialCard 
                  key={getTestimonialKey(t, globalIndex)} 
                  testimonial={t} 
                />
              );
            })}
          </div>

          {/* Carousel Indicators */}
          {totalSets > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              {Array.from({ length: totalSets }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSet(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSet 
                      ? 'bg-[#F16112] scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial set ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


