'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHeaderRequested } from '@/store/slices/headerSlice';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Search, ShoppingCart, Calculator, BookOpen, Brain, Gamepad2, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/gw/CartContext';
import LocaleSwitcher from '@/components/LocaleSwitcher';

// Icon mapping for dynamic icon rendering
const iconMap: { [key: string]: any } = {
  Calculator,
  BookOpen,
  Brain,
  Gamepad2
};

export default function Header() {
  const t = useTranslations();
  const { state: cartState } = useCart();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const header = useAppSelector((s) => s.header.data);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  // Get menu items from Redux store with fallbacks
  const menuItems = header?.menuItems || [];

  // Hover intent timers to prevent flicker when moving between trigger and dropdown
  const dropdownTimeouts = useRef<{ [key: string]: number | null }>({});

  const clearTimeoutRef = (key: string) => {
    if (dropdownTimeouts.current[key]) {
      window.clearTimeout(dropdownTimeouts.current[key]!);
      dropdownTimeouts.current[key] = null;
    }
  };

  const openDropdown = (key: string) => {
    clearTimeoutRef(key);
    setOpenDropdowns(prev => ({ ...prev, [key]: true }));
  };

  const scheduleCloseDropdown = (key: string) => {
    clearTimeoutRef(key);
    dropdownTimeouts.current[key] = window.setTimeout(() => {
      setOpenDropdowns(prev => ({ ...prev, [key]: false }));
    }, 180);
  };

  useEffect(() => {
    return () => {
      Object.keys(dropdownTimeouts.current).forEach(key => {
        clearTimeoutRef(key);
      });
    };
  }, []);

  // Helper function to check if a menu item is active
  const isMenuItemActive = (item: any) => {
    if (item.type === 'dropdown' && item.dropdown) {
      return item.dropdown.items.some((dropdownItem: any) => pathname?.startsWith(dropdownItem.href));
    }
    return pathname === item.href;
  };

  useEffect(() => {
    if (!header) dispatch(fetchHeaderRequested());
  }, [dispatch, header]);

  const topPhone = header?.topBar.phone ?? '(925) 456-4606';
  const topEmail = header?.topBar.email ?? 'connect@thegrowwise.com';
  const topAddress = header?.topBar.address ?? '📍 4564 Dublin Blvd, Dublin, CA';
  const followLabel = header?.topBar.followLabel ?? 'Follow us:';
  const social = header?.topBar.social ?? { facebook: 'https://www.facebook.com/people/GrowWise/61561059687164/', twitter: '#', instagram: 'https://www.instagram.com/growwise.dublin/', linkedin: 'https://www.linkedin.com/company/thegrowwise/' };
  const footerHelper = header?.footerHelper ?? 'Need help choosing?';
  const footerContactCta = header?.footerContactCta ?? 'Contact us';

  // Variant-based styles so no key-specific logic is needed
  const variantStyles = {
    blue: {
      activeBg: 'bg-[#1F396D] text-white shadow-lg',
      hoverText: 'hover:text-[#1F396D]',
      indicator: 'from-[#F16112] to-[#F1894F]',
      itemTitleActive: 'text-[#1F396D]',
      itemPulse: 'bg-[#F16112]'
    },
    orange: {
      activeBg: 'bg-[#F16112] text-white shadow-lg',
      hoverText: 'hover:text-[#F16112]',
      indicator: 'from-[#1F396D] to-[#F16112]',
      itemTitleActive: 'text-[#F16112]',
      itemPulse: 'bg-[#1F396D]'
    }
  } as const;

  const getVariant = (variant?: string) => variantStyles[(variant as keyof typeof variantStyles) || 'blue'] || variantStyles.blue;

  // Generic dropdown component
  const renderDropdown = (item: any) => {
    const v = getVariant(item.variant);
    const isOpen = openDropdowns[item.key];
    const isActive = isMenuItemActive(item);
    
    return (
      <div
        key={item.key}
        className="relative"
        onMouseEnter={() => openDropdown(item.key)}
        onMouseLeave={() => scheduleCloseDropdown(item.key)}
      >
        <Link
          href={item.href}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group ${
            isOpen || isActive ? v.activeBg : `text-gray-700 ${v.hoverText} hover:bg-gray-100`
          }`}
          onClick={() => {
            setOpenDropdowns(prev => ({ ...prev, [item.key]: !prev[item.key] }));
          }}
        >
          {item.label}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} />
          
          {/* Subtle highlight indicator */}
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${v.indicator} rounded-full transition-all duration-300 ${
            isOpen ? 'w-8' : 'group-hover:w-4'
          }`}></div>
        </Link>

        {/* Dropdown Content */}
        <div 
          className={`header-dropdown-panel ${isOpen ? 'show' : 'hide'}`} 
          style={{ display: isOpen ? 'block' : 'none' }}
          onMouseEnter={() => openDropdown(item.key)}
          onMouseLeave={() => scheduleCloseDropdown(item.key)}
        >
          {/* Header Section */}
          <div className="header-dropdown-header">
            <h3 className="font-semibold text-gray-900 text-base">{item.dropdown.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.dropdown.subtitle}</p>
          </div>

          {/* Dropdown Items */}
          <div className="header-dropdown-items">
            {item.dropdown.items.map((dropdownItem: any, index: number) => {
              const IconComponent = iconMap[dropdownItem.icon] || Calculator;
              const isDropdownItemActive = pathname?.startsWith(dropdownItem.href);
              return (
                <Link
                  key={dropdownItem.title}
                  href={dropdownItem.href}
                  onClick={() => setOpenDropdowns(prev => ({ ...prev, [item.key]: false }))}
                  className={`header-dropdown-link ${isDropdownItemActive ? 'header-dropdown-active' : 'header-dropdown-neutral'} group`}
                >
                  <div className="header-dropdown-row">
                    <div className={`header-dropdown-iconwrap ${isDropdownItemActive ? `bg-gradient-to-r ${dropdownItem.gradient} shadow-lg` : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-100'}`}>
                      <IconComponent className={`${isDropdownItemActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'} w-5 h-5`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="header-dropdown-title-row">
                        <span className={`font-semibold text-base ${isDropdownItemActive ? v.itemTitleActive : 'header-text-neutral'}`}>{dropdownItem.title}</span>
                        {isDropdownItemActive && <div className={`w-2 h-2 ${v.itemPulse} rounded-full animate-pulse`}></div>}
                      </div>
                      <p className={`header-dropdown-desc ${isDropdownItemActive ? 'text-[#1F396D]/70' : 'header-text-muted'}`}>{dropdownItem.description}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isDropdownItemActive ? 'text-[#1F396D] translate-x-1' : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300'}`} />
                  </div>
                  {index < item.dropdown.items.length - 1 && (<div className="header-dropdown-divider"></div>)}
                </Link>
              );
            })}
          </div>

          {/* Footer Section */}
          <div className="header-dropdown-footer">
            <p className="header-dropdown-footer-text">
              {footerHelper} <Link href="/contact" className="text-[#1F396D] font-medium hover:underline">{footerContactCta}</Link>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="header-root">
      {/* Top Header Bar */}
      <div className="header-topbar">
        <div className="container-7xl">
          <div className="header-toprow">
            {/* Contact Info */}
            <div className="header-contact-group">
              <div className="header-contact-item">
                <Phone className="w-4 h-4" />
                <span>{topPhone}</span>
              </div>
              <div className="header-contact-item">
                <Mail className="w-4 h-4" />
                <span>{topEmail}</span>
              </div>
            </div>

            {/* Social Media + Address */}
            <div className="header-social-row">
              <div className="header-social-group">
                <span className="header-social-label">{followLabel}</span>
                <div className="header-social-links">
                  <Link href={social.facebook} target="_blank" className="header-social-link"><Facebook className="w-4 h-4" /></Link>
                  <Link href={social.twitter} className="header-social-link"><Twitter className="w-4 h-4" /></Link>
                  <Link href={social.instagram} target="_blank" className="header-social-link"><Instagram className="w-4 h-4" /></Link>
                  <Link href={social.linkedin} target="_blank" className="header-social-link"><Linkedin className="w-4 h-4" /></Link>
                </div>
              </div>
              <div className="header-address">{topAddress}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-7xl">
        <div className="header-mainrow">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer" aria-label="GrowWise home">
              <div className="header-logo" style={{ backgroundImage: "url('/assets/growwise-logo.png')" }} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="header-desktop-nav">
            {menuItems.map((item) => {
              if (item.type === 'dropdown') {
                return renderDropdown(item);
              } else {
                const isActive = isMenuItemActive(item);
                return (
                  <div key={item.key} className="relative group">
                    <Link
                      href={item.href}
                      className={`header-navlink ${
                        isActive
                          ? 'bg-[#1F396D] text-white shadow-lg'
                          : `header-nav-neutral hover:text-[#F16112]`
                      }`}
                    >
                      {item.label}
                    </Link>
                    <div className={`header-indicator-base bg-[#F16112] transition-all duration-300 ease-out opacity-0 group-hover:w-full group-hover:opacity-100`}></div>
                  </div>
                );
              }
            })}
          </nav>

          {/* Utility Icons and CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Locale Switcher */}
            <LocaleSwitcher />
            
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
              <Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white rounded-full px-6 shadow-lg">{t('navigation.enroll')}</Button>
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
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`block font-medium py-2 transition-colors duration-200 ${
                  isMenuItemActive(item)
                    ? 'text-[#1F396D]' 
                    : 'text-gray-700 hover:text-[#F16112]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
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