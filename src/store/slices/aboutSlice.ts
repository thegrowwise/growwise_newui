import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AboutState {
  loading: boolean;
  error: string | null;
  data: any | null;
}

const initialState: AboutState = {
  loading: false,
  error: null,
  data: null,
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    fetchAboutRequested(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAboutSucceeded(state, action: PayloadAction<any>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchAboutFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAboutRequested, fetchAboutSucceeded, fetchAboutFailed } = aboutSlice.actions;
export default aboutSlice.reducer;


