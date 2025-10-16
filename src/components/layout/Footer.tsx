'use client';

import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1F396D]/20 via-[#29335C]/15 to-[#1F396D]/20 py-16 px-4 lg:px-8 relative overflow-hidden text-gray-800">
      <div className="absolute top-10 right-20 w-32 h-32 bg-[#F16112]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#F1894F]/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-center bg-contain bg-no-repeat h-[100px] w-[250px]" style={{ backgroundImage: "url('/assets/growwise-logo.png')" }} />
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Dublin's premier K-12 academic support center, serving the Tri-Valley community with excellence.
            </p>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(925) 456-4606</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>connect@thegrowwise.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>4564 Dublin Blvd, Dublin, CA</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-gray-800 text-xl font-bold mb-6">Academic Programs</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/courses/math" className="hover:text-gray-800 transition-colors hover:underline">
                  Math Courses
                </Link>
              </li>
              <li>
                <Link href="/courses/english" className="hover:text-gray-800 transition-colors hover:underline">
                  English Courses
                </Link>
              </li>
              <li><span className="text-gray-500">Grade-Level Math</span></li>
              <li><span className="text-gray-500">Accelerated Math</span></li>
              <li><span className="text-gray-500">SAT/ACT Prep</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-800 text-xl font-bold mb-6">STEAM Programs</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/steam/ml-ai-coding" className="hover:text-gray-800 transition-colors hover:underline">
                  ML/AI Coding
                </Link>
              </li>
              <li>
                <Link href="/steam/game-development" className="hover:text-gray-800 transition-colors hover:underline">
                  Game Development
                </Link>
              </li>
              <li><span className="text-gray-500">Python Programming</span></li>
              <li><span className="text-gray-500">Young Entrepreneurs</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-800 text-xl font-bold mb-6">Resources</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/about-us" className="hover:text-gray-800 transition-colors hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-gray-800 transition-colors hover:underline">
                  Contact Us
                </Link>
              </li>
              <li><span className="text-gray-500">Parent Portal</span></li>
              <li><span className="text-gray-500">Support Center</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 GrowWise. All rights reserved. Serving Dublin, Pleasanton, and the Tri-Valley community.</p>
        </div>
      </div>
    </footer>
  );
}