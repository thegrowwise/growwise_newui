"use client";

import { Skeleton } from "./skeleton";
import { Card, CardContent } from "./card";

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <section className="relative py-16 px-4 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-[#F16112]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="relative bg-white/20 backdrop-blur-3xl rounded-[40px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.25)] overflow-hidden border border-white/50 ring-1 ring-white/20">
          <div className="relative h-[500px] lg:h-[550px] overflow-hidden">
            <div className="absolute inset-0 flex flex-col lg:flex-row items-center overflow-hidden">
              <div className="flex-1 text-center lg:text-left p-10 lg:p-16 relative z-10 lg:max-w-lg">
                <div className="space-y-6">
                  <Skeleton className="h-12 lg:h-16 w-full bg-white/30" />
                  <Skeleton className="h-6 lg:h-8 w-3/4 bg-white/30" />
                  <Skeleton className="h-4 lg:h-6 w-full bg-white/30" />
                  <Skeleton className="h-4 lg:h-6 w-2/3 bg-white/30" />
                  <Skeleton className="h-12 w-48 bg-white/30 rounded-full" />
                </div>
              </div>
              <div className="flex-1 flex justify-center lg:justify-end items-center p-10 lg:p-16 relative z-10">
                <Skeleton className="w-36 h-36 lg:w-44 lg:h-44 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Statistics Section Skeleton
export function StatisticsSkeleton() {
  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-56 h-56 bg-[#F16112]/18 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Skeleton className="h-12 lg:h-16 w-96 mx-auto mb-6 bg-gray-200" />
          <Skeleton className="h-6 w-80 mx-auto bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="bg-white/30 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 ring-1 ring-white/30">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
                <div className="relative z-10">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6 bg-white/40" />
                  <Skeleton className="h-12 w-24 mx-auto mb-4 bg-white/40" />
                  <Skeleton className="h-6 w-32 mx-auto mb-4 bg-white/40" />
                  <Skeleton className="h-1 w-12 mx-auto bg-white/40 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Popular Courses Skeleton
export function PopularCoursesSkeleton() {
  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Skeleton className="h-12 lg:h-16 w-96 mx-auto mb-6 bg-gray-200" />
          <Skeleton className="h-6 w-80 mx-auto bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-white shadow-xl border-0 rounded-2xl animate-pulse">
              <CardContent className="p-6">
                <div className="text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4 bg-gray-200" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2 bg-gray-200" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4 bg-gray-200" />
                  <Skeleton className="h-10 w-full bg-gray-200 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Skeleton
export function TestimonialsSkeleton() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Skeleton className="h-12 lg:h-16 w-96 mx-auto mb-4 bg-gray-200" />
          <Skeleton className="h-6 w-80 mx-auto bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="bg-white shadow-xl border-0 rounded-2xl animate-pulse">
              <CardContent className="p-6 lg:p-8">
                <div className="text-center">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4 bg-gray-200" />
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4 rounded mr-1 bg-gray-200" />
                    ))}
                  </div>
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full bg-gray-200 rounded" />
                    <Skeleton className="h-4 w-3/4 mx-auto bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="text-left">
                      <Skeleton className="h-4 w-24 mb-1 bg-gray-200 rounded" />
                      <Skeleton className="h-3 w-16 bg-gray-200 rounded" />
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

// Programs Section Skeleton
export function ProgramsSkeleton() {
  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Skeleton className="h-12 lg:h-16 w-96 mx-auto mb-6 bg-gray-200" />
          <Skeleton className="h-6 w-80 mx-auto bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="bg-white/30 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 ring-1 ring-white/30">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6 bg-white/40" />
                  <Skeleton className="h-8 w-48 mx-auto mb-4 bg-white/40" />
                  <Skeleton className="h-6 w-64 mx-auto bg-white/40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, subIndex) => (
                    <div key={subIndex} className="flex items-center space-x-3">
                      <Skeleton className="w-6 h-6 rounded bg-white/40" />
                      <Skeleton className="h-4 flex-1 bg-white/40" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Choose Section Skeleton
export function WhyChooseSkeleton() {
  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Skeleton className="h-12 lg:h-16 w-96 mx-auto mb-6 bg-gray-200" />
          <Skeleton className="h-6 w-80 mx-auto bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-white/30 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 ring-1 ring-white/30">
              <CardContent className="p-8 text-center">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6 bg-white/40" />
                <Skeleton className="h-6 w-32 mx-auto mb-4 bg-white/40" />
                <Skeleton className="h-4 w-full bg-white/40 mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto bg-white/40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Course Card Skeleton
export function CourseCardSkeleton() {
  return (
    <Card className="bg-white shadow-xl border-0 rounded-2xl animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200" />
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-2/3 bg-gray-200" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20 bg-gray-200" />
            <Skeleton className="h-10 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index} className="bg-white shadow-sm border animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-2/3 bg-gray-200" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-6 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Chat Message Skeleton
export function ChatMessageSkeleton() {
  return (
    <div className="flex items-start space-x-3 p-4">
      <Skeleton className="w-8 h-8 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-gray-200" />
        <Skeleton className="h-4 w-1/2 bg-gray-200" />
      </div>
    </div>
  );
}

// Generic Card Skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={`bg-white shadow-sm border animate-pulse ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200" />
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-2/3 bg-gray-200" />
          <Skeleton className="h-10 w-32 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
