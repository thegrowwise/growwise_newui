'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Search, ShoppingCart, Calculator, BookOpen, Brain, Gamepad2, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(925) 456-4606</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>connect@thegrowwise.com</span>
              </div>
            </div>

            {/* Social Media + Address */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-white/70 text-xs">Follow us:</span>
                <div className="flex space-x-2">
                  <Link href="https://www.facebook.com/people/GrowWise/61561059687164/" target="_blank" className="text-white/70 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></Link>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></Link>
                  <Link href="https://www.instagram.com/growwise.dublin/" target="_blank" className="text-white/70 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></Link>
                  <Link href="https://www.linkedin.com/company/thegrowwise/" target="_blank" className="text-white/70 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></Link>
                </div>
              </div>
              <div className="text-white/90 text-xs hidden lg:block">📍 4564 Dublin Blvd, Dublin, CA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer" aria-label="GrowWise home">
              <div className="bg-center bg-contain bg-no-repeat h-[80px] w-[200px]" style={{ backgroundImage: "url('/assets/growwise-logo.png')" }} />
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
              <Button variant="ghost" className="text-gray-700 hover:text-[#1F396D] hover:bg-gray-100 rounded-full px-6">Log in</Button>
              <Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white rounded-full px-6 shadow-lg">Enroll Now</Button>
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