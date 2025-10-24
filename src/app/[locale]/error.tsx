"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('errorPages');
  const router = useRouter();
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const pulseInterval = setInterval(() => setPulse(prev => !prev), 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    // Log error details for debugging
    console.error('Application error:', error);
    
    // Set user-friendly error message
    if (error.message) {
      setErrorDetails(error.message);
    }
  }, [error]);

  const handleRetry = () => {
    reset();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements - Using GrowWise Theme Colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1F396D]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F16112]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-[#29335C]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className={`max-w-2xl mx-auto text-center relative z-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Animated Error Icon */}
        <div className={`mb-8 ${pulse ? 'scale-110' : 'scale-100'} transition-transform duration-1000`}>
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#1F396D]/10 to-[#F16112]/10 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <svg 
              className={`w-16 h-16 text-[#F16112] ${pulse ? 'animate-pulse' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Animated Text Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent animate-pulse">
            {t('error.title')}
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 animate-fade-in">
            {t('error.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto animate-fade-in animation-delay-500">
            {t('error.description')}
          </p>
        </div>
        
        {errorDetails && (
          <div className="bg-[#F16112]/5 border-l-4 border-[#F16112] p-4 mb-8 max-w-md mx-auto rounded-r-lg animate-slide-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#F16112]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-[#1F396D] font-medium">{t('error.details')}:</p>
                <p className="text-sm text-gray-600">{errorDetails}</p>
              </div>
            </div>
          </div>
        )}

        {/* Animated Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in animation-delay-1000">
          <button 
            onClick={handleRetry}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#F16112] to-[#d54f0a] text-white font-semibold rounded-xl hover:from-[#d54f0a] hover:to-[#c4450a] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('error.tryAgain')}
          </button>
          
          <button 
            onClick={handleGoHome}
            className="group relative inline-flex items-center px-8 py-4 bg-white text-[#1F396D] font-semibold rounded-xl border-2 border-[#1F396D] hover:bg-[#1F396D]/5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('error.goHome')}
          </button>
        </div>

        {/* Enhanced Help Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-in animation-delay-1500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('error.needHelp')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/contact" 
                     className="text-[#1F396D] hover:text-[#F16112] font-medium transition-colors hover:scale-105 transform duration-200"
            >
              {t('error.contactSupport')}
            </Link>
            <Link 
              href="/about" 
                     className="text-[#1F396D] hover:text-[#F16112] font-medium transition-colors hover:scale-105 transform duration-200"
            >
              {t('error.learnMore')}
            </Link>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {t('error.technicalInfo')}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>

        {/* Floating Help Text */}
        <div className="mt-8 animate-fade-in animation-delay-2000">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('error.autoRedirect')}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
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
