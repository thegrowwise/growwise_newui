"use client";
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';

export interface PopularCourseVM {
  id: number;
  name: string;
  benefit: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  cta: string;
  IconComponent: React.ComponentType<any>;
  onClick: () => void;
}

export function PopularCoursesSection({ courses }: { courses: PopularCourseVM[] }) {
  return (
    <section className="relative -mt-24 px-4 lg:px-8 pb-20">
      <div className="max-w-5xl mx-auto relative z-20">
        <Card className="bg-white/25 backdrop-blur-3xl rounded-[32px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.25)] border-2 border-white/60 overflow-hidden ring-1 ring-white/30">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/8 via-transparent to-[#F16112]/8"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"></div>
          <CardContent className="p-8 lg:p-12 relative z-10">
            <div className="mb-10 text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">Popular Courses</h3>
              <p className="text-gray-600">Start your learning journey with our most sought-after programs</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => {
                const Icon = course.IconComponent as any;
                const isBlue = course.iconColor.includes('#1F396D');
                return (
                  <Card key={course.id} className={`bg-white/40 backdrop-blur-2xl border-2 ${course.borderColor} rounded-2xl shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40`} onClick={course.onClick}>
                    <div className={`absolute inset-0 ${course.bgColor} opacity-60`}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
                    <CardContent className="p-6 text-center flex flex-col items-center relative z-10">
                      <div className={`${course.iconColor} mb-4 flex justify-center`}> 
                        <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-[0px_10px_30px_rgba(255,255,255,0.4)] border-2 border-white/60 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/30">
                          <Icon className="w-7 h-7 drop-shadow-sm" />
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 mb-2 leading-tight text-center group-hover:text-gray-800 transition-colors">{course.name}</h4>
                      <p className="text-xs text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">{course.benefit}</p>
                      <Button className={`w-full ${isBlue ? 'bg-gradient-to-r from-[#1F396D] to-[#29335C] hover:from-[#29335C] hover:to-[#1F396D]' : 'bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112]'} text-white rounded-xl py-2.5 px-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-xs backdrop-blur-sm border border-white/20`}>{course.cta}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="flex justify-center mt-8">
              <div className="h-2 w-8 bg-gradient-to-r from-[#1F396D] to-[#F16112] rounded-full shadow-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


