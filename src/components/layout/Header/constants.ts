import { 
  Calculator, 
  BookOpen, 
  Brain, 
  Gamepad2, 
  GraduationCap, 
  Target, 
  BookMarked, 
  UserCheck 
} from 'lucide-react';
import { VariantStyles } from './types';

// Icon mapping for dynamic icon rendering
export const ICON_MAP = {
  Calculator,
  BookOpen,
  Brain,
  Gamepad2,
  GraduationCap,
  Target,
  BookMarked,
  UserCheck
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
    phone: '(925) 456-4606',
    email: 'connect@thegrowwise.com',
    address: '📍 4564 Dublin Blvd, Dublin, CA',
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
