"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const t = useTranslations('errorPages');
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [float, setFloat] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const floatInterval = setInterval(() => setFloat(prev => !prev), 3000);
    return () => clearInterval(floatInterval);
  }, []);

  // Auto-redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements - Using GrowWise Theme Colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1F396D]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F16112]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-[#29335C]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className={`max-w-2xl mx-auto text-center relative z-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Animated 404 Number */}
        <div className={`mb-8 ${float ? 'translate-y-2' : 'translate-y-0'} transition-transform duration-1000`}>
          <div className="text-9xl font-bold bg-gradient-to-r from-[#1F396D] via-[#F16112] to-[#29335C] bg-clip-text text-transparent animate-pulse">
            404
          </div>
        </div>

        {/* Animated Icon */}
        <div className="mb-8 animate-bounce">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#1F396D]/10 to-[#F16112]/10 rounded-full flex items-center justify-center shadow-2xl">
            <svg 
              className="w-16 h-16 text-[#1F396D] animate-pulse"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" 
              />
            </svg>
          </div>
        </div>

        {/* Animated Text Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            {t('notFound.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto animate-fade-in animation-delay-500">
            {t('notFound.description')}
          </p>
        </div>

        {/* Animated Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in animation-delay-1000">
          <Link 
            href="/"
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white font-semibold rounded-xl hover:from-[#29335C] hover:to-[#1F396D] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('notFound.goHome')}
          </Link>
          
          <button 
            onClick={() => router.back()}
            className="group relative inline-flex items-center px-8 py-4 bg-white text-[#1F396D] font-semibold rounded-xl border-2 border-[#1F396D] hover:bg-[#1F396D]/5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('notFound.goBack')}
          </button>
        </div>

        {/* Enhanced Quick Links */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-in animation-delay-1500">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('notFound.quickLinks')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/academic" 
                     className="text-[#1F396D] hover:text-[#F16112] font-medium transition-colors hover:scale-105 transform duration-200"
            >
              {t('notFound.academic')}
            </Link>
            <Link 
              href="/steam" 
                     className="text-[#1F396D] hover:text-[#F16112] font-medium transition-colors hover:scale-105 transform duration-200"
            >
              {t('notFound.steam')}
            </Link>
            <Link 
              href="/programs" 
                     className="text-[#1F396D] hover:text-[#F16112] font-medium transition-colors hover:scale-105 transform duration-200"
            >
              {t('notFound.programs')}
            </Link>
            <Link 
              href="/contact" 
                     className="text-[#1F396D] hover:text-[#F16112] font-medium transition-colors hover:scale-105 transform duration-200"
            >
              {t('notFound.contact')}
            </Link>
          </div>
        </div>

        {/* Floating Help Text */}
        <div className="mt-8 animate-fade-in animation-delay-2000">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('notFound.autoRedirect')}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

