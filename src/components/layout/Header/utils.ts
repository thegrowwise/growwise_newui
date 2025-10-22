import { MenuItem, VariantStyles } from './types';
import { VARIANT_STYLES } from './constants';

export function createLocaleUrl(path: string, locale: string): string {
  return `/${locale}${path}`;
}

export function getVariant(variant?: string): VariantStyles {
  return VARIANT_STYLES[(variant as keyof typeof VARIANT_STYLES) || 'blue'] || VARIANT_STYLES.blue;
}

export function isMenuItemActive(item: MenuItem, pathname: string | null, locale: string): boolean {
  if (item.type === 'dropdown' && item.dropdown) {
    return item.dropdown.items.some((dropdownItem) => 
      pathname?.startsWith(createLocaleUrl(dropdownItem.href, locale))
    );
  }
  return pathname === createLocaleUrl(item.href, locale);
}

export function getVisibleMenuItems(menuItems: MenuItem[]): MenuItem[] {
  return menuItems.filter((item) => item.visible !== false);
}

export function getVisibleDropdownItems(dropdownItems: any[]): any[] {
  return dropdownItems.filter((item) => item.visible !== false);
}
