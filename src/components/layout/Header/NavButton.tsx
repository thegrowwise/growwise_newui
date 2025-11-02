import Link from 'next/link';
import { useButtonTracking } from '@/lib/analytics/hooks';

interface NavButtonProps {
  item: {
    key: string;
    label: string;
    href: string;
    variant: 'blue' | 'orange';
  };
  createLocaleUrl: (path: string) => string;
}

export default function NavButton({ item, createLocaleUrl }: NavButtonProps) {
  const { trackButtonClick } = useButtonTracking();

  const getButtonStyles = (variant: 'blue' | 'orange') => {
    const baseStyles = "px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap";
    
    if (variant === 'orange') {
      return `${baseStyles} bg-[#F16112] text-white hover:bg-[#F1894F] shadow-lg hover:shadow-xl`;
    }
    
    return `${baseStyles} bg-[#1F396D] text-white hover:bg-[#29335C] shadow-lg hover:shadow-xl`;
  };

  const handleClick = () => {
    trackButtonClick(item.label, 'header_navigation', {
      button_type: 'nav_button',
      button_variant: item.variant,
      destination: item.href
    });
  };

  return (
    <div className="relative group">
      <Link
        href={createLocaleUrl(item.href)}
        className={getButtonStyles(item.variant)}
        onClick={handleClick}
      >
        {item.label}
      </Link>
    </div>
  );
}
