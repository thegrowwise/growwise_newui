import type { HomeContentData } from '@/store/slices/homeSlice';
import path from 'path';
import fs from 'fs';

/**
 * Server-only: read initial home data from static JSON for the home page.
 * Enables hero (LCP) to render in first paint without waiting for client fetch.
 */
export function getHomeDataServer(locale: string): HomeContentData | null {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'api',
      'mock',
      locale,
      'home.json'
    );
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as HomeContentData;
  } catch {
    return null;
  }
}
