import { FooterData } from './types';
import ContactInfo from './ContactInfo';

interface FooterLogoProps {
  logo: FooterData['logo'];
  description: string;
  contact: FooterData['contact'];
}

export default function FooterLogo({ logo, description, contact }: FooterLogoProps) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <div 
          className="bg-center bg-contain bg-no-repeat" 
          style={{ 
            backgroundImage: `url('${logo.src}')`,
            width: `${logo.width}px`,
            height: `${logo.height}px`
          }}
          aria-label={logo.alt}
        />
      </div>
      <p className="text-gray-600 leading-relaxed mb-6">
        {description}
      </p>
      <ContactInfo contact={contact} />
    </div>
  );
}
