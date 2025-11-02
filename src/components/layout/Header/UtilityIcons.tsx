import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import SearchBar from './SearchBar';
import LocaleSwitcher from '@/components/LocaleSwitcher';

interface UtilityIconsProps {
  cartItemCount: number;
  createLocaleUrl: (path: string) => string;
}

export default function UtilityIcons({ cartItemCount, createLocaleUrl }: UtilityIconsProps) {
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
      </div>

      {/* Locale Switcher */}
      <div className="ml-2">
        <LocaleSwitcher />
      </div>
    </div>
  );
}
