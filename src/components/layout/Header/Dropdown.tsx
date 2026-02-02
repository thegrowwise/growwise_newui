import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { MenuItem } from './types';
import { getVariant, isMenuItemActive, getVisibleDropdownItems } from './utils';
import DropdownItem from './DropdownItem';

interface DropdownProps {
  item: MenuItem;
  isOpen: boolean;
  isActive: boolean;
  openSubmenus: { [key: string]: boolean };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onItemClick: () => void;
  onSubmenuToggle: (key: string) => void;
  onSubmenuEnter: (key: string) => void;
  onSubmenuLeave: (key: string) => void;
  createLocaleUrl: (path: string) => string;
  pathname: string | null;
  footerHelper: string;
  footerContactCta: string;
}

export default function Dropdown({
  item,
  isOpen,
  isActive,
  openSubmenus,
  onMouseEnter,
  onMouseLeave,
  onItemClick,
  onSubmenuToggle,
  onSubmenuEnter,
  onSubmenuLeave,
  createLocaleUrl,
  pathname,
  footerHelper,
  footerContactCta
}: DropdownProps) {
  const v = getVariant(item.variant);
  const visibleItems = getVisibleDropdownItems(item.dropdown?.items || []);

  // Prevent navigation for "Camps" menu item
  const isCamps = item.key === 'camps';
  
  const linkContent = (
    <>
      {item.label}
      {visibleItems.length > 0 && (
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      )}
      
      {/* Subtle highlight indicator - this is the subtle highlight indicator that appears when the cursor is hovering over the dropdown item */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${v.indicator} rounded-full transition-all duration-300 ${
        isOpen ? 'w-8' : 'group-hover:w-4'
      }`}></div>
    </>
  );

  return (
    <div
      key={item.key}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isCamps ? (
        <span
          className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-1 relative group whitespace-nowrap cursor-default ${
            isOpen || isActive ? v.activeBg : `text-gray-700 ${v.hoverText} hover:bg-gray-100`
          }`}
          onClick={() => onItemClick()}
        >
          {linkContent}
        </span>
      ) : (
        <Link
          href={createLocaleUrl(item.href)}
          className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-1 relative group whitespace-nowrap ${
            isOpen || isActive ? v.activeBg : `text-gray-700 ${v.hoverText} hover:bg-gray-100`
          }`}
          onClick={() => onItemClick()}
        >
          {linkContent}
        </Link>
      )}

      {/* ========== FIX #1: INVISIBLE BRIDGE ========== */}
      {/* PURPOSE: Prevents flickering by filling the gap between trigger and dropdown */}
      {/* LOCATION: After the Link/span closing tag, before dropdown panel */}
      {isOpen && visibleItems.length > 0 && (
        <div 
          className="absolute top-full left-0 w-full h-2 bg-transparent"
          onMouseEnter={onMouseEnter}/>
      )}
      {/* ========== END FIX #1 ========== */}

      {/* Dropdown Content - only show if there are items */}
      {/* FIX #2: ADD MOUSE ENTER AND MOUSE LEAVE - Keeps dropdown open when cursor moves onto the dropdown panel and triggers close delay when cursor leaves the dropdown panel */}
      {visibleItems.length > 0 && (
        <div 
          className={`absolute top-full left-0 mt-2 w-80 bg-white border-2 border-gray-200 shadow-[0px_20px_60px_rgba(31,57,109,0.2)] rounded-2xl transition-all duration-300 ring-1 ring-gray-200 overflow-visible ${
            isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
          onMouseEnter={onMouseEnter} 
          onMouseLeave={onMouseLeave}
        >
          {/* Header Section */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#1F396D]/5 to-[#F16112]/5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-base">{item.dropdown?.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.dropdown?.subtitle}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1 overflow-visible">
            {visibleItems.map((dropdownItem, index) => {
              const isDropdownItemActive = pathname?.startsWith(createLocaleUrl(dropdownItem.href));
              const hasSubmenu = dropdownItem.hasSubmenu && dropdownItem.submenuItems;
              const isSubmenuOpen = openSubmenus[dropdownItem.key];
              
              return (
                <DropdownItem
                  key={dropdownItem.title}
                  item={dropdownItem}
                  isActive={isDropdownItemActive || false}
                  hasSubmenu={hasSubmenu || false}
                  isSubmenuOpen={isSubmenuOpen || false}
                  onItemClick={onItemClick}
                  onSubmenuToggle={() => onSubmenuToggle(dropdownItem.key)}
                  onSubmenuEnter={() => onSubmenuEnter(dropdownItem.key)}
                  onSubmenuLeave={() => onSubmenuLeave(dropdownItem.key)}
                  createLocaleUrl={createLocaleUrl}
                  variant={(item.variant as 'blue' | 'orange') || 'blue'}
                />
              );
            })}
          </div>

          {/* Footer Section - only for non-academic/steam dropdowns */}
          {item.key !== 'academic' && item.key !== 'steam' && (
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {footerHelper} <Link href={createLocaleUrl('/contact')} className="text-[#1F396D] font-medium hover:underline">{footerContactCta}</Link>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}