import { MenuItem, VariantStyles } from './types';
import { VARIANT_STYLES, ROUTE_PATH_PATTERNS_HIDE_CART } from './constants';

/** True when the current path is one where the header cart should not be shown. */
export function isCartHiddenOnPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return ROUTE_PATH_PATTERNS_HIDE_CART.some((pattern) => pathname.includes(pattern));
}

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
