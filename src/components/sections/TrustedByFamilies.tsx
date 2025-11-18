'use client';

import { useState, useEffect } from 'react';
import { Users, BookMarked, ThumbsUp, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Statistics Data
const statisticsData = [
  {
    id: 1,
    value: "325+",
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

// Counter Animation Hook
const useCounterAnimation = (endValue: number, duration: number = 2000) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCurrentValue(Math.floor(easeOutQuart * endValue));

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, endValue, duration]);

  const startAnimation = () => setHasStarted(true);

  return { currentValue, startAnimation };
};

// Animated Statistics Card Component
const StatCard = ({ stat, IconComponent, index, startAnimation }: any) => {
  const numericValue = parseInt(stat.value.replace(/\D/g, ''));
  const { currentValue, startAnimation: startCounter } = useCounterAnimation(numericValue, 2000);

  useEffect(() => {
    if (startAnimation) {
      const timer = setTimeout(() => {
        startCounter();
      }, index * 200);
      return () => clearTimeout(timer);
    }
  }, [startAnimation, startCounter, index]);

  const formatValue = (value: number) => {
    if (stat.value.includes('%')) return `${value}%`;
    if (stat.value.includes('+')) return `${value}+`;
    return value.toString();
  };

  return (
    <Card className="bg-white/80 backdrop-blur-lg rounded-[28px] shadow-[0px_20px_40px_0px_rgba(31,57,109,0.15)] border border-gray-100 hover:shadow-[0px_30px_60px_0px_rgba(31,57,109,0.25)] transition-all duration-700 transform hover:-translate-y-3 group">
      <CardContent className="p-8 text-center">
        {/* Icon with animated background */}
        <div className={`${stat.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
          <IconComponent className={`w-10 h-10 ${stat.color}`} />
        </div>

        {/* Animated Counter */}
        <div className="mb-4">
          <h3 className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>
            {startAnimation ? formatValue(currentValue) : '0'}
          </h3>
          <p className="text-lg font-semibold text-gray-700">{stat.label}</p>
        </div>

        {/* Decorative Element */}
        <div className="w-12 h-1 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full mx-auto opacity-70"></div>
      </CardContent>
    </Card>
  );
};

export default function TrustedByFamilies() {
  const [statsInView, setStatsInView] = useState(false);

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => {
      if (statsElement) {
        observer.unobserve(statsElement);
      }
    };
  }, []);

  return (
    <section id="stats-section" className="py-20 px-4 lg:px-8 relative overflow-hidden">
      {/* Enhanced background with more visible patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#1F396D]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-56 h-56 bg-[#F16112]/12 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-[#F1894F]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-32 h-32 bg-[#1F396D]/8 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trusted by <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Tri-Valley Families</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of families who have chosen GrowWise for their children's educational journey
          </p>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {statisticsData.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <StatCard 
                key={stat.id}
                stat={stat}
                IconComponent={IconComponent}
                index={index}
                startAnimation={statsInView}
              />
            );
          })}
        </div>

        {/* Enhanced Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-lg px-8 py-4 rounded-full shadow-xl border border-white/30">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-700">
              Trusted by 325+ Tri-Valley families
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


