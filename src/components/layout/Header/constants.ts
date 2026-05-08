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

/** Fallback menu when backend header/menu is unavailable. Mirrors public/api/mock/en/header.json menuItems. */
export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
    type: 'simple',
    active: true,
    variant: 'blue',
  },
  {
    key: 'academic',
    label: 'Academic',
    href: '/academic',
    type: 'dropdown',
    variant: 'blue',
    dropdown: {
      title: 'Academic Programs',
      subtitle: 'Choose your learning path',
      items: [
        {
          key: 'courses',
          title: 'Courses',
          description: 'Browse our academic courses',
          icon: 'BookOpen',
          href: '/courses',
          gradient: 'from-[#1F396D] to-[#F16112]',
          hasSubmenu: true,
          submenuItems: [
            {
              key: 'math',
              title: 'Math Courses',
              description: 'Master mathematics from basics to advanced',
              icon: 'Calculator',
              href: '/courses/math',
              gradient: 'from-[#1F396D] to-[#29335C]',
            },
            {
              key: 'english',
              title: 'English Courses',
              description: 'Comprehensive English language arts',
              icon: 'BookOpen',
              href: '/courses/english',
              gradient: 'from-[#F16112] to-[#F1894F]',
            },
          ],
        },
        {
          key: 'highSchoolMath',
          title: 'High School Math',
          description: 'Advanced mathematics for high school students',
          icon: 'GraduationCap',
          href: '/courses/high-school-math',
          gradient: 'from-[#29335C] to-[#1F396D]',
          hasSubmenu: true,
          submenuHeaderSubtitle: 'Tutoring, curriculum, and finals prep',
          submenuItems: [
            {
              title: 'High School Math',
              description: 'Algebra I through Pre-Calculus — tutoring overview',
              icon: 'GraduationCap',
              href: '/courses/high-school-math',
              gradient: 'from-[#29335C] to-[#1F396D]',
            },
            {
              title: 'Math Finals Prep',
              description: 'End-of-year finals support & structured prep program',
              icon: 'Target',
              href: '/math-finals-practice-session',
              gradient: 'from-[#1F396D] to-[#F16112]',
            },
          ],
        },
        {
          key: 'satPrep',
          title: 'SAT Prep',
          description: 'Comprehensive SAT test preparation',
          icon: 'Target',
          href: '/courses/sat-prep',
          gradient: 'from-[#29335C] to-[#F16112]',
        },
        {
          key: 'bookAssessment',
          title: 'Book Assessment',
          description: 'Schedule academic evaluation and get insights',
          icon: 'BookMarked',
          href: '/book-assessment',
          gradient: 'from-[#F16112] to-[#1F396D]',
        },
        {
          key: 'enrollAcademic',
          title: 'Enroll Now - Academic',
          description: 'Register for academic programs today',
          icon: 'UserCheck',
          href: '/enroll-academic',
          gradient: 'from-[#1F396D] to-[#F16112]',
        },
      ],
    },
  },
  {
    key: 'steam',
    label: 'STEAM',
    href: '/steam',
    type: 'dropdown',
    variant: 'orange',
    dropdown: {
      title: 'STEAM Programs',
      subtitle: 'Explore science, technology, and creativity',
      items: [
        {
          key: 'mlAi',
          title: 'ML/AI Coding',
          description: 'Explore artificial intelligence and machine learning',
          icon: 'Brain',
          href: '/steam/ml-ai-coding',
          gradient: 'from-[#1F396D] to-[#F16112]',
        },
        {
          key: 'gameDev',
          title: 'Game Development',
          description: 'Create games with Roblox, Scratch, and Unity',
          icon: 'Gamepad2',
          href: '/steam/game-development',
          gradient: 'from-[#F16112] to-[#F1894F]',
        },
      ],
    },
  },
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
        {
          key: 'workshopCalendar',
          title: 'Book Workshop/Webinar',
          description: 'Browse and book upcoming workshops and webinars',
          icon: 'BookMarked',
          href: '/workshop-calendar',
          gradient: 'from-[#1F396D] to-[#29335C]',
        },
      ],
    },
  },
  {
    key: 'blogs',
    label: 'Blogs',
    href: '/growwise-blogs',
    type: 'simple',
    variant: 'orange',
  },
  {
    key: 'about',
    label: 'About Us',
    href: '/about',
    type: 'simple',
    variant: 'orange',
  },
  {
    key: 'contact',
    label: 'Contact Us',
    href: '/contact',
    type: 'simple',
    variant: 'orange',
  },
  {
    key: 'enroll',
    label: 'Enroll Now',
    href: '/enroll',
    type: 'simple',
    variant: 'orange',
  },
];
