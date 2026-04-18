import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/i18n/localeConfig';
import { publicPath } from '@/lib/publicPath';

/** Non-locale paths redirect into `[locale]`; skip static path generation for this catch-all. */
export const dynamic = 'force-dynamic';

export default async function CatchAllRedirectPage({
  params,
}: {
  params: Promise<{ catchAll?: string[] }>;
}) {
  const { catchAll } = await params;
  const rest = Array.isArray(catchAll) ? catchAll.join('/') : '';
  const path = rest ? `/${rest}` : '/';
  redirect(publicPath(path, DEFAULT_LOCALE));
}
