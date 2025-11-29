import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, ChevronDown, ChevronRight } from 'lucide-react';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { MenuItem } from './types';
import { getVisibleDropdownItems, isMenuItemActive } from './utils';

// Student login is now handled by our custom page

interface MobileNavigationProps {
  menuItems: MenuItem[];
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  createLocaleUrl: (path: string) => string;
  pathname: string | null;
  cartItemCount: number;
}

export default function MobileNavigation({
  menuItems,
  mobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  createLocaleUrl,
  pathname,
  cartItemCount
}: MobileNavigationProps) {
  const [expandedDropdowns, setExpandedDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (key: string) => {
    setExpandedDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const hasDropdownItems = (item: MenuItem) => {
    if (item.type !== 'dropdown' || !item.dropdown?.items) {
      return false;
    }
    return getVisibleDropdownItems(item.dropdown.items).length > 0;
  };

  // Reset dropdowns when menu closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setExpandedDropdowns({});
    }
  }, [mobileMenuOpen]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const usableMenuItems = Array.isArray(menuItems) ? menuItems : [];
  const filteredMenuItems = usableMenuItems.filter(
    (item) => item.key !== 'enroll' && item.visible !== false
  );

  return (
    <>
      {/* Mobile menu button & cart icon */}
      <div className="lg:hidden flex items-center space-x-4 z-[55] relative">
        <Link
          href={createLocaleUrl('/cart')}
          className="relative text-gray-700 hover:text-[#F16112] transition-colors p-2 -mr-2"
          onClick={onCloseMobileMenu}
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#F16112] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[1.25rem]">
              {cartItemCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          className="text-gray-700 hover:text-[#F16112] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F16112] focus:ring-offset-2 rounded p-2 -mr-2"
          onClick={onToggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobileMenu} />
          <div className="absolute inset-0 bg-white flex flex-col shadow-2xl w-screen h-screen">
            <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                type="button"
                className="text-gray-700 hover:text-[#F16112] transition-colors p-2 rounded-lg hover:bg-gray-100"
                onClick={onCloseMobileMenu}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-4 py-6 pb-8 flex-1 overflow-y-auto">
              {filteredMenuItems.length > 0 ? (
                <>
                  {filteredMenuItems.map((item, index) => {
                    const isDropdown = hasDropdownItems(item);
                    const isExpanded = expandedDropdowns[item.key];
                    const visibleDropdownItems = isDropdown
                      ? getVisibleDropdownItems(item.dropdown?.items || [])
                      : [];
                    const isActive = isMenuItemActive(
                      item,
                      pathname,
                      createLocaleUrl('').split('/')[1]
                    );

                    return (
                      <div key={item.key}>
                        {isDropdown ? (
                          <>
                            <button
                              type="button"
                              onClick={() => toggleDropdown(item.key)}
                              className={`w-full flex items-center justify-between font-medium py-3 px-2 transition-colors duration-200 rounded-lg text-left ${
                                isActive
                                  ? 'text-[#1F396D] bg-[#1F396D]/10'
                                  : 'text-gray-700 hover:text-[#F16112] hover:bg-gray-50'
                              }`}
                            >
                              <span>{item.label}</span>
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-5 h-5 flex-shrink-0" />
                              )}
                            </button>

                            {isExpanded && visibleDropdownItems.length > 0 && (
                              <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-gray-200 pl-4">
                                {visibleDropdownItems.map((dropdownItem) => {
                                  const isDropdownItemActive = pathname?.startsWith(
                                    createLocaleUrl(dropdownItem.href)
                                  );
                                  return (
                                    <Link
                                      key={dropdownItem.key}
                                      href={createLocaleUrl(dropdownItem.href)}
                                      className={`block py-2 px-2 text-sm transition-colors duration-200 rounded-lg ${
                                        isDropdownItemActive
                                          ? 'text-[#1F396D] bg-[#1F396D]/10 font-medium'
                                          : 'text-gray-600 hover:text-[#F16112] hover:bg-gray-50'
                                      }`}
                                      onClick={onCloseMobileMenu}
                                    >
                                      {dropdownItem.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          // Prevent navigation for "Camps" menu item
                          item.key === 'camps' ? (
                            <span
                              className={`block font-medium py-3 px-2 transition-colors duration-200 rounded-lg cursor-default ${
                                isActive
                                  ? 'text-[#1F396D] bg-[#1F396D]/10'
                                  : 'text-gray-700 hover:text-[#F16112] hover:bg-gray-50'
                              }`}
                            >
                              {item.label}
                            </span>
                          ) : (
                            <Link
                              href={createLocaleUrl(item.href)}
                              className={`block font-medium py-3 px-2 transition-colors duration-200 rounded-lg ${
                                isActive
                                  ? 'text-[#1F396D] bg-[#1F396D]/10'
                                  : 'text-gray-700 hover:text-[#F16112] hover:bg-gray-50'
                              }`}
                              onClick={onCloseMobileMenu}
                            >
                              {item.label}
                            </Link>
                          )
                        )}
                        {index < filteredMenuItems.length - 1 && (
                          <div className="border-b border-gray-200 my-1" />
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-gray-500 text-sm py-4">
                  Loading menu...
                </div>
              )}

              <Link
                href={createLocaleUrl('/enroll')}
                className="block w-full mt-6 px-6 py-3 rounded-full font-medium text-center transition-all duration-300 bg-[#F16112] text-white hover:bg-[#F1894F] shadow-lg"
                onClick={onCloseMobileMenu}
              >
                Enroll Now
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <LocaleSwitcher />
              </div>

              <div className="mt-6">
                <Link
                  href={createLocaleUrl('/student-login')}
                  className="block w-full px-6 py-3 rounded-full font-medium text-center transition-all duration-300 border border-[#1F396D] text-[#1F396D] hover:bg-[#1F396D] hover:text-white"
                  onClick={onCloseMobileMenu}
                >
                  Student Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
