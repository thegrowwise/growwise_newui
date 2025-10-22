import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FooterData } from '@/components/layout/Footer/types';

interface FooterState {
  data: FooterData | null;
  loading: boolean;
  error: string | null;
}

const initialState: FooterState = {
  data: null,
  loading: false,
  error: null,
};

const footerSlice = createSlice({
  name: 'footer',
  initialState,
  reducers: {
    fetchFooterRequested: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFooterSucceeded: (state, action: PayloadAction<FooterData>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchFooterFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchFooterRequested, fetchFooterSucceeded, fetchFooterFailed } = footerSlice.actions;
export default footerSlice.reducer;
