import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContactInfoItem {
  id: number;
  titleKey: string;
  value: string;
  icon: string; // icon name from Lucide
  color: string;
  bgColor: string;
}

export interface ContactData {
  contactInfo: ContactInfoItem[];
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


