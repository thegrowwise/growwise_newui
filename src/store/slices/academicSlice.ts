import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WhyChooseItem {
  icon: string; // icon name from iconMap
  title: string;
  description: string;
  bgColor: string;
  color: string;
}

export interface SuccessStoryItem {
  name: string;
  grade: string;
  subject: string;
  improvement: string;
  quote: string;
  image: string;
}

export interface AcademicData {
  whyChooseAcademic: WhyChooseItem[];
  successStories: SuccessStoryItem[];
}

interface AcademicState {
  loading: boolean;
  error: string | null;
  data: AcademicData | null;
}

const initialState: AcademicState = {
  loading: false,
  error: null,
  data: null,
};

const academicSlice = createSlice({
  name: 'academic',
  initialState,
  reducers: {
    fetchAcademicRequested(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAcademicSucceeded(state, action: PayloadAction<AcademicData>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchAcademicFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAcademicRequested, fetchAcademicSucceeded, fetchAcademicFailed } = academicSlice.actions;
export default academicSlice.reducer;


