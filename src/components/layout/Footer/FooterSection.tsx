import Link from 'next/link';
import { FooterSection as FooterSectionType } from './types';

interface FooterSectionProps {
  section: FooterSectionType;
  createLocaleUrl: (path: string) => string;
}

export default function FooterSection({ section, createLocaleUrl }: FooterSectionProps) {
  return (
    <div className="flex flex-col">
      <h4 className="text-gray-800 text-xl font-bold mb-6">{section.title}</h4>
      <ul className="space-y-3 text-gray-600">
        {section.links.map((link, index) => (
          <li key={index}>
            {link.active ? (
              <Link 
                href={createLocaleUrl(link.href)} 
                className="hover:text-gray-800 transition-colors hover:underline"
              >
                {link.label}
              </Link>
            ) : (
              <span className="text-gray-500">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
