import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SteamProgram {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  bgGradient: string;
  iconColor: string;
  features: string[];
  subItems: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
  cta: string;
}

export interface SteamFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  delay: string;
}

export interface SteamSuccessStory {
  name: string;
  age?: string;
  grade?: string;
  achievement: string;
  quote: string;
  program: string;
  image?: string;
}

export interface SteamProgramHighlight {
  icon: string;
  title: string;
  description: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  color: string;
}

export interface SteamLearningOutcome {
  category: string;
  outcomes: string[];
  icon: string;
}

export interface SteamData {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
  };
  programs: {
    title: string;
    subtitle: string;
    items: SteamProgram[];
  };
  features: SteamFeature[];
  successStories: SteamSuccessStory[];
  programHighlights: SteamProgramHighlight[];
  learningOutcomes: SteamLearningOutcome[];
  cta: {
    title: string;
    subtitle: string;
    primaryButton?: string;
    secondaryButton?: string;
    primaryCta?: string;
    secondaryCta?: string;
  };
}

interface SteamState {
  loading: boolean;
  error: string | null;
  data: SteamData | null;
}

const initialState: SteamState = {
  loading: false,
  error: null,
  data: null,
};

const steamSlice = createSlice({
  name: 'steam',
  initialState,
  reducers: {
    fetchSteamRequested(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSteamSucceeded(state, action: PayloadAction<SteamData>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchSteamFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchSteamRequested, fetchSteamSucceeded, fetchSteamFailed } = steamSlice.actions;
export default steamSlice.reducer;
