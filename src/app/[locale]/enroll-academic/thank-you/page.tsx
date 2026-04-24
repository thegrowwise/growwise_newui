import { getFormThankYouContent } from '@/data/form-thank-you/getFormThankYouContent';
import { FormThankYouView } from '@/components/form-thank-you/FormThankYouView';

export default async function EnrollAcademicThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getFormThankYouContent('enroll-academic', locale);
  return <FormThankYouView content={content} locale={locale} />;
}
