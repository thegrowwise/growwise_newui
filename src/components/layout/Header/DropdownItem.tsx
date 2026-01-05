import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DropdownItem as DropdownItemType, SubmenuItem } from './types';
import { ICON_MAP } from './constants';

interface DropdownItemProps {
  item: DropdownItemType;
  isActive: boolean;
  hasSubmenu: boolean;
  isSubmenuOpen: boolean;
  onItemClick: () => void;
  onSubmenuToggle: () => void;
  onSubmenuEnter: () => void;
  onSubmenuLeave: () => void;
  createLocaleUrl: (path: string) => string;
  variant: 'blue' | 'orange';
}

export default function DropdownItem({
  item,
  isActive,
  hasSubmenu,
  isSubmenuOpen,
  onItemClick,
  onSubmenuToggle,
  onSubmenuEnter,
  onSubmenuLeave,
  createLocaleUrl,
  variant
}: DropdownItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP] || ICON_MAP.Calculator;
  const colors = {
    blue: { primary: '#1F396D', secondary: '#F16112' },
    orange: { primary: '#F16112', secondary: '#1F396D' }
  }[variant];

  const isHighlighted = isActive || (hasSubmenu && isSubmenuOpen) || isHovered;

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubmenu) {
      e.preventDefault();
      onSubmenuToggle();
    } else {
      onItemClick();
    }
  };

  return (
    <div className="relative">
      <Link
        href={hasSubmenu ? '#' : createLocaleUrl(item.href)}
        onMouseEnter={(e) => {
          setIsHovered(true);
          if (hasSubmenu) {
            onSubmenuEnter();
          }
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          if (hasSubmenu) {
            onSubmenuLeave();
          }
        }}
        onClick={handleClick}
        className={`group mx-2 my-0.5 rounded-xl transition-all duration-300 cursor-pointer border-0 outline-none w-full ${
          isHighlighted
            ? 'bg-gradient-to-r from-[#1F396D]/10 to-[#F16112]/10 text-[#1F396D] shadow-inner' 
            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 text-gray-700'
        }`}
      >
        <div className="flex items-center gap-4 px-4 py-2 w-full">
          {/* Icon */}
          <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
            isHighlighted
              ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
              : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-100'
          }`}>
            <IconComponent className={`w-5 h-5 transition-colors duration-300 ${
              isHighlighted ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
            }`} />
            {isHighlighted && (
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-20 blur-sm`}></div>
            )}
          </div>
          
          {/* Text Content */}
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-base transition-colors duration-300 ${
                isActive ? `text-[${colors.primary}]` : 'text-gray-900 group-hover:text-gray-900'
              }`}>
                {item.title}
              </span>
              {isActive && (
                <div className={`w-2 h-2 bg-[${colors.secondary}] rounded-full animate-pulse`}></div>
              )}
            </div>
            <p className={`text-sm mt-1 transition-colors duration-300 ${
              isActive ? `text-[${colors.primary}]/70` : 'text-gray-500 group-hover:text-gray-600'
            }`}>
              {item.description}
            </p>
          </div>
          
          {/* Arrow - only show if has submenu */}
          {hasSubmenu && (
            <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
              isActive || isSubmenuOpen
                ? `text-[${colors.primary}] transform translate-x-1` 
                : 'text-gray-400 group-hover:text-gray-600 group-hover:transform group-hover:translate-x-1'
            }`} />
          )}
        </div>
      </Link>
      
      {/* Submenu */}
      {hasSubmenu && item.submenuItems && isSubmenuOpen && (
        <Submenu 
          items={item.submenuItems}
          onItemClick={onItemClick}
          onSubmenuEnter={onSubmenuEnter}
          onSubmenuLeave={onSubmenuLeave}
          colors={colors}
        />
      )}
    </div>
  );
}

interface SubmenuProps {
  items: SubmenuItem[];
  onItemClick: () => void;
  onSubmenuEnter: () => void;
  onSubmenuLeave: () => void;
  colors: { primary: string; secondary: string };
}

function Submenu({ items, onItemClick, onSubmenuEnter, onSubmenuLeave, colors }: SubmenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div 
      className="absolute left-full top-0 ml-2 w-72 bg-white border-2 border-gray-200 shadow-[0px_20px_60px_rgba(31,57,109,0.2)] rounded-2xl overflow-hidden ring-1 ring-gray-200 z-50"
      onMouseEnter={onSubmenuEnter}
      onMouseLeave={onSubmenuLeave}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#1F396D]/5 to-[#F16112]/5 border-b border-gray-100">
        <h4 className="font-semibold text-gray-900 text-sm">Courses</h4>
        <p className="text-xs text-gray-600 mt-0.5">Select your subject</p>
      </div>
      
      {/* Items */}
      <div className="py-1">
        {items.filter(item => item.visible !== false).map((subItem, subIndex) => {
          const SubIconComponent = ICON_MAP[subItem.icon as keyof typeof ICON_MAP] || ICON_MAP.Calculator;
          const isSubActive = false; // TODO: Pass from parent if needed
          const isSubHovered = hoveredItem === subItem.title;
          const isSubHighlighted = isSubActive || isSubHovered;
          
          return (
            <Link
              key={subItem.title}
              href={subItem.href}
              onClick={onItemClick}
              onMouseEnter={() => setHoveredItem(subItem.title)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`group mx-2 my-0.5 rounded-xl transition-all duration-300 cursor-pointer border-0 outline-none w-full ${
                isSubHighlighted 
                  ? 'bg-gradient-to-r from-[#1F396D]/10 to-[#F16112]/10 shadow-inner' 
                  : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50'
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-2 w-full">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  isSubHighlighted 
                    ? `bg-gradient-to-r ${subItem.gradient} shadow-md` 
                    : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-100'
                }`}>
                  <SubIconComponent className={`w-4 h-4 transition-colors duration-300 ${
                    isSubHighlighted ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1 text-left">
                  <span className={`font-semibold text-sm block ${
                    isSubHighlighted ? `text-[${colors.primary}]` : 'text-gray-900 group-hover:text-gray-900'
                  }`}>
                    {subItem.title}
                  </span>
                  <p className={`text-xs mt-0.5 ${
                    isSubHighlighted ? `text-[${colors.primary}]/70` : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {subItem.description}
                  </p>
                </div>
                
                {isSubActive && (
                  <div className={`w-2 h-2 bg-[${colors.secondary}] rounded-full animate-pulse`}></div>
                )}
              </div>
              {subIndex < items.length - 1 && (
                <div className="mx-4 border-b border-gray-100"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}