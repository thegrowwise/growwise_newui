import Link from 'next/link';

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
  const getButtonStyles = (variant: 'blue' | 'orange') => {
    const baseStyles = "px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap";
    
    if (variant === 'orange') {
      return `${baseStyles} bg-[#F16112] text-white hover:bg-[#F1894F] shadow-lg hover:shadow-xl`;
    }
    
    return `${baseStyles} bg-[#1F396D] text-white hover:bg-[#29335C] shadow-lg hover:shadow-xl`;
  };

  return (
    <div className="relative group">
      <Link
        href={createLocaleUrl(item.href)}
        className={getButtonStyles(item.variant)}
      >
        {item.label}
      </Link>
    </div>
  );
}
