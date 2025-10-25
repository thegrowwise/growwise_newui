import { MenuItem } from './types';
import { isMenuItemActive } from './utils';
import Dropdown from './Dropdown';
import NavButton from './NavButton';
import NavLink from './NavLink';

interface MenuItemRendererProps {
  item: MenuItem;
  pathname: string | null;
  openDropdowns: { [key: string]: boolean };
  openSubmenus: { [key: string]: boolean };
  onDropdownEnter: (key: string) => void;
  onDropdownLeave: (key: string) => void;
  onDropdownToggle: (key: string) => void;
  onSubmenuToggle: (key: string) => void;
  onSubmenuEnter: (key: string) => void;
  onSubmenuLeave: (key: string) => void;
  createLocaleUrl: (path: string) => string;
  footerHelper: string;
  footerContactCta: string;
}

export default function MenuItemRenderer({
  item,
  pathname,
  openDropdowns,
  openSubmenus,
  onDropdownEnter,
  onDropdownLeave,
  onDropdownToggle,
  onSubmenuToggle,
  onSubmenuEnter,
  onSubmenuLeave,
  createLocaleUrl,
  footerHelper,
  footerContactCta
}: MenuItemRendererProps) {
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
  }

  // Check if it's a button
  const isButton = (item as any).isButton;
  if (isButton) {
    return (
      <NavButton
        key={item.key}
        item={item}
        createLocaleUrl={createLocaleUrl}
      />
    );
  }

  // Render as regular nav link
  const isActive = isMenuItemActive(item, pathname, createLocaleUrl('').split('/')[1]);
  return (
    <NavLink
      key={item.key}
      item={item}
      isActive={isActive}
      createLocaleUrl={createLocaleUrl}
    />
  );
}
