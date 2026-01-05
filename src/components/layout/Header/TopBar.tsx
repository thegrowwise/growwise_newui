import Link from 'next/link';
import { Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

interface TopBarProps {
  phone: string;
  email: string;
  address: string;
  followLabel: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

export default function TopBar({ phone, email, address, followLabel, social }: TopBarProps) {
  // Clean phone number for tel: link (remove spaces, parentheses, etc.)
  const cleanPhoneNumber = phone.replace(/[\s\(\)\-]/g, '');
  
  return (
    <div className="header-topbar" suppressHydrationWarning>
      <div className="container-7xl">
        <div className="header-toprow">
          {/* Contact Info */}
          <div className="header-contact-group">
            <div className="header-contact-item">
              <Phone className="w-4 h-4" />
              <a 
                href={`tel:${cleanPhoneNumber}`}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
                title="Click to call"
              >
                {phone}
              </a>
            </div>
            <div className="header-contact-item">
              <Mail className="w-4 h-4" />
              <a 
                href={`mailto:${email}`}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
                title="Click to email"
              >
                {email}
              </a>
            </div>
          </div>

          {/* Social Media + Address */}
          <div className="header-social-row">
            <div className="header-social-group">
              <span className="header-social-label">{followLabel}</span>
              <div className="header-social-links">
                <Link href={social.facebook} target="_blank" className="header-social-link">
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link href={social.instagram} target="_blank" className="header-social-link">
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link href={social.linkedin} target="_blank" className="header-social-link">
                  <Linkedin className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="header-address" suppressHydrationWarning>{address}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
