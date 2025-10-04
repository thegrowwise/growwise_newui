'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSteamRequested } from '@/store/slices/steamSlice';
import { getIconComponent } from '@/lib/iconMap';

export default function SteamPage() {
  const t = useTranslations('steam');
  const dispatch = useAppDispatch();
  const steamData = useAppSelector((s) => s.steam.data);
  const steamLoading = useAppSelector((s) => s.steam.loading);
  const steamError = useAppSelector((s) => s.steam.error);

  useEffect(() => {
    if (!steamData && !steamLoading) {
      dispatch(fetchSteamRequested());
    }
  }, [steamData, steamLoading, dispatch]);

  if (steamLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F16112]"></div>
      </div>
    );
  }

  if (steamError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading STEAM Programs</h2>
          <p className="text-gray-600">{steamError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Science, Technology, Engineering,<br />
                <span className="text-[#F16112]">Arts & Mathematics</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Prepare for the future with hands-on STEAM education. From coding and robotics to AI and entrepreneurship, our programs empower your child to thrive in a rapidly evolving technological world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                  Explore Programs
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  Book Free Trial
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                {/* Placeholder for the technical lab image */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">Technical Lab Environment</p>
                  <p className="text-gray-400 text-sm">Woman working on laptop in modern lab setting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our STEAM Programs Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our STEAM Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive technology education designed for future innovators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Game Development Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🎮</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Game Development
              </h3>
              <p className="text-gray-600 mb-6">
                Create immersive games and interactive experiences using industry-standard tools
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Visual Coding</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Game Design</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">2D/3D Game Creation</span>
                </li>
              </ul>
              <button className="w-full bg-[#F16112] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center">
                Start Learning
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Python Programming Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#1F396D] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🐍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Python Programming
              </h3>
              <p className="text-gray-600 mb-6">
                Master the world's most popular programming language from basics to advanced
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Python Fundamentals</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Data Structures</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Web Development</span>
                </li>
              </ul>
              <button className="w-full bg-[#1F396D] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center">
                Start Learning
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* AI & Machine Learning Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#1F396D] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI & Machine Learning
              </h3>
              <p className="text-gray-600 mb-6">
                Explore the fascinating world of artificial intelligence and machine learning
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">AI Fundamentals</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Machine Learning Basics</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Data Science</span>
                </li>
              </ul>
              <button className="w-full bg-[#1F396D] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center">
                Start Learning
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Young Entrepreneurs Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Young Entrepreneurs
              </h3>
              <p className="text-gray-600 mb-6">
                Develop business acumen and entrepreneurial skills from a young age
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Business Fundamentals</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Product Development</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Marketing Strategies</span>
                </li>
              </ul>
              <button className="w-full bg-[#F16112] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center">
                Start Learning
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Game Development Mastery Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Game Development <span className="text-[#F16112]">Mastery</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master the art of game creation with industry-standard tools and platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-2xl">R</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Roblox Studio Mastery
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Lua Programming</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">3D Modeling</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Game Publishing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Scratch Game Creation
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Visual Programming</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Animation Basics</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Interactive Stories</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-2xl">U</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Unity Game Engine
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">C# Programming</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">3D Game Design</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Physics Simulation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies & Tools Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Technologies & Tools <span className="text-[#F16112]">We Teach</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master the latest technologies and tools used in the industry
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">Py</span>
              </div>
              <span className="text-gray-700 font-medium">Python</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-yellow-600">JS</span>
              </div>
              <span className="text-gray-700 font-medium">JavaScript</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🐱</span>
              </div>
              <span className="text-gray-700 font-medium">Scratch</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">U</span>
              </div>
              <span className="text-gray-700 font-medium">Unity</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <span className="text-gray-700 font-medium">AI Tools</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="text-gray-700 font-medium">Web Tech</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI & Machine Learning Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI & Machine <span className="text-[#1F396D]">Learning</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the fascinating world of artificial intelligence and machine learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#1F396D] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI Fundamentals
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Neural Networks</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Computer Vision</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Natural Language Processing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#1F396D] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">⚙️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Machine Learning Basics
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Data Analysis</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Algorithm Design</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Model Training</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#1F396D] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Project Engineering
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Robotics Integration</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">IoT Development</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#1F396D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Smart Systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Young Entrepreneurs Program Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Young <span className="text-[#F16112]">Entrepreneurs Program</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Develop business acumen and entrepreneurial skills from a young age
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">👔</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Youth CEO Program
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Business Planning</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Leadership Skills</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Financial Literacy</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                I Am Brand
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Personal Branding</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Marketing Strategies</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#F16112] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Digital Presence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Stories Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Student <span className="text-[#F16112]">Success Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our students are building the future with technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Alex Chen</h4>
                  <p className="text-sm text-gray-600">Grade 8</p>
                  <div className="inline-block bg-[#F16112] text-white px-3 py-1 rounded-full text-xs font-semibold mt-2">
                    Coding
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="font-bold text-gray-900 mb-3 text-base">Created a viral Roblox game with 100K+ players</h5>
                <p className="text-gray-600 italic text-sm">"The STEAM program taught me not just coding, but how to think like a real game developer. Now I'm earning money from my games!"</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1F396D] to-[#29335C] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Grade 10</p>
                  <div className="inline-block bg-[#1F396D] text-white px-3 py-1 rounded-full text-xs font-semibold mt-2">
                    AI & ML
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="font-bold text-gray-900 mb-3 text-base">Built an AI chatbot for her school</h5>
                <p className="text-gray-600 italic text-sm">"Learning Python opened so many doors for me. I never thought I could create something so advanced at my age!"</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Marcus Rodriguez</h4>
                  <p className="text-sm text-gray-600">Grade 9</p>
                  <div className="inline-block bg-[#F16112] text-white px-3 py-1 rounded-full text-xs font-semibold mt-2">
                    Entrepreneurship
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="font-bold text-gray-900 mb-3 text-base">Launched a tech startup at 15</h5>
                <p className="text-gray-600 italic text-sm">"The entrepreneurship program gave me the confidence to start my own business. I'm already making $500/month!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our STEAM Program Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our <span className="text-[#F16112]">STEAM Program?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive technology education designed for future innovators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Future-Ready Skills
              </h3>
              <p className="text-gray-600">
                Learn cutting-edge technologies that will be essential in tomorrow's job market
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Collaborative Learning
              </h3>
              <p className="text-gray-600">
                Work with peers on real-world projects and develop teamwork skills
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Project-Based Learning
              </h3>
              <p className="text-gray-600">
                Build real projects and create a portfolio that showcases your skills
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Industry Recognition
              </h3>
              <p className="text-gray-600">
                Earn certificates and recognition from industry leaders and organizations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">
            {steamData?.cta?.title || t('cta.title')}
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
            {steamData?.cta?.subtitle || t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              {steamData?.cta?.primaryButton || t('cta.primaryCta')}
            </button>
            <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105">
              {steamData?.cta?.secondaryButton || t('cta.secondaryCta')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
