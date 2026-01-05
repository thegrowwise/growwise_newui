'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHeaderRequested } from '@/store/slices/headerSlice';
import { useCart } from '@/components/gw/CartContext';
import { useDropdownState, useMobileMenu } from './hooks';
import { createLocaleUrl, getVisibleMenuItems } from './utils';
import { DEFAULT_HEADER_DATA } from './constants';
import TopBar from './TopBar';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';

export default function Header() {
  const locale = useLocale();
  const { state: cartState } = useCart();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const header = useAppSelector((s) => s.header.data);
  const [isScrolled, setIsScrolled] = useState(false);

  // Custom hooks for state management
  const {
    openDropdowns,
    openSubmenus,
    openDropdown,
    scheduleCloseDropdown,
    toggleDropdown,
    onSubmenuToggle,
    onSubmenuEnter,
    onSubmenuLeave
  } = useDropdownState();

  const {
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  } = useMobileMenu();

  // Get menu items from Redux store with fallbacks and filter by visibility
  const allMenuItems = header?.menuItems || [];
  const menuItems = getVisibleMenuItems(allMenuItems);

  // Create locale-aware URL helper
  const createLocaleUrlHelper = (path: string) => createLocaleUrl(path, locale);

  // Fetch header data if not available
  useEffect(() => {
    if (!header) dispatch(fetchHeaderRequested());
  }, [dispatch, header]);

  // Scroll detection for header shrink animation
  // Use throttled scroll handler to prevent jitter/shaking
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let currentIsScrolled = false;
    const SCROLL_THRESHOLD = 50;
    const THROTTLE_MS = 50; // Throttle to max once per 50ms for smoother response

    const handleScroll = () => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Throttle the scroll handler
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeScrolled = scrollPosition > SCROLL_THRESHOLD;
        
        // Only update state if it actually changed (prevents unnecessary re-renders and jitter)
        if (shouldBeScrolled !== currentIsScrolled) {
          setIsScrolled(shouldBeScrolled);
          currentIsScrolled = shouldBeScrolled;
        }
      }, THROTTLE_MS);
    };

    // Check initial scroll position
    const initialScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    currentIsScrolled = initialScroll > SCROLL_THRESHOLD;
    setIsScrolled(currentIsScrolled);

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Get header data with fallbacks
  const topPhone = header?.topBar.phone ?? DEFAULT_HEADER_DATA.topBar.phone;
  const topEmail = header?.topBar.email ?? DEFAULT_HEADER_DATA.topBar.email;
  const topAddress = header?.topBar.address ?? DEFAULT_HEADER_DATA.topBar.address;
  const followLabel = header?.topBar.followLabel ?? DEFAULT_HEADER_DATA.topBar.followLabel;
  const social = header?.topBar.social ?? DEFAULT_HEADER_DATA.topBar.social;
  const footerHelper = header?.footerHelper ?? DEFAULT_HEADER_DATA.footerHelper;
  const footerContactCta = header?.footerContactCta ?? DEFAULT_HEADER_DATA.footerContactCta;

  return (
    <header className={`header-root ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Top Header Bar */}
      <div className={`transition-all duration-300 ease-out ${isScrolled ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-20 opacity-100'}`}>
        <TopBar
          phone={topPhone}
          email={topEmail}
          address={topAddress}
          followLabel={followLabel}
          social={social}
        />
      </div>

      {/* Main Navigation */}
      <div className="container-7xl">
        <div 
          className="header-mainrow transition-all duration-300 ease-out flex-wrap lg:flex-nowrap" 
          style={{ height: isScrolled ? '5rem' : '8rem', minHeight: isScrolled ? '5rem' : '8rem' }}
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link href={createLocaleUrlHelper('/')} className="cursor-pointer" aria-label="GrowWise home">
              <div 
                className="header-logo transition-all duration-300 ease-out" 
                style={{ 
                  backgroundImage: "url('/assets/growwise-logo.png')",
                  height: isScrolled ? '70px' : '110px',
                  width: isScrolled ? '180px' : '280px'
                }} 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <Navigation
            menuItems={menuItems}
            openDropdowns={openDropdowns}
            openSubmenus={openSubmenus}
            onDropdownEnter={openDropdown}
            onDropdownLeave={scheduleCloseDropdown}
            onDropdownToggle={toggleDropdown}
            onSubmenuToggle={onSubmenuToggle}
            onSubmenuEnter={onSubmenuEnter}
            onSubmenuLeave={onSubmenuLeave}
            createLocaleUrl={createLocaleUrlHelper}
            pathname={pathname}
            cartItemCount={cartState.itemCount}
            footerHelper={footerHelper}
            footerContactCta={footerContactCta}
          />

          {/* Mobile Navigation */}
          <MobileNavigation
            menuItems={menuItems}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={toggleMobileMenu}
            onCloseMobileMenu={closeMobileMenu}
            createLocaleUrl={createLocaleUrlHelper}
            pathname={pathname}
            cartItemCount={cartState.itemCount}
          />
        </div>
      </div>
    </header>
  );
}
