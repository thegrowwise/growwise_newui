import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import SearchBar from './SearchBar';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useButtonTracking } from '@/lib/analytics/hooks';
import { useTranslations } from 'next-intl';

interface UtilityIconsProps {
  cartItemCount: number;
  createLocaleUrl: (path: string) => string;
}

export default function UtilityIcons({ cartItemCount, createLocaleUrl }: UtilityIconsProps) {
  const t = useTranslations('navigation');
  const { trackButtonClick } = useButtonTracking();

  const handleEnrollClick = () => {
    trackButtonClick('Enroll Now', 'header_navigation', {
      button_type: 'nav_button',
      button_variant: 'orange',
      destination: '/enroll'
    });
  };

  return (
    <div className="hidden lg:flex items-center space-x-6">
      {/* Utility Icons */}
      <div className="flex items-center space-x-4">
        <SearchBar />
        <Link 
          href={createLocaleUrl('/cart')} 
          className="relative text-gray-700 hover:text-[#F16112] transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#F16112] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {cartItemCount}
            </span>
          )}
        </Link>
        
        {/* Enroll Now Button */}
        <Link
          href={createLocaleUrl('/enroll')}
          onClick={handleEnrollClick}
          className="px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap bg-[#F16112] text-white hover:bg-[#F1894F] shadow-lg hover:shadow-xl"
        >
          {t('enroll')}
        </Link>
      </div>

      {/* Locale Switcher */}
      <div className="ml-2">
        <LocaleSwitcher />
      </div>
    </div>
  );
}
