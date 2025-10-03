import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HomeHeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  icon: string; // lucide icon name
  bgGradient: string;
  iconColor: string;
  ctaColor: string;
  bgImage: string;
}

export interface ProgramSubItem { name: string; icon: string; description: string }

export interface ProgramCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  bgGradient: string;
  iconColor: string;
  href?: string;
  subItems: ProgramSubItem[];
}

export interface PopularCourseCard {
  id: number;
  name: string;
  benefit: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  cta: string;
}

export interface StatisticCard {
  id: number;
  value: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export interface CtaData {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface HomeContentData {
  heroSlides: HomeHeroSlide[];
  popularCourses: PopularCourseCard[];
  statisticsData: StatisticCard[];
  k12Programs: ProgramCard[];
  steamPrograms: ProgramCard[];
  testimonials: TestimonialItem[];
  whyChooseUs: WhyChooseItem[];
  cta: CtaData;
}

interface HomeState {
  data: HomeContentData | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  data: null,
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    fetchHomeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHomeSuccess: (state, action: PayloadAction<HomeContentData>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchHomeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchHomeStart, fetchHomeSuccess, fetchHomeFailure } = homeSlice.actions;
export default homeSlice.reducer;
export type { HomeState };


