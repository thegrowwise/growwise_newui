'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

/**
 * Redux shell for the app (header, cart, etc.).
 * Global `content` slice fetch was removed: nothing in the tree selected `state.content`,
 * so every page paid for an API round-trip and saga work for unused data.
 */
export default function ContentProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
