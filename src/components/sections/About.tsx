'use client';

import { useState, useEffect } from 'react';
import { Users, BookMarked, ThumbsUp, Star, Award, Clock, DollarSign, HeartHandshake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ClientOnly from '@/components/providers/ClientOnly';

// Statistics Data
const statisticsData = [
  {
    id: 1,
    value: "300+",
    label: "Students Enrolled",
    icon: Users,
    color: "text-[#1F396D]",
    bgColor: "bg-[#1F396D]/10"
  },
  {
    id: 2,
    value: "25+",
    label: "Courses Offered",
    icon: BookMarked,
    color: "text-[#F16112]",
    bgColor: "bg-[#F16112]/10"
  },
  {
    id: 3,
    value: "98%",
    label: "Students Satisfaction",
    icon: ThumbsUp,
    color: "text-[#F1894F]",
    bgColor: "bg-[#F1894F]/10"
  }
];

// Why Choose Us Data
const whyChooseUs = [
  {
    id: 1,
    title: "Expert Instructors",
    description: "Learn from certified teachers with years of experience in K-12 and STEAM education.",
    icon: Star,
    color: "text-[#1F396D]",
    bgColor: "bg-[#1F396D]/10"
  },
  {
    id: 2,
    title: "Proven Results",
    description: "95% of our students show measurable improvement within the first semester.",
    icon: Award,
    color: "text-[#F16112]",
    bgColor: "bg-[#F16112]/10"
  },
  {
    id: 3,
    title: "Flexible Scheduling",
    description: "Classes available 7 days a week with morning, afternoon, and evening options.",
    icon: Clock,
    color: "text-[#F1894F]",
    bgColor: "bg-[#F1894F]/10"
  },
  {
    id: 4,
    title: "Affordable Pricing",
    description: "Competitive rates with flexible payment plans and sibling discounts available.",
    icon: DollarSign,
    color: "text-[#1F396D]",
    bgColor: "bg-[#1F396D]/10"
  },
  {
    id: 5,
    title: "Personalized Attention",
    description: "Small class sizes and one-on-one support to ensure every student thrives.",
    icon: HeartHandshake,
    color: "text-[#F16112]",
    bgColor: "bg-[#F16112]/10"
  }
];

// Counter animation hook
const useCounterAnimation = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startAnimation) return;

    const startTime = Date.now();
    const startCount = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentCount = Math.floor(startCount + (endValue - startCount) * progress);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [startAnimation, endValue, duration]);

  return { count, startAnimation };
};

interface StatCardProps {
  stat: {
    id: number;
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  };
  IconComponent: React.ComponentType<{ className?: string }>;
  index: number;
  startAnimation: boolean;
}

const StatCard = ({ stat, IconComponent, index, startAnimation }: StatCardProps) => {
  const { count } = useCounterAnimation(parseInt(stat.value.replace(/\D/g, '')), 2000);

  const formatValue = (value: number) => {
    if (stat.value.includes('+')) return `${value}+`;
    if (stat.value.includes('%')) return `${value}%`;
    return value.toString();
  };

  return (
    <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
      <CardContent className="p-0">
        <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <IconComponent className={`w-8 h-8 ${stat.color}`} />
        </div>
        <div className={`text-3xl font-bold ${stat.color} mb-2`}>
          {startAnimation ? formatValue(count) : '0'}
        </div>
        <p className="text-gray-600 font-medium">{stat.label}</p>
      </CardContent>
    </Card>
  );
};

function StatCardStatic({ stat, IconComponent }: { stat: any; IconComponent: any }) {
  return (
    <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
      <CardContent className="p-0">
        <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <IconComponent className={`w-8 h-8 ${stat.color}`} />
        </div>
        <div className={`text-3xl font-bold ${stat.color} mb-2`}>
          0
        </div>
        <p className="text-gray-600 font-medium">{stat.label}</p>
      </CardContent>
    </Card>
  );
}

export default function About() {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-[#F16112]">GrowWise</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re committed to providing exceptional education that empowers students to reach their full potential
          </p>
        </div>

        {/* Statistics Section */}
        <div id="stats-section" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ClientOnly fallback={
              statisticsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <StatCardStatic
                    key={stat.id}
                    stat={stat}
                    IconComponent={IconComponent}
                  />
                );
              })
            }>
              {statisticsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <StatCard
                    key={stat.id}
                    stat={stat}
                    IconComponent={IconComponent}
                    index={index}
                    startAnimation={startAnimation}
                  />
                );
              })}
            </ClientOnly>
          </div>
        </div>

        {/* Why Choose Us Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
                <CardContent className="p-0">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
} 