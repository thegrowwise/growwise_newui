import { useState, useRef, useEffect } from 'react';
import { DropdownState } from './types';
import { DROPDOWN_CLOSE_DELAY } from './constants';

export function useDropdownState() {
  const [openDropdowns, setOpenDropdowns] = useState<DropdownState>({});
  const [openSubmenus, setOpenSubmenus] = useState<DropdownState>({});
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
      setOpenSubmenus(prev => ({ ...prev, [key]: false }));
    }, DROPDOWN_CLOSE_DELAY);
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: false }));
  };

  const openSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: true }));
  };

  const closeSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: false }));
  };

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({});
    setOpenSubmenus({});
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.keys(dropdownTimeouts.current).forEach(key => {
        clearTimeoutRef(key);
      });
    };
  }, []);

  return {
    openDropdowns,
    openSubmenus,
    openDropdown,
    scheduleCloseDropdown,
    toggleDropdown,
    closeDropdown,
    openSubmenu,
    closeSubmenu,
    toggleSubmenu,
    closeAllDropdowns,
    onSubmenuToggle: toggleSubmenu,
    onSubmenuEnter: openSubmenu,
    onSubmenuLeave: closeSubmenu
  };
}

export function useMobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return {
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  };
}
