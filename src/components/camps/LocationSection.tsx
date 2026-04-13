import type { CampLandingPage } from "@/lib/camps/camp-types";
import { CONTACT_INFO } from "@/lib/constants";
import { MapPin } from "lucide-react";

import { SectionContainer } from "./SectionContainer";
import { ServiceAreaStrip } from "./ServiceAreaStrip";

type LocationSectionProps = {
  page: CampLandingPage;
};

const MAPS_QUERY = encodeURIComponent(`${CONTACT_INFO.street}, ${CONTACT_INFO.city} ${CONTACT_INFO.zipCode}`);

export function LocationSection({ page }: LocationSectionProps) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

  return (
    <SectionContainer id="location" className="bg-white border-t border-slate-100">
      <div className="max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">Location</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">Dublin campus (single location)</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          GrowWise operates one physical campus. Nearby cities are served areas families travel from—not separate GrowWise campuses and not substitute addresses.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <div className="flex gap-3">
              <MapPin className="h-6 w-6 text-[#1F396D] shrink-0" aria-hidden />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Campus address</h3>
                <address className="mt-2 not-italic text-slate-700 leading-relaxed">
                  {CONTACT_INFO.street}
                  <br />
                  {CONTACT_INFO.city} {CONTACT_INFO.zipCode}
                </address>
                <a
                  href={mapsHref}
                  className="mt-4 inline-flex text-sm font-semibold text-[#1F396D] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] rounded-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Driving context</h3>
              <ul className="mt-3 space-y-3">
                {page.driveTimes.map((d) => (
                  <li key={d.areaLabel} className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800">{d.areaLabel}: </span>
                    {d.description}
                  </li>
                ))}
              </ul>
            </div>
            <ServiceAreaStrip page={page} />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
