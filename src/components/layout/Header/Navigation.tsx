import { MenuItem } from './types';
import MenuItemRenderer from './MenuItemRenderer';
import UtilityIcons from './UtilityIcons';

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
        {menuItems.map((item) => (
          <MenuItemRenderer
            key={item.key}
            item={item}
            pathname={pathname}
            openDropdowns={openDropdowns}
            openSubmenus={openSubmenus}
            onDropdownEnter={onDropdownEnter}
            onDropdownLeave={onDropdownLeave}
            onDropdownToggle={onDropdownToggle}
            onSubmenuToggle={onSubmenuToggle}
            onSubmenuEnter={onSubmenuEnter}
            onSubmenuLeave={onSubmenuLeave}
            createLocaleUrl={createLocaleUrl}
            footerHelper={footerHelper}
            footerContactCta={footerContactCta}
          />
        ))}
      </nav>

      {/* Utility Icons and CTA Buttons */}
      <UtilityIcons 
        cartItemCount={cartItemCount}
        createLocaleUrl={createLocaleUrl}
      />
    </>
  );
}
