import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { MenuItem } from './types';
import { isMenuItemActive } from './utils';

interface MobileNavigationProps {
  menuItems: MenuItem[];
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  createLocaleUrl: (path: string) => string;
  pathname: string | null;
}

export default function MobileNavigation({
  menuItems,
  mobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  createLocaleUrl,
  pathname
}: MobileNavigationProps) {
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          className="text-gray-700 hover:text-[#F16112]"
          onClick={onToggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={createLocaleUrl(item.href)}
                className={`block font-medium py-2 transition-colors duration-200 ${
                  isMenuItemActive(item, pathname, createLocaleUrl('').split('/')[1])
                    ? 'text-[#1F396D]' 
                    : 'text-gray-700 hover:text-[#F16112]'
                }`}
                onClick={onCloseMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
