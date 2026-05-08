import { MenuItem, VariantStyles } from './types';
import { VARIANT_STYLES, ROUTE_PATH_PATTERNS_HIDE_CART } from './constants';
import { ENABLED_LOCALES } from '@/i18n/localeConfig';
import { publicPath } from '@/lib/publicPath';

/** True when the current path is one where the header cart should not be shown. */
export function isCartHiddenOnPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return ROUTE_PATH_PATTERNS_HIDE_CART.some((pattern) => pathname.includes(pattern));
}

export function createLocaleUrl(path: string, locale: string): string {
  // Keep external/absolute URLs intact (including protocol-relative URLs).
  if (!path) return publicPath('/', locale);
  const trimmed = path.trim();
  if (
    /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed) || // http(s)://, etc.
    trimmed.startsWith('//') || // protocol-relative
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  let normalized = trimmed;
  if (normalized.startsWith('#') || normalized.startsWith('?')) {
    normalized = `/${normalized}`;
  }
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;

  const localePattern =
    ENABLED_LOCALES.length > 0 ? ENABLED_LOCALES.join('|') : 'en';
  normalized = normalized.replace(new RegExp(`^/(?:${localePattern})(?=/|$)`), '');
  if (normalized === '') normalized = '/';

  return publicPath(normalized === '/' ? '/' : normalized, locale);
}

export function getVariant(variant?: string): VariantStyles {
  return VARIANT_STYLES[(variant as keyof typeof VARIANT_STYLES) || 'blue'] || VARIANT_STYLES.blue;
}

function isDropdownItemPathActive(
  dropdownItem: { href: string; hasSubmenu?: boolean; submenuItems?: { href: string }[] },
  pathname: string | null,
  locale: string
): boolean {
  if (pathname?.startsWith(createLocaleUrl(dropdownItem.href, locale))) {
    return true;
  }
  if (dropdownItem.submenuItems?.length) {
    return dropdownItem.submenuItems.some((sub) =>
      pathname?.startsWith(createLocaleUrl(sub.href, locale))
    );
  }
  return false;
}

export function isMenuItemActive(item: MenuItem, pathname: string | null, locale: string): boolean {
  if (item.type === 'dropdown' && item.dropdown) {
    return item.dropdown.items.some((dropdownItem) =>
      isDropdownItemPathActive(dropdownItem, pathname, locale)
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
