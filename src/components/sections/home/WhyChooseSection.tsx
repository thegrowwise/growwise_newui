"use client";
import React from 'react';

export interface WhyItemVM { title: string; description: string; IconComponent: React.ComponentType<any> }

export function WhyChooseSection({ items }: { items: WhyItemVM[] }) {
  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-[#1F396D]/8 to-[#F16112]/8 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900">Why Choose <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">GrowWise</span>?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item, idx) => {
            const Icon = item.IconComponent as any;
            return (
              <div key={idx} className="text-center group">
                <div className="bg-gradient-to-br from-[#1F396D] to-[#29335C] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0px_20px_50px_rgba(31,57,109,0.4)] group-hover:scale-110 transition-transform duration-500 border-2 border-white/50 backdrop-blur-2xl ring-1 ring-white/30">
                  <Icon className="w-10 h-10 text-white drop-shadow-sm" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900 drop-shadow-sm">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


