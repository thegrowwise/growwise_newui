'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Search, ShoppingCart, Calculator, BookOpen, Brain, Gamepad2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/gw/CartContext';

const navigation = [
  { name: 'Home', href: '/', active: true },
  { name: 'Academic', href: '/academic', hasDropdown: true },
  { name: 'STEAM', href: '/steam', hasDropdown: true }, 
  { name: 'Resources', href: '#' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Contact Us', href: '/contact-us' }
];

const academicItems = [
  {
    title: 'Math Courses',
    description: 'Master mathematics from basics to advanced',
    icon: Calculator,
    href: '/courses/math',
    gradient: 'from-[#1F396D] to-[#29335C]'
  },
  {
    title: 'English Courses',
    description: 'Comprehensive English language arts',
    icon: BookOpen,
    href: '/courses/english',
    gradient: 'from-[#F16112] to-[#F1894F]'
  }
];

const steamItems = [
  {
    title: 'ML/AI Coding',
    description: 'Explore artificial intelligence and machine learning',
    icon: Brain,
    href: '/steam/ml-ai-coding',
    gradient: 'from-[#1F396D] to-[#F16112]'
  },
  {
    title: 'Game Development',
    description: 'Create games with Roblox, Scratch, and Unity',
    icon: Gamepad2,
    href: '/steam/game-development',
    gradient: 'from-[#F16112] to-[#F1894F]'
  }
];

export default function Header() {
  const { state: cartState } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);
  const [steamDropdownOpen, setSteamDropdownOpen] = useState(false);

  // Hover intent timers to prevent flicker when moving between trigger and dropdown
  const academicCloseTimeout = useRef<number | null>(null);
  const steamCloseTimeout = useRef<number | null>(null);

  const clearTimeoutRef = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const openAcademic = () => {
    clearTimeoutRef(academicCloseTimeout);
    setAcademicDropdownOpen(true);
  };
  const scheduleCloseAcademic = () => {
    clearTimeoutRef(academicCloseTimeout);
    academicCloseTimeout.current = window.setTimeout(() => {
      setAcademicDropdownOpen(false);
    }, 180);
  };

  const openSTEAM = () => {
    clearTimeoutRef(steamCloseTimeout);
    setSteamDropdownOpen(true);
  };
  const scheduleCloseSTEAM = () => {
    clearTimeoutRef(steamCloseTimeout);
    steamCloseTimeout.current = window.setTimeout(() => {
      setSteamDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      clearTimeoutRef(academicCloseTimeout);
      clearTimeoutRef(steamCloseTimeout);
    };
  }, []);

  const isAcademicActive = pathname?.startsWith('/academic') || pathname?.startsWith('/courses/math') || pathname?.startsWith('/courses/english');
  const isSTEAMActive = pathname?.startsWith('/steam');

  return (
    <header className="bg-white/80 backdrop-blur-3xl shadow-[0px_8px_32px_rgba(31,57,109,0.12)] sticky top-0 z-50 border-b border-white/50 ring-1 ring-white/20">
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
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <div className="relative">
              <Link
                href="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === '/'
                    ? 'bg-[#1F396D] text-white shadow-lg'
                    : 'text-gray-700 hover:text-[#1F396D] hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
            </div>

            {/* Academic Dropdown */}
            <div
              className="relative"
              onMouseEnter={openAcademic}
              onMouseLeave={scheduleCloseAcademic}
            >
              <Link
                href="/academic"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group ${
                  academicDropdownOpen || isAcademicActive
                    ? 'bg-[#1F396D] text-white shadow-lg'
                    : 'text-gray-700 hover:text-[#1F396D] hover:bg-gray-100'
                }`}
                onClick={() => {
                  console.log('Academic clicked, current state:', academicDropdownOpen);
                  setAcademicDropdownOpen(!academicDropdownOpen);
                }}
              >
                Academic
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  academicDropdownOpen ? 'rotate-180' : ''
                }`} />
                
                {/* Subtle highlight indicator */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full transition-all duration-300 ${
                  academicDropdownOpen ? 'w-8' : 'group-hover:w-4'
                }`}></div>
              </Link>

              {/* Dropdown Content */}
              <div 
                className={`absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-3xl border-2 border-white/70 shadow-[0px_20px_60px_rgba(31,57,109,0.2)] rounded-2xl overflow-hidden transition-all duration-300 z-50 ring-1 ring-white/40 ${
                academicDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`} 
                style={{ display: academicDropdownOpen ? 'block' : 'none' }}
                onMouseEnter={openAcademic}
                onMouseLeave={scheduleCloseAcademic}
              >
                {/* Header Section */}
                <div className="px-6 py-4 bg-gradient-to-r from-[#1F396D]/5 to-[#F16112]/5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-base">Academic Programs</h3>
                  <p className="text-sm text-gray-600 mt-1">Choose your learning path</p>
                </div>

                {/* Course Items */}
                <div className="py-2">
                  {academicItems.map((item, index) => {
                    const IconComponent = item.icon as any;
                    const isActive = pathname?.startsWith(item.href);
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setAcademicDropdownOpen(false)}
                        className={`group mx-2 my-1 rounded-xl transition-all duration-300 cursor-pointer w-full ${
                          isActive
                            ? 'bg-gradient-to-r from-[#1F396D]/10 to-[#F16112]/10 text-[#1F396D] shadow-inner'
                            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-4 px-4 py-4 w-full">
                          <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                            isActive ? `bg-gradient-to-r ${item.gradient} shadow-lg` : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-100'
                          }`}>
                            <IconComponent className={`${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'} w-5 h-5`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold text-base ${isActive ? 'text-[#1F396D]' : 'text-gray-900 group-hover:text-gray-900'}`}>{item.title}</span>
                              {isActive && <div className="w-2 h-2 bg-[#F16112] rounded-full animate-pulse"></div>}
                            </div>
                            <p className={`text-sm mt-1 ${isActive ? 'text-[#1F396D]/70' : 'text-gray-500 group-hover:text-gray-600'}`}>{item.description}</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#1F396D] translate-x-1' : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300'}`} />
                        </div>
                        {index < academicItems.length - 1 && (<div className="mx-6 border-b border-gray-100"></div>)}
                      </Link>
                    );
                  })}
                </div>

                {/* Footer Section */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Need help choosing? <Link href="/contact-us" className="text-[#F16112] font-medium hover:underline">Contact us</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* STEAM Dropdown */}
            <div
              className="relative"
              onMouseEnter={openSTEAM}
              onMouseLeave={scheduleCloseSTEAM}
            >
              <Link
                href="/steam"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group ${
                  steamDropdownOpen || isSTEAMActive
                    ? 'bg-[#F16112] text-white shadow-lg'
                    : 'text-gray-700 hover:text-[#F16112] hover:bg-gray-100'
                }`}
                onClick={() => {
                  console.log('STEAM clicked, current state:', steamDropdownOpen);
                  setSteamDropdownOpen(!steamDropdownOpen);
                }}
              >
                STEAM
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  steamDropdownOpen ? 'rotate-180' : ''
                }`} />
                
                {/* Subtle highlight indicator */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#1F396D] to-[#F16112] rounded-full transition-all duration-300 ${
                  steamDropdownOpen ? 'w-8' : 'group-hover:w-4'
                }`}></div>
              </Link>

              {/* Dropdown Content */}
              <div 
                className={`absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-3xl border-2 border-white/70 shadow-[0px_20px_60px_rgba(31,57,109,0.2)] rounded-2xl overflow-hidden transition-all duration-300 z-50 ring-1 ring-white/40 ${
                steamDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`} 
                style={{ display: steamDropdownOpen ? 'block' : 'none' }}
                onMouseEnter={openSTEAM}
                onMouseLeave={scheduleCloseSTEAM}
              >
                {/* Header Section */}
                <div className="px-6 py-4 bg-gradient-to-r from-[#1F396D]/5 to-[#F16112]/5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-base">STEAM Programs</h3>
                  <p className="text-sm text-gray-600 mt-1">Explore science, technology, and creativity</p>
                </div>

                {/* Course Items */}
                <div className="py-2">
                  {steamItems.map((item, index) => {
                    const IconComponent = item.icon as any;
                    const isActive = pathname?.startsWith(item.href);
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setSteamDropdownOpen(false)}
                        className={`group mx-2 my-1 rounded-xl transition-all duration-300 cursor-pointer w-full ${
                          isActive
                            ? 'bg-gradient-to-r from-[#F16112]/10 to-[#1F396D]/10 text-[#F16112] shadow-inner'
                            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-4 px-4 py-4 w-full">
                          <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                            isActive ? `bg-gradient-to-r ${item.gradient} shadow-lg` : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-100'
                          }`}>
                            <IconComponent className={`${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'} w-5 h-5`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold text-base ${isActive ? 'text-[#F16112]' : 'text-gray-900 group-hover:text-gray-900'}`}>{item.title}</span>
                              {isActive && <div className="w-2 h-2 bg-[#1F396D] rounded-full animate-pulse"></div>}
                            </div>
                            <p className={`text-sm mt-1 ${isActive ? 'text-[#F16112]/70' : 'text-gray-500 group-hover:text-gray-600'}`}>{item.description}</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#F16112] translate-x-1' : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300'}`} />
                        </div>
                        {index < steamItems.length - 1 && (<div className="mx-6 border-b border-gray-100"></div>)}
                      </Link>
                    );
                  })}
                </div>

                {/* Footer Section */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Need help choosing? <Link href="/contact-us" className="text-[#1F396D] font-medium hover:underline">Contact us</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="relative group">
              <Link
                href="#"
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group text-gray-700 hover:text-[#F16112] hover:bg-gray-100"
              >
                Resources
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#F16112] transition-all duration-300 ease-out opacity-0 group-hover:w-full group-hover:opacity-100"></div>
            </div>

            {/* About Us */}
            <div className="relative group">
              <Link
                href="/about-us"
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group text-gray-700 hover:text-[#F16112] hover:bg-gray-100"
              >
                About Us
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#F16112] transition-all duration-300 ease-out opacity-0 group-hover:w-full group-hover:opacity-100"></div>
            </div>

            {/* Contact Us */}
            <div className="relative group">
              <Link
                href="/contact-us"
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group text-gray-700 hover:text-[#F16112] hover:bg-gray-100"
              >
                Contact Us
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#F16112] transition-all duration-300 ease-out opacity-0 group-hover:w-full group-hover:opacity-100"></div>
            </div>
          </nav>

          {/* Utility Icons and CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Utility Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-[#F16112] transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <Link href="/cart" className="relative text-gray-700 hover:text-[#F16112] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F16112] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartState.itemCount}
                  </span>
                )}
              </Link>
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