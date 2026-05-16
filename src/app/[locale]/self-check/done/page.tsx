import { ArrowLeft, CheckCircle2, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CONTACT_INFO } from '@/lib/constants';

export default function SelfCheckDonePage() {
  const workshopUrl = process.env.NEXT_PUBLIC_WORKSHOP_BOOKING_URL ?? 'https://calendly.com/growwise/workshop';
  const phoneHref = `tel:+1${CONTACT_INFO.phone.replace(/\D/g, '')}`;

  return (
    <main className="min-h-screen page-bg-coding flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F396D]">
            You&#39;re all set. ✅
          </h1>
          <p className="text-gray-600 leading-relaxed">
            The report has been sent to your email.
            Check your inbox — it should arrive within 2 minutes.
          </p>
        </div>

        {/* Inbox note */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5 flex items-start gap-3">
            <Mail className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-0.5">Didn&#39;t get it?</p>
              <p>Check your spam folder or call us at{' '}
                <a href={phoneHref} className="font-semibold underline">{CONTACT_INFO.phone}</a>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Workshop CTA */}
        <Card className="border-[#F16112]/30 bg-[#F16112]/[0.04]">
          <CardContent className="p-6 space-y-3 text-center">
            <p className="font-bold text-[#1F396D] text-lg">Want to fix the pattern?</p>
            <p className="text-sm text-gray-600">
              Book a free 30-minute workshop with a GrowWise teacher.
            </p>
            <a
              href={workshopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#F16112] hover:bg-[#d54f0a] text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors shadow-md w-full sm:w-auto"
            >
              Book My Free Workshop →
            </a>
          </CardContent>
        </Card>

        {/* Footer links */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <a
            href="/self-check"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1F396D] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Self-Check
          </a>
          <a
            href={phoneHref}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1F396D] transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            {CONTACT_INFO.phone}
          </a>
        </div>

      </div>
    </main>
  );
}
