'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, ChevronUp, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Home', href: '#home', active: true },
  { name: 'Academic', href: '#academic', hasDropdown: true },
  { name: 'STEAM', href: '#steam' },
  { name: 'Resources', href: '#resources' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' }
];

const academicCourses = [
  {
    title: 'Math Courses',
    description: 'Master mathematics from basics to advanced',
    icon: '🧮',
    href: '/math-courses'
  },
  {
    title: 'English Courses',
    description: 'Comprehensive English language arts',
    icon: '📚',
    href: '/english-courses'
  }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Header Bar */}
      <div className="bg-[#1F396D] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            {/* Contact Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(925) 456-4606</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>connect@thegrowwise.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="hidden md:flex items-center space-x-4">
              <span>Follow us:</span>
              <div className="flex items-center space-x-2">
                <Link href="#" className="hover:text-[#F16112] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Link>
                <Link href="#" className="hover:text-[#F16112] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Link>
                <Link href="#" className="hover:text-[#F16112] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </Link>
                <Link href="#" className="hover:text-[#F16112] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Address */}
            <div className="hidden lg:flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>4564 Dublin Blvd, Dublin, CA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#1F396D] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm flex flex-col justify-between p-0.5">
                    <div className="w-full h-0.5 bg-[#1F396D] rounded-full"></div>
                    <div className="w-full h-0.5 bg-[#1F396D] rounded-full"></div>
                    <div className="w-full h-0.5 bg-[#1F396D] rounded-full"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#1F396D]">GrowWise</span>
                  <span className="text-xs text-[#F16112] font-medium">UNBOX POTENTIAL</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.name === 'Academic' ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setAcademicDropdownOpen(true)}
                    onMouseLeave={() => setAcademicDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center space-x-1 px-4 py-2 font-medium transition-all duration-300 relative rounded-lg ${
                        academicDropdownOpen 
                          ? 'text-[#F16112] bg-gray-100' 
                          : 'text-gray-700 hover:text-[#F16112] hover:bg-gray-50'
                      }`}
                      onClick={() => setAcademicDropdownOpen(!academicDropdownOpen)}
                    >
                      <span>{item.name}</span>
                      {academicDropdownOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {/* Animated orange line */}
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#F16112] transition-all duration-300 ease-out ${
                      academicDropdownOpen 
                        ? 'w-full opacity-100' 
                        : 'w-0 opacity-0'
                    }`}></div>
                    
                    {/* Dropdown Menu */}
                    {academicDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-6">
                          {/* Header */}
                          <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Academic Programs</h3>
                            <p className="text-sm text-gray-600">Choose your learning path</p>
                          </div>
                          
                          {/* Course Categories */}
                          <div className="space-y-4">
                            {academicCourses.map((course) => (
                              <Link
                                key={course.title}
                                href={course.href}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                              >
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                  {course.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-[#F16112] transition-colors">
                                    {course.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">{course.description}</p>
                                </div>
                                {/* ChevronRight is removed as per new_code */}
                              </Link>
                            ))}
                          </div>
                          
                          {/* Call to Action */}
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              Need help choosing?{' '}
                              <Link href="#contact" className="text-[#F16112] hover:underline font-medium">
                                Contact us
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 px-4 py-2 font-medium transition-all duration-300 relative rounded-lg ${
                        item.active 
                          ? 'bg-[#1F396D] text-white' 
                          : 'text-gray-700 hover:text-[#F16112] hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </Link>
                    {/* Animated orange line for non-active items */}
                    {!item.active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#F16112] transition-all duration-300 ease-out w-0 opacity-0 group-hover:w-full group-hover:opacity-100"></div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Utility Icons and CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Utility Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-[#F16112] transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-700 hover:text-[#F16112] transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-[#1F396D] text-[#1F396D] hover:bg-[#1F396D] hover:text-white rounded-full px-6"
              >
                Log in
              </Button>
              <Button 
                className="bg-[#F16112] hover:bg-[#d54f0a] text-white rounded-full px-6"
              >
                Enroll Now
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-[#F16112]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block font-medium py-2 transition-colors duration-200 ${
                  item.active 
                    ? 'text-[#1F396D]' 
                    : 'text-gray-700 hover:text-[#F16112]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <Button variant="outline" className="w-full border-[#1F396D] text-[#1F396D] hover:bg-[#1F396D] hover:text-white rounded-full">
                Log in
              </Button>
              <Button className="w-full bg-[#F16112] hover:bg-[#d54f0a] text-white rounded-full">
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 