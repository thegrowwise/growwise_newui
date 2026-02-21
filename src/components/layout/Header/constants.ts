import { 
  Calculator, 
  BookOpen, 
  Brain, 
  Gamepad2, 
  GraduationCap, 
  Target, 
  BookMarked, 
  UserCheck,
  Calendar
} from 'lucide-react';
import { VariantStyles, type MenuItem } from './types';
import { CONTACT_INFO } from '@/lib/constants';

// Icon mapping for dynamic icon rendering
export const ICON_MAP = {
  Calculator,
  BookOpen,
  Brain,
  Gamepad2,
  GraduationCap,
  Target,
  BookMarked,
  UserCheck,
  Calendar
} as const;

// Variant-based styles
export const VARIANT_STYLES: Record<string, VariantStyles> = {
  blue: {
    activeBg: 'bg-[#1F396D] text-white shadow-lg',
    hoverText: 'hover:text-[#1F396D]',
    indicator: 'from-[#F16112] to-[#F1894F]',
    itemTitleActive: 'text-[#1F396D]',
    itemPulse: 'bg-[#F16112]'
  },
  orange: {
    activeBg: 'bg-[#F16112] text-white shadow-lg',
    hoverText: 'hover:text-[#F16112]',
    indicator: 'from-[#1F396D] to-[#F16112]',
    itemTitleActive: 'text-[#F16112]',
    itemPulse: 'bg-[#1F396D]'
  }
} as const;

// Default values for header data
export const DEFAULT_HEADER_DATA = {
  topBar: {
    phone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    address: CONTACT_INFO.formattedAddress,
    followLabel: 'Follow us:',
    social: {
      facebook: 'https://www.facebook.com/people/GrowWise/61561059687164/',
      twitter: '#',
      instagram: 'https://www.instagram.com/growwise.dublin/',
      linkedin: 'https://www.linkedin.com/company/thegrowwise/'
    }
  },
  footerHelper: 'Need help choosing?',
  footerContactCta: 'Contact us'
} as const;

// Dropdown close delay for hover intent
export const DROPDOWN_CLOSE_DELAY = 180;

/** Path suffixes (locale-agnostic) where the header cart icon is hidden. SSOT for cart visibility by route. */
export const ROUTE_PATH_PATTERNS_HIDE_CART: readonly string[] = [];

/** Fallback menu when backend header/menu is unavailable. SSOT for camps menu fallback (Summer Camp only). */
export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    key: 'camps',
    label: 'Camps',
    href: '/camps',
    type: 'dropdown',
    variant: 'orange',
    dropdown: {
      title: 'Camps & Programs',
      subtitle: 'Join our exciting camp experiences',
      items: [
        {
          key: 'summerCamp',
          title: 'Summer Camp',
          description: 'Accredited summer programs in Math, Coding, and Robotics',
          icon: 'Calendar',
          href: '/camps/summer',
          gradient: 'from-[#F16112] to-[#F1894F]',
        },
      ],
    },
  },
];
