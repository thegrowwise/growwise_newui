import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContactInfoItem {
  icon: string; // icon name from Lucide
  title: string;
  primary: string;
  secondary: string;
  description: string;
  bgColor: string;
}

export interface ContactData {
  hero?: {
    title: string;
    subtitle: string;
  };
  contactMethods?: {
    title: string;
    subtitle: string;
  };
  form?: {
    title: string;
    subtitle: string;
  };
  programs?: Array<{ value: string; label: string }>;
  contactInfo: ContactInfoItem[];
  officeHours?: Array<{ day: string; hours: string; isOpen: boolean }>;
  faqs?: Array<{ question: string; answer: string }>;
  socialLinks?: Array<{ icon: string; url: string; label: string }>;
  locationDetails?: {
    phone: string;
    googleMapsUrl: string;
    directionsUrl: string;
  };
}

interface ContactState {
  loading: boolean;
  error: string | null;
  data: ContactData | null;
}

const initialState: ContactState = {
  loading: false,
  error: null,
  data: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    fetchContactRequested(state) {
      state.loading = true;
      state.error = null;
    },
    fetchContactSucceeded(state, action: PayloadAction<ContactData>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchContactFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchContactRequested, fetchContactSucceeded, fetchContactFailed } = contactSlice.actions;
export default contactSlice.reducer;


