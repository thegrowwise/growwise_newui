import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MathCoursesData {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
  };
  filters: {
    gradeLevels: Array<{
      value: string;
      label: string;
      icon: string;
      color: string;
    }>;
    courseTypes: Array<{
      value: string;
      label: string;
      icon: string;
      color: string;
    }>;
    alignments: Array<{
      value: string;
      label: string;
      icon: string;
      color: string;
    }>;
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
    bgColor: string;
    delay: string;
  }>;
  whyChoose: {
    title: string;
    subtitle: string;
  };
  notSure: {
    title: string;
    subtitle: string;
    steps: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    cta: {
      primary: string;
      secondary: string;
    };
  };
  cta: {
    title: string;
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
  };
}

interface MathCoursesState {
  data: MathCoursesData | null;
  loading: boolean;
  error: string | null;
}

const initialState: MathCoursesState = {
  data: null,
  loading: false,
  error: null,
};

const mathCoursesSlice = createSlice({
  name: 'mathCourses',
  initialState,
  reducers: {
    fetchMathCoursesRequested: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMathCoursesSucceeded: (state, action: PayloadAction<MathCoursesData>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchMathCoursesFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMathCoursesRequested,
  fetchMathCoursesSucceeded,
  fetchMathCoursesFailed,
} = mathCoursesSlice.actions;

export default mathCoursesSlice.reducer;
