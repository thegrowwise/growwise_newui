import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  about: {
    title: string;
    description: string;
    imageUrl: string;
  };
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    avatar: string;
  }>;
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
  };
  navigation: {
    logo: string;
    menuItems: Array<{
      id: string;
      label: string;
      href: string;
    }>;
  };
  footer: {
    description: string;
    socialLinks: Array<{
      id: string;
      platform: string;
      url: string;
      icon: string;
    }>;
    links: Array<{
      id: string;
      label: string;
      url: string;
    }>;
  };
}

interface ContentState {
  data: ContentData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  data: null,
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    fetchContentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchContentSuccess: (state, action: PayloadAction<ContentData>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchContentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchContentStart, fetchContentSuccess, fetchContentFailure } = contentSlice.actions;
export default contentSlice.reducer; 