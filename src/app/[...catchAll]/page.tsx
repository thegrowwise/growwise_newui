import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/i18n/localeConfig';
import { publicPath } from '@/lib/publicPath';

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
