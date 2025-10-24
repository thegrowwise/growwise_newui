import { Phone, Mail } from 'lucide-react';
import { ContactInfo as ContactInfoType } from './types';

interface ContactInfoProps {
  contact: ContactInfoType;
}

export default function ContactInfo({ contact }: ContactInfoProps) {
  // Clean phone number for tel: link (remove spaces, parentheses, etc.)
  const cleanPhoneNumber = contact.phone.replace(/[\s\(\)\-]/g, '');
  
  return (
    <div className="space-y-2 text-gray-600">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        <a 
          href={`tel:${cleanPhoneNumber}`}
          className="hover:text-[#F16112] transition-colors duration-200 cursor-pointer"
          title="Click to call"
        >
          {contact.phone}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        <a 
          href={`mailto:${contact.email}`}
          className="hover:text-[#F16112] transition-colors duration-200 cursor-pointer"
          title="Click to email"
        >
          {contact.email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <span>📍</span>
        <span>{contact.address}</span>
      </div>
    </div>
  );
}
