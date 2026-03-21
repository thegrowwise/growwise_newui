/** Client page uses useSearchParams — force dynamic to avoid prerender/runtime 500s */
export const dynamic = 'force-dynamic';

export default function LotterySuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
