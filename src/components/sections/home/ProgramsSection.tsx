"use client";
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { SectionError } from '../../ui/SectionError';
import { ItemError } from '../../ui/ItemError';
import Link from 'next/link';

export interface ProgramVM {
  id: number;
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  iconColor: string;
  href?: string;
  IconComponent: React.ComponentType<any>;
  subItems: { name: string; icon: string; description: string }[];
}

export function ProgramsSection({
  k12,
  steam,
  error,
  onRetry,
}: {
  k12: ProgramVM[] | null;
  steam: ProgramVM[] | null;
  error?: string | null;
  onRetry?: () => void;
}) {
  if (error) return <SectionError title="Programs unavailable" message={error} onRetry={onRetry} />;
  if (!k12 || !steam) return <SectionError title="Programs not loaded" message="Please try again shortly." onRetry={onRetry} />;
  const ProgramGrid = ({ items, accent }: { items: ProgramVM[]; accent: 'blue' | 'orange' }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((program) => {
        const Icon = program.IconComponent as any;
        return (
          <Card key={program.id} className={`bg-white/35 backdrop-blur-3xl rounded-[32px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 transition-all duration-700 cursor-pointer group overflow-hidden relative ring-1 ring-white/30`}>
            <div className={`absolute inset-0 ${program.bgGradient} opacity-40`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
            <CardContent className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${program.gradient} shadow-[0px_15px_40px_rgba(31,57,109,0.4)] ring-2 ring-white/50 backdrop-blur-sm`}>
                  <Icon className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-xl ${program.iconColor} drop-shadow-sm`}>{program.title}</h4>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">{program.description}</p>
              <div className="space-y-4 flex-1">
                {program.subItems?.length ? program.subItems.map((item) => (
                  <div key={item.name} className={`flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-2xl border-2 border-white/70 transition-all duration-500 hover:bg-white/70 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.5)] ring-1 ring-white/40`}>
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                )) : <ItemError title="No items" message="No sub-programs available." />}
              </div>
              <div className="mt-8 pt-6">
                {program.href ? (
                  <Button asChild className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform backdrop-blur-sm border border-white/20`}>
                    <Link href={program.href}>Enroll Now</Link>
                  </Button>
                ) : (
                  <Button className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform backdrop-blur-sm border border-white/20`}>
                    Enroll Now
                  </Button>
                )}
              </div>
              <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${program.gradient} rounded-full opacity-10`} />
              <div className={`absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br ${program.gradient} rounded-full opacity-5`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#1F396D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-[#F16112]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Our <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Programs</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">Comprehensive educational solutions designed to help students excel</p>
        </div>
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">K-12 Academic Programs</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#1F396D]/30 via-[#F16112]/20 to-transparent"></div>
          </div>
          <ProgramGrid items={k12} accent="blue" />
        </div>
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">STEAM Programs</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F16112]/30 via-[#1F396D]/20 to-transparent"></div>
          </div>
          <ProgramGrid items={steam} accent="orange" />
        </div>
      </div>
    </section>
  );
}


