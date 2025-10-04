import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EnglishCoursesData {
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
  successStories: Array<{
    name: string;
    grade: string;
    improvement: string;
    quote: string;
    course: string;
    image: string;
  }>;
  programHighlights: Array<{
    icon: string;
    title: string;
    description: string;
    stats: string;
    color: string;
  }>;
  learningOutcomes: Array<{
    category: string;
    outcomes: string[];
    icon: string;
  }>;
  cta: {
    title: string;
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
  };
}

interface EnglishCoursesState {
  data: EnglishCoursesData | null;
  loading: boolean;
  error: string | null;
}

const initialState: EnglishCoursesState = {
  data: null,
  loading: false,
  error: null,
};

const englishCoursesSlice = createSlice({
  name: 'englishCourses',
  initialState,
  reducers: {
    fetchEnglishCoursesRequested: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEnglishCoursesSucceeded: (state, action: PayloadAction<EnglishCoursesData>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchEnglishCoursesFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchEnglishCoursesRequested,
  fetchEnglishCoursesSucceeded,
  fetchEnglishCoursesFailed,
} = englishCoursesSlice.actions;

export default englishCoursesSlice.reducer;
