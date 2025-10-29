"use client";
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ChevronRight } from 'lucide-react';

export interface ProgramVM {
  id: number;
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  iconColor: string;
  href?: string;
  ctaText?: string;
  ctaUrl?: string;
  IconComponent: React.ComponentType<any>;
  subItems: { name: string; icon: string; description: string }[];
}

export function ProgramsSection({
  k12,
  steam,
}: {
  k12: ProgramVM[];
  steam: ProgramVM[];
}) {
  const locale = useLocale();
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
                {program.subItems.map((item) => {
                  const isMathProgram = program.title.toLowerCase().includes('math');
                  const isEnglishProgram = program.title.toLowerCase().includes('english') || program.title.toLowerCase().includes('ela');
                  const isWritingProgram = program.title.toLowerCase().includes('writing');
                  const isSteamGameProgram = program.title.toLowerCase().includes('game development');
                  const isSteamPythonProgram = program.title.toLowerCase().includes('python programming');
                  const nameLower = item.name.toLowerCase();
                  let gradeParam = nameLower.includes('elementary')
                    ? 'Elementary'
                    : nameLower.includes('middle')
                    ? 'Middle School'
                    : nameLower.includes('high')
                    ? 'High School'
                    : null;
                  if (isSteamPythonProgram && nameLower.includes('kickstart')) {
                    gradeParam = 'Elementary';
                  }
                  const alignmentParam = nameLower.includes('dusd') ? 'DUSD Aligned' : null;
                  const levelParam = (isSteamGameProgram
                    ? (nameLower.includes('roblox')
                      ? 'Beginner to Intermediate'
                      : nameLower.includes('scratch')
                      ? 'Beginner'
                      : nameLower.includes('minecraft')
                      ? 'Intermediate'
                      : null)
                    : null) || (isSteamPythonProgram
                    ? (nameLower.includes('power') && nameLower.includes('up')
                      ? 'Beginner to Advanced'
                      : nameLower.includes('pro')
                      ? 'Intermediate to Advanced'
                      : null)
                    : null);
                  const courseTypeParam = nameLower.includes('mastery') 
                    ? 'Comprehensive'
                    : nameLower.includes('reading') && nameLower.includes('enrichment')
                    ? 'Core English'
                    : nameLower.includes('grammar') && nameLower.includes('boost')
                    ? 'Grammar'
                    : nameLower.includes('creative') && nameLower.includes('writing')
                    ? 'Creative Writing'
                    : nameLower.includes('essay') && nameLower.includes('writing')
                    ? 'Essay Writing'
                    : nameLower.includes('foundations') && nameLower.includes('writing')
                    ? 'Creative Writing'
                    : (isSteamGameProgram && nameLower.includes('robot'))
                    ? 'Robotics'
                    : null;
                  const isLinked = (isMathProgram && (!!gradeParam || !!alignmentParam)) || 
                    (isEnglishProgram && !!courseTypeParam) ||
                    (isWritingProgram && !!courseTypeParam) ||
                    (isSteamGameProgram && (!!levelParam || !!courseTypeParam)) ||
                    (isSteamPythonProgram && (!!gradeParam || !!levelParam || !!courseTypeParam));
                  const query = alignmentParam
                    ? `alignment=${encodeURIComponent(alignmentParam)}`
                    : gradeParam
                    ? `grade=${encodeURIComponent(gradeParam)}`
                    : courseTypeParam
                    ? `type=${encodeURIComponent(courseTypeParam)}`
                    : levelParam
                    ? `level=${encodeURIComponent(levelParam)}`
                    : '';
                  const href = isMathProgram 
                    ? `/${locale}/courses/math${query ? `?${query}` : ''}#courses`
                    : (isEnglishProgram || isWritingProgram)
                    ? `/${locale}/courses/english${query ? `?${query}` : ''}#courses`
                    : isSteamGameProgram
                    ? `/${locale}/steam/game-development${query ? `?${query}` : ''}#courses`
                    : isSteamPythonProgram
                    ? `/${locale}/steam/ml-ai-coding${query ? `?${query}` : ''}#courses`
                    : '';
                  const content = (
                    <div className={`flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-2xl border-2 border-white/70 transition-all duration-500 hover:bg-white/70 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.5)] ring-1 ring-white/40 ${isLinked ? 'cursor-pointer hover:scale-105' : ''}`}>
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                      {isLinked && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                  </div>
                  );
                  return isLinked ? (
                    <Link key={item.name} href={href} prefetch>
                      {content}
                    </Link>
                  ) : (
                    <div key={item.name}>{content}</div>
                  );
                })}
              </div>
              <div className="mt-8 pt-6">
                {program.ctaUrl ? (
                  <Button asChild className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform backdrop-blur-sm border border-white/20`}>
                    <Link href={program.ctaUrl}>{program.ctaText || 'Enroll Now'}</Link>
                  </Button>
                ) : program.href ? (
                  <Button asChild className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform backdrop-blur-sm border border-white/20`}>
                    <Link href={program.href}>{program.ctaText || 'Enroll Now'}</Link>
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.location.href = '/enroll'}
                    className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform backdrop-blur-sm border border-white/20`}
                  >
                    {program.ctaText || 'Enroll Now'}
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


