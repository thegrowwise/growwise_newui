import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SocialLinks = {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
};

export interface MenuItem {
  key: string;
  label: string;
  href: string;
  type: 'simple' | 'dropdown';
  active?: boolean;
  visible?: boolean; // New flag to show/hide menu items
  variant?: 'blue' | 'orange' | string;
  dropdown?: {
    title: string;
    subtitle: string;
    items: Array<{
      key: string;
      title: string;
      description: string;
      icon: string;
      href: string;
      gradient: string;
      visible?: boolean; // New flag for dropdown items
    }>;
  };
}

export interface HeaderState {
  loading: boolean;
  error: string | null;
  data: {
    topBar: {
      phone: string;
      email: string;
      address: string;
      followLabel: string;
      social: SocialLinks;
    };
    nav: {
      resourcesLabel: string;
    };
    menuItems: MenuItem[];
    academic: {
      dropdownTitle: string;
      dropdownSubtitle: string;
      items: Array<{ 
        key: string; 
        title: string; 
        description: string; 
        icon: string; 
        href: string; 
        gradient: string; 
      }>;
    };
    steam: {
      dropdownTitle: string;
      dropdownSubtitle: string;
      items: Array<{ 
        key: string; 
        title: string; 
        description: string; 
        icon: string; 
        href: string; 
        gradient: string; 
      }>;
    };
    footerHelper: string;
    footerContactCta: string;
  } | null;
}

const initialState: HeaderState = {
  loading: false,
  error: null,
  data: null,
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    fetchHeaderRequested(state) {
      state.loading = true;
      state.error = null;
    },
    fetchHeaderSucceeded(state, action: PayloadAction<NonNullable<HeaderState['data']>>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchHeaderFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchHeaderRequested, fetchHeaderSucceeded, fetchHeaderFailed } = headerSlice.actions;
export default headerSlice.reducer;


