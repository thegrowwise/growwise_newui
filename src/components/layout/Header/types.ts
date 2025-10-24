export interface MenuItem {
  key: string;
  label: string;
  href: string;
  type: 'link' | 'dropdown' | 'simple';
  visible?: boolean;
  variant?: string;
  dropdown?: DropdownConfig;
}

export interface DropdownConfig {
  title: string;
  subtitle: string;
  items: DropdownItem[];
}

export interface DropdownItem {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  visible?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
}

export interface SubmenuItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  visible?: boolean;
}

export interface HeaderData {
  topBar: {
    phone: string;
    email: string;
    address: string;
    followLabel: string;
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
  };
  menuItems: MenuItem[];
  footerHelper: string;
  footerContactCta: string;
}

export interface VariantStyles {
  activeBg: string;
  hoverText: string;
  indicator: string;
  itemTitleActive: string;
  itemPulse: string;
}

export interface DropdownState {
  [key: string]: boolean;
}
