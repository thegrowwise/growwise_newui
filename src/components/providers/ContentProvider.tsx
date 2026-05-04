'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

/**
 * Redux shell for the app (header, cart, etc.).
 * Global `content` Redux slice removed from production: nothing subscribed to it and
 * fetch was unused; saga + reducer are gone to shrink client JS on every route.
 */
export default function ContentProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
