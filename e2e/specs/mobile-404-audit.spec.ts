import { test, expect, devices } from '@playwright/test';
import { readdir } from 'fs/promises';
import { join, relative, sep } from 'path';

test.use({ ...devices['iPhone 14'] });

function extractPathsFromSitemap(xml: string): string[] {
  const paths: string[] = [];
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let match: RegExpExecArray | null;

  while ((match = locRegex.exec(xml)) !== null) {
    try {
      const url = new URL(match[1]);
      paths.push(url.pathname + url.search);
    } catch {
      // ignore malformed URLs
    }
  }

  // Dedupe while preserving order
  return Array.from(new Set(paths));
}

async function collectStaticAppPaths(): Promise<string[]> {
  const appRoot = join(process.cwd(), 'src', 'app');
  const results: string[] = [];

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        // Skip API routes folder
        if (e.name === 'api') continue;
        await walk(full);
        continue;
      }
      if (!e.isFile()) continue;
      if (e.name !== 'page.tsx' && e.name !== 'page.jsx' && e.name !== 'page.ts' && e.name !== 'page.js') continue;

      const rel = relative(appRoot, full);
      const parts = rel.split(sep);

      // Drop the trailing page file
      parts.pop();

      // Convert app folder segments to URL segments
      const urlParts: string[] = [];
      let isDynamic = false;

      for (const p of parts) {
        // ignore route groups
        if (p.startsWith('(') && p.endsWith(')')) continue;

        // Default locale has no URL prefix (matches publicPath / localePrefix: 'never')
        if (p === '[locale]') {
          continue;
        }

        // skip any dynamic segments for this audit
        if (p.startsWith('[') && p.endsWith(']')) {
          isDynamic = true;
          break;
        }

        urlParts.push(p);
      }

      if (isDynamic) continue;

      const path = '/' + urlParts.join('/');
      results.push(path);
    }
  }

  await walk(appRoot);

  // Dedupe + stable order
  return Array.from(new Set(results)).sort();
}

test('Audit: no sitemap pages 404 on mobile', async ({ request, baseURL }) => {
  test.setTimeout(12 * 60 * 1000); // sitemap can be large; keep this generous

  const origin = baseURL ?? 'http://localhost:3000';
  const sitemapUrl = new URL('/sitemap.xml', origin).toString();

  let paths: string[] = [];

  try {
    let sitemapRes = await request.get(sitemapUrl);
    // Some setups may redirect; follow once if needed
    if (sitemapRes.status() >= 300 && sitemapRes.status() < 400) {
      const loc = sitemapRes.headers()['location'];
      if (loc) sitemapRes = await request.get(new URL(loc, origin).toString());
    }

    const status = sitemapRes.status();
    const sitemapXml = await sitemapRes.text();

    if (status >= 200 && status < 300) {
      paths = extractPathsFromSitemap(sitemapXml).filter((p) => {
        if (p === '/sitemap.xml' || p === '/robots.txt' || p === '/icon.png') return false;
        return true;
      });
    }
  } catch {
    // ignore sitemap failure, fallback to filesystem discovery
  }

  // Fallback: derive static routes directly from src/app if sitemap is unavailable in dev
  if (paths.length === 0) {
    paths = await collectStaticAppPaths();
  }

  expect(paths.length, 'No paths found in sitemap').toBeGreaterThan(0);

  const notFound: Array<{ path: string; status: number | null }> = [];
  const userAgent = devices['iPhone 14'].userAgent;

  for (const path of paths) {
    await test.step(`GET ${path}`, async () => {
      const url = new URL(path, origin).toString();
      const res = await request.get(url, {
        maxRedirects: 5,
        headers: userAgent ? { 'user-agent': userAgent } : undefined,
      });
      const status = res.status();
      if (status === 404) notFound.push({ path, status });
    });
  }

  const list = notFound.map((x) => `${x.path} (${x.status})`).join('\n');
  expect(notFound, `404s found on mobile sitemap audit:\n${list || '(none)'}`).toHaveLength(0);
});

