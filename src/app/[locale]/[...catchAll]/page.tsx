import { notFound } from 'next/navigation';

/** Locale-scoped unknown paths → 404. Force dynamic so dev/build do not run static-path workers for this sink (avoids spawn EBADF on some macOS setups). */
export const dynamic = 'force-dynamic';

export default function CatchAllPage() {
  notFound();
}
