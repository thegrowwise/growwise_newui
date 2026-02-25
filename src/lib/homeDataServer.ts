/**
 * Server-only: fetch home page content for the given locale.
 * Used to provide initial data for LCP so the hero renders on first paint.
 */
import type { HomeContentData } from '@/store/slices/homeSlice';
import { readFile } from 'fs/promises';
import path from 'path';

export async function getHomeDataServer(locale: string): Promise<HomeContentData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'api', 'mock', locale, 'home.json');
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as HomeContentData;
  } catch {
    try {
      const fallbackPath = path.join(process.cwd(), 'public', 'api', 'mock', 'en', 'home.json');
      const raw = await readFile(fallbackPath, 'utf-8');
      return JSON.parse(raw) as HomeContentData;
    } catch {
      return null;
    }
  }
}
