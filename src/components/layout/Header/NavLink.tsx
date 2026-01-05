import Link from 'next/link';

interface NavLinkProps {
  item: {
    key: string;
    label: string;
    href: string;
  };
  isActive: boolean;
  createLocaleUrl: (path: string) => string;
}

export default function NavLink({ item, isActive, createLocaleUrl }: NavLinkProps) {
  // Prevent navigation for "Camps" menu item
  const isCamps = item.key === 'camps';
  
  if (isCamps) {
    return (
      <div className="relative group">
        <span
          className={`header-navlink whitespace-nowrap cursor-default ${
            isActive
              ? 'bg-[#1F396D] text-white shadow-lg'
              : 'header-nav-neutral hover:text-[#F16112]'
          }`}
        >
          {item.label}
        </span>
        <div className="header-indicator-base bg-[#F16112] transition-all duration-300 ease-out opacity-0 group-hover:w-full group-hover:opacity-100"></div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={createLocaleUrl(item.href)}
        className={`header-navlink whitespace-nowrap ${
          isActive
            ? 'bg-[#1F396D] text-white shadow-lg'
            : 'header-nav-neutral hover:text-[#F16112]'
        }`}
      >
        {item.label}
      </Link>
      <div className="header-indicator-base bg-[#F16112] transition-all duration-300 ease-out opacity-0 group-hover:w-full group-hover:opacity-100"></div>
    </div>
  );
}
