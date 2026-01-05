'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Star, ShoppingCart, Eye, ChevronRight } from "lucide-react";
import { useTouchDetection } from '@/hooks/useHydration';
import DynamicWrapper from './DynamicWrapper';

interface CourseCardProps {
  course: any;
  onAddToCart: (course: any) => void;
  getCourseGradients: (course: any) => any;
  getChipColor: (value: string, type: 'grade' | 'courseType' | 'alignment') => string;
  getChipIcon: (value: string, type: 'grade' | 'courseType' | 'alignment') => string;
}

export default function CourseCard({ 
  course, 
  onAddToCart, 
  getCourseGradients, 
  getChipColor, 
  getChipIcon 
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isTouchDevice } = useTouchDetection();
  const courseGradients = getCourseGradients(course);

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsHovered(false);
    }
  };

  return (
    <div
      className={`relative h-[420px] cursor-pointer group ${!isTouchDevice ? 'perspective-1000' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`relative w-full h-full transition-transform duration-700 ${
        !isTouchDevice ? 'transform-style-preserve-3d' : ''
      } ${
        !isTouchDevice && isHovered ? 'rotate-y-180' : ''
      }`}>
        
        {/* Front Side */}
        <Card className={`absolute inset-0 w-full h-full ${courseGradients.bgGradient} rounded-[24px] overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)] border-2 border-white/50 hover:border-gray-200 ${!isTouchDevice ? 'backface-hidden' : ''} transition-all duration-300`}>
          <CardContent className="p-5 relative flex flex-col h-full justify-between">
            {/* Course Header */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${courseGradients.gradient} shadow-lg`}>
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-base ${courseGradients.iconColor} leading-tight`}>
                    {course.name}
                  </h4>
                  <Badge className="bg-white/80 text-gray-700 text-xs mt-1">
                    {course.level}
                  </Badge>
                </div>
                {!isTouchDevice && (
                  <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Course Description */}
            <div className="flex-grow">
              <p className="text-gray-600 text-sm mb-1 leading-snug line-clamp-1">
                {course.description}
              </p>
              
              {/* Course Tags */}
              <div className="mb-2 space-y-1">
                <div className="flex flex-wrap gap-1">
                  {course.gradeLevel.map((grade: string) => (
                    <span
                      key={grade}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getChipColor(grade, 'grade')}`}
                    >
                      <span>{getChipIcon(grade, 'grade')}</span>
                      {grade}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {course.alignment.map((align: string) => (
                    <span
                      key={align}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getChipColor(align, 'alignment')}`}
                    >
                      <span>{getChipIcon(align, 'alignment')}</span>
                      {align}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Rating */}
              <div className="mb-3 p-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">💰</span>
                    <span className="font-bold text-lg text-[#1F396D]">{course.priceRange}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F1894F] text-[#F1894F]" />
                    <span className="text-sm font-semibold text-gray-700">4.9</span>
                  </div>
                </div>
              </div>

              {/* Interaction Hint */}
              {!isTouchDevice && (
                <div className="mb-3 p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:border-blue-200 transition-all duration-300">
                  <div className="flex items-center gap-2 text-gray-600 group-hover:text-blue-600">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Hover to flip card</span>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Button 
                onClick={() => onAddToCart(course)}
                className={`w-full bg-gradient-to-r ${courseGradients.gradient} text-white rounded-xl py-2.5 text-sm transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105`}
              >
                {/* Desktop button text - Only for non-touch devices */}
                {!isTouchDevice && (
                  <div className="flex items-center justify-center">
                    <Eye className="mr-2 w-4 h-4" />
                    Hover to reveal information
                  </div>
                )}
                {/* Mobile button text or fallback for touch devices */}
                <div className={`${!isTouchDevice ? 'hidden' : 'flex'} items-center justify-center`}>
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Add to Cart
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back Side - Only for non-touch devices */}
        <DynamicWrapper ssr={false}>
          {!isTouchDevice && (
            <Card className={`absolute inset-0 w-full h-full ${courseGradients.bgGradient} rounded-[24px] overflow-hidden shadow-[0px_16px_32px_0px_rgba(0,0,0,0.15)] border-2 ${courseGradients.hoverBorder} backface-hidden rotate-y-180`}>
              <CardContent className="p-4 relative flex flex-col h-full justify-between overflow-hidden">
                {/* Back side content */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${courseGradients.gradient} shadow-lg`}>
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-sm ${courseGradients.iconColor} leading-tight truncate`}>
                        {course.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className="bg-white/80 text-gray-700 text-xs">{course.level}</Badge>
                        <Badge className="bg-white/80 text-gray-700 text-xs">{course.duration}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex-grow overflow-hidden">
                  <p className="text-gray-600 text-xs mb-2 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="mb-2 p-2 bg-white/70 backdrop-blur-sm border border-white/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-[#1F396D]">{course.priceRange}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#F1894F] text-[#F1894F]" />
                        <span className="text-xs text-gray-600">4.9/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {course.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                      <div 
                        key={featureIndex}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50"
                      >
                        <span className="text-sm">✅</span>
                        <p className="font-semibold text-gray-800 text-xs truncate">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex-shrink-0 mt-2">
                  <Button 
                    onClick={() => onAddToCart(course)}
                    className={`w-full bg-gradient-to-r ${courseGradients.gradient} hover:shadow-lg text-white rounded-xl py-2 text-xs transition-all duration-300 transform scale-105 shadow-lg`}
                  >
                    <ShoppingCart className="mr-1 w-3 h-3" />
                    Add to Cart • {course.priceRange}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </DynamicWrapper>
      </div>
    </div>
  );
}
