import { getFormThankYouContent } from '@/data/form-thank-you/getFormThankYouContent';
import { FormThankYouView } from '@/components/form-thank-you/FormThankYouView';

export default async function EnrollThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = getFormThankYouContent('enroll', locale);
  return <FormThankYouView content={content} locale={locale} />;
}
