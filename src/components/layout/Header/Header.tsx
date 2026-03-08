'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHeaderRequested } from '@/store/slices/headerSlice';
import { useCart } from '@/components/gw/CartContext';
import { useDropdownState, useMobileMenu } from './hooks';
import { createLocaleUrl, getVisibleMenuItems, isCartHiddenOnPath } from './utils';
import { DEFAULT_HEADER_DATA, FALLBACK_MENU_ITEMS } from './constants';
import TopBar from './TopBar';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';

export default function Header() {
  const locale = useLocale();
  const { state: cartState } = useCart();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const header = useAppSelector((s) => s.header.data);

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

  // Get menu items from Redux store (backend); fallback to frontend when missing
  const allMenuItems = header?.menuItems?.length ? header.menuItems : FALLBACK_MENU_ITEMS;
  const menuItems = getVisibleMenuItems(allMenuItems);

  // Create locale-aware URL helper
  const createLocaleUrlHelper = (path: string) => createLocaleUrl(path, locale);
  const showCart = !isCartHiddenOnPath(pathname);

  // Fetch header data if not available
  useEffect(() => {
    if (!header) dispatch(fetchHeaderRequested());
  }, [dispatch, header]);

  // Get header data with fallbacks
  const topPhone = header?.topBar.phone ?? DEFAULT_HEADER_DATA.topBar.phone;
  const topEmail = header?.topBar.email ?? DEFAULT_HEADER_DATA.topBar.email;
  const topAddress = header?.topBar.address ?? DEFAULT_HEADER_DATA.topBar.address;
  const followLabel = header?.topBar.followLabel ?? DEFAULT_HEADER_DATA.topBar.followLabel;
  const social = header?.topBar.social ?? DEFAULT_HEADER_DATA.topBar.social;
  const footerHelper = header?.footerHelper ?? DEFAULT_HEADER_DATA.footerHelper;
  const footerContactCta = header?.footerContactCta ?? DEFAULT_HEADER_DATA.footerContactCta;

  return (
    <header className="header-root">
      {/* Top Header Bar */}
      <div>
        <TopBar
          phone={topPhone}
          email={topEmail}
          address={topAddress}
          followLabel={followLabel}
          social={social}
        />
      </div>

      {/* Main Navigation */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="header-mainrow flex-wrap lg:flex-nowrap">
          {/* Logo — flex-shrink-0 keeps the logo visible when nav is long */}
          <div className="flex items-center flex-shrink-0">
            <Link href={createLocaleUrlHelper('/')} className="cursor-pointer" aria-label="GrowWise home">
              <Image
                src="/assets/growwise-logo.png"
                alt="GrowWise"
                className="header-logo"
                width={230}
                height={90}
                priority
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
            showCart={showCart}
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
            showCart={showCart}
          />
        </div>
      </div>
    </header>
  );
}
