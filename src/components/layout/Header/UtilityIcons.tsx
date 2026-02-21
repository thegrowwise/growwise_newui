import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import SearchBar from './SearchBar';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useButtonTracking } from '@/lib/analytics/hooks';
import { useTranslations } from 'next-intl';

interface UtilityIconsProps {
  cartItemCount: number;
  createLocaleUrl: (path: string) => string;
  showCart: boolean;
}

export default function UtilityIcons({ cartItemCount, createLocaleUrl, showCart }: UtilityIconsProps) {
  const t = useTranslations('navigation');
  const { trackButtonClick } = useButtonTracking();
  // Student login is now handled by our custom page

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
        {showCart && (
          <Link 
            href={createLocaleUrl('/cart')} 
            className="relative text-gray-700 hover:text-[#F16112] transition-colors"
            aria-label={cartItemCount > 0 ? `Shopping cart, ${cartItemCount} items` : 'Shopping cart'}
          >
            <ShoppingCart className="w-5 h-5" aria-hidden />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F16112] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium" aria-hidden>
                {cartItemCount}
              </span>
            )}
          </Link>
        )}
        {/* Enroll Now Button */}
        <Link
          href={createLocaleUrl('/enroll')}
          onClick={handleEnrollClick}
          className="px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap bg-[#F16112] text-white hover:bg-[#F1894F] shadow-lg hover:shadow-xl"
        >
          {t('enroll')}
        </Link>

        <Link
          href={createLocaleUrl('/student-login')}
          className="px-5 py-2 rounded-full font-medium border border-[#1F396D] text-[#1F396D] hover:bg-[#1F396D] hover:text-white transition-all duration-300 whitespace-nowrap shadow-sm"
        >
          Student Login
        </Link>
      </div>

      {/* Locale Switcher */}
      <div className="ml-2">
        <LocaleSwitcher />
      </div>
    </div>
  );
}
