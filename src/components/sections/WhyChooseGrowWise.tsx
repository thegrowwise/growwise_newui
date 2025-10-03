'use client';

import { Users, Award, BookOpen, Microscope } from 'lucide-react';

// Exact copy of the source section's structure and styling
export default function WhyChooseGrowWise() {
  const whyChooseUs = [
    {
      icon: Users,
      title: 'Expert Instructors',
      description:
        'Learn from certified teachers with years of experience in K-12 and STEAM education',
    },
    {
      icon: Award,
      title: 'Proven Results',
      description:
        '95% of our students show measurable improvement within the first semester',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Curriculum',
      description:
        'Aligned with state standards and designed for modern learning needs',
    },
    {
      icon: Microscope,
      title: 'Hands-on Learning',
      description:
        'Interactive labs and projects that make learning engaging and memorable',
    },
  ];

  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-[#1F396D]/5 to-[#F16112]/5"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900">
          Why Choose <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">GrowWise</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-[#1F396D] to-[#29335C] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500 border border-white/20 backdrop-blur-sm">
                <item.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




