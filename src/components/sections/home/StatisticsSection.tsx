"use client";
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { SectionError } from '../../ui/SectionError';

export interface StatVM {
  id: number;
  value: string;
  label: string;
  color: string;
  bgColor: string;
  IconComponent: React.ComponentType<any>;
}

export function StatisticsSection({ title, subtitle, stats, error, onRetry }: { title: React.ReactNode; subtitle: string; stats: StatVM[] | null; error?: string | null; onRetry?: () => void }) {
  if (error) return <SectionError title="Statistics unavailable" message={error} onRetry={onRetry} />;
  if (!stats || stats.length === 0) return <SectionError title="No statistics" message="Please check back later." onRetry={onRetry} />;
  return (
    <section id="stats-section" className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 backdrop-blur-[0.5px]"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-56 h-56 bg-[#F16112]/18 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-[#F1894F]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-32 h-32 bg-[#1F396D]/12 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#F1894F]/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '8s' }}></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, index) => {
            const Icon = stat.IconComponent as any;
            return (
              <Card key={stat.id} className="bg-white/30 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-700 transform hover:-translate-y-3 group ring-1 ring-white/30 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
                  <div className={`${stat.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0px_10px_30px_rgba(255,255,255,0.3)] backdrop-blur-xl border-2 border-white/40 ring-1 ring-white/20 relative z-10`}>
                    <Icon className={`w-10 h-10 ${stat.color} drop-shadow-sm`} />
                  </div>
                  <div className="mb-4">
                    <h3 className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</h3>
                    <p className="text-lg font-semibold text-gray-700">{stat.label}</p>
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full mx-auto opacity-70"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}


