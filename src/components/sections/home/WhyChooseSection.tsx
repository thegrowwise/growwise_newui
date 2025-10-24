"use client";
import React from 'react';
import { SectionError } from '../../ui/SectionError';

export interface WhyItemVM { title: string; description: string; subtitle?: string; IconComponent: React.ComponentType<any> }

export function WhyChooseSection({ items, error, onRetry }: { items: WhyItemVM[] | null; error?: string | null; onRetry?: () => void }) {
  if (error) return <SectionError title="Why Choose data unavailable" message={error} onRetry={onRetry} />;
  if (!items || items.length === 0) return <SectionError title="No reasons available" message="Please check back later." onRetry={onRetry} />;
  
  return (
    <section className="py-24 px-4 lg:px-8 relative bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Why Choose <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">GrowWise</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover what makes us the preferred choice for quality education and student success
          </p>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {items.map((item, idx) => {
            const Icon = item.IconComponent as any;
            const isEven = idx % 2 === 0;
            const animationDelay = idx * 150;
            
            // Remove numbering from title
            const cleanTitle = item.title.replace(/^\d+️⃣\s*/, '');
            
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 cursor-pointer border overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${animationDelay}ms` }}
              >
                {/* Enhanced Default Background */}
                <div className={`absolute inset-0 ${
                  isEven 
                    ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100' 
                    : 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100'
                }`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/20"></div>
                
                {/* Default Border */}
                <div className={`absolute inset-0 rounded-3xl border-2 ${
                  isEven 
                    ? 'border-blue-200/50' 
                    : 'border-orange-200/50'
                }`}></div>
                
                {/* Enhanced Hover Background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className={`absolute inset-0 ${
                    isEven 
                      ? 'bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200' 
                      : 'bg-gradient-to-br from-orange-100 via-amber-100 to-orange-200'
                  }`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30"></div>
                </div>

                {/* Floating Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F16112]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-float-gentle"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-900 animate-float-gentle animation-delay-500"></div>
                
                {/* Enhanced Icon Container */}
                <div className="flex justify-center mb-8 relative z-10">
                  <div className="relative">
                    {/* Default Outer Glow Ring - No Blur */}
                    <div className={`
                      absolute -inset-2 rounded-3xl opacity-30 group-hover:opacity-100 transition-opacity duration-700
                      ${isEven 
                        ? 'bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-500' 
                        : 'bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500'
                      }
                    `}></div>
                    
                    {/* Enhanced Outer Glow Ring on Hover - No Blur */}
                    <div className={`
                      absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700
                      ${isEven 
                        ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600' 
                        : 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600'
                      }
                    `}></div>
                    
                    {/* Main Icon Container */}
                    <div className={`
                      relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl
                      ${isEven 
                        ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white' 
                        : 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white'
                      }
                      group-hover:scale-110 group-hover:rotate-6 transition-all duration-700
                      group-hover:shadow-2xl border-2 border-white/40
                      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-50 group-hover:before:opacity-100 before:transition-opacity before:duration-700
                      animate-float-gentle
                    `}>
                      <Icon className="w-12 h-12 group-hover:scale-110 transition-transform duration-500 group-hover:animate-bounce-gentle" />
                    </div>
                    
                    {/* Default Floating Particles */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/60 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700 animate-pulse shadow-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/50 rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-900 animate-pulse shadow-md"></div>
                    
                    {/* Enhanced Floating Particles on Hover */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse shadow-lg"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-900 animate-pulse shadow-md"></div>
                    <div className="absolute top-1/2 -right-3 w-2 h-2 bg-white/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="text-center relative z-10">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-gray-800 transition-colors duration-500 group-hover:scale-105">
                    {cleanTitle}
                  </h3>
                  
                  {item.subtitle && (
                    <p className="text-sm font-semibold text-[#F16112] mb-4 group-hover:text-[#F1894F] transition-colors duration-500 group-hover:scale-105">
                      {item.subtitle}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-500 group-hover:scale-105">
                    {item.description}
                  </p>
                </div>

                {/* Default Decorative Elements */}
                <div className="absolute top-6 right-6 w-2 h-2 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-500 animate-pulse shadow-lg"></div>
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                <div className="absolute top-1/2 left-4 w-1 h-1 bg-gray-400 rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
                
                {/* Enhanced Decorative Elements on Hover */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse shadow-lg"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                <div className="absolute top-1/2 left-4 w-1 h-1 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
                
                {/* Enhanced Border */}
                <div className={`absolute inset-0 rounded-3xl border-2 ${
                  isEven 
                    ? 'border-blue-300/30 group-hover:border-blue-400/50' 
                    : 'border-orange-300/30 group-hover:border-orange-400/50'
                } transition-all duration-700`}></div>
                
                {/* Enhanced Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#F16112]/5 via-transparent to-blue-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


