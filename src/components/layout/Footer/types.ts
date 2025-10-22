export interface FooterLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface FooterData {
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  description: string;
  contact: ContactInfo;
  sections: FooterSection[];
  copyright: string;
}

export interface FooterProps {
  data?: Partial<FooterData>;
  createLocaleUrl: (path: string) => string;
}
