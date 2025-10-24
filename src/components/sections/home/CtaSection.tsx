"use client";
import React from 'react';
import { Button } from '../../ui/button';

export function CtaSection({
  title,
  subtitle,
  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,
}: {
  title: string;
  subtitle: string;
  primaryText: string;
  secondaryText: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">{title}</h2>
        <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button onClick={onPrimary} className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" size="lg">
            {primaryText}
          </Button>
          <Button onClick={onSecondary} className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105" size="lg">
            {secondaryText}
          </Button>
        </div>
      </div>
    </section>
  );
}


