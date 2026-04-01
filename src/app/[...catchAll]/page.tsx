import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/i18n/localeConfig';

export default async function CatchAllRedirectPage({
  params,
}: {
  params: Promise<{ catchAll?: string[] }>;
}) {
  const { catchAll } = await params;
  const rest = Array.isArray(catchAll) ? catchAll.join('/') : '';
  redirect(`/${DEFAULT_LOCALE}/${rest}`);
}

