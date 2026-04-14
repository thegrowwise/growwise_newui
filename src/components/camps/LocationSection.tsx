import type { CampLandingPage } from "@/lib/camps/camp-types";
import { CONTACT_INFO } from "@/lib/constants";
import { MapPin } from "lucide-react";

import { SectionContainer } from "./SectionContainer";

type LocationSectionProps = {
  page: CampLandingPage;
};

const MAPS_QUERY = encodeURIComponent(`${CONTACT_INFO.street}, ${CONTACT_INFO.city} ${CONTACT_INFO.zipCode}`);

export function LocationSection({ page }: LocationSectionProps) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
  // No-key embed; lazy-loaded mid-page to minimize performance impact.
  const mapEmbedHref = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;

  return (
    <SectionContainer id="location" className="bg-white border-t border-slate-100">
      <div className="max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">Location</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">Dublin campus (single location)</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          GrowWise operates one physical campus. Nearby cities are served areas families travel from—not separate GrowWise campuses and not substitute addresses.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10 items-stretch">
          <div className="h-full rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <div className="flex gap-3">
              <MapPin className="h-6 w-6 text-[#1F396D] shrink-0" aria-hidden />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Campus address</h3>
                <address className="mt-2 not-italic text-slate-700 leading-relaxed">
                  {CONTACT_INFO.street}
                  <br />
                  {CONTACT_INFO.city} {CONTACT_INFO.zipCode}
                </address>

                {/* Lightweight, non-blocking map preview (mid-page, lazy-loaded). */}
                <div className="mt-5 overflow-hidden rounded-xl ring-1 ring-slate-200 bg-white">
                  <iframe
                    title="Map preview of GrowWise Dublin campus"
                    src={mapEmbedHref}
                    className="h-44 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
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

          <div className="h-full rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Driving context</h3>
            <ul className="mt-3 space-y-3">
              {page.driveTimes.map((d) => (
                <li key={d.areaLabel} className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">{d.areaLabel}: </span>
                  {d.description}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl px-4 py-4 sm:px-6 bg-slate-50/80 ring-1 ring-slate-200/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Families often join us from</p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Served cities and areas">
                {page.servedCities.map((c) => (
                  <li key={c.name}>
                    <span
                      className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-800 ring-1 ring-slate-200"
                      title={c.note}
                    >
                      {c.name}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                These are common Tri-Valley origins for families who enroll at GrowWise. Instruction occurs at our Dublin campus only—we do not operate additional physical campuses in other cities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
