import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { MenuItem } from './types';
import { isMenuItemActive } from './utils';
import Dropdown from './Dropdown';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import SearchBar from './SearchBar';

interface NavigationProps {
  menuItems: MenuItem[];
  openDropdowns: { [key: string]: boolean };
  openSubmenus: { [key: string]: boolean };
  onDropdownEnter: (key: string) => void;
  onDropdownLeave: (key: string) => void;
  onDropdownToggle: (key: string) => void;
  onSubmenuToggle: (key: string) => void;
  onSubmenuEnter: (key: string) => void;
  onSubmenuLeave: (key: string) => void;
  createLocaleUrl: (path: string) => string;
  pathname: string | null;
  cartItemCount: number;
  footerHelper: string;
  footerContactCta: string;
}

export default function Navigation({
  menuItems,
  openDropdowns,
  openSubmenus,
  onDropdownEnter,
  onDropdownLeave,
  onDropdownToggle,
  onSubmenuToggle,
  onSubmenuEnter,
  onSubmenuLeave,
  createLocaleUrl,
  pathname,
  cartItemCount,
  footerHelper,
  footerContactCta
}: NavigationProps) {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="header-desktop-nav">
        {menuItems.map((item) => {
          // Check if it's a dropdown with actual items
          const hasDropdownItems = item.type === 'dropdown' && 
            item.dropdown?.items && 
            item.dropdown.items.filter((dropdownItem: any) => dropdownItem.visible !== false).length > 0;

          if (hasDropdownItems) {
            return (
              <Dropdown
                key={item.key}
                item={item}
                isOpen={openDropdowns[item.key] || false}
                isActive={isMenuItemActive(item, pathname, createLocaleUrl('').split('/')[1])}
                openSubmenus={openSubmenus}
                onMouseEnter={() => onDropdownEnter(item.key)}
                onMouseLeave={() => onDropdownLeave(item.key)}
                onItemClick={() => onDropdownToggle(item.key)}
                onSubmenuToggle={onSubmenuToggle}
                onSubmenuEnter={onSubmenuEnter}
                onSubmenuLeave={onSubmenuLeave}
                createLocaleUrl={createLocaleUrl}
                pathname={pathname}
                footerHelper={footerHelper}
                footerContactCta={footerContactCta}
              />
            );
          } else {
            // Render as simple link (either type is 'simple' or dropdown has no items)
            const isActive = isMenuItemActive(item, pathname, createLocaleUrl('').split('/')[1]);
            return (
              <div key={item.key} className="relative group">
                <Link
                  href={createLocaleUrl(item.href)}
                  className={`header-navlink whitespace-nowrap ${
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
        {/* Utility Icons */}
        <div className="flex items-center space-x-4">
          <SearchBar />
          <Link href={createLocaleUrl('/cart')} className="relative text-gray-700 hover:text-[#F16112] transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F16112] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Locale Switcher moved to far right */}
        <div className="ml-2">
          <LocaleSwitcher />
        </div>
      </div>
    </>
  );
}
