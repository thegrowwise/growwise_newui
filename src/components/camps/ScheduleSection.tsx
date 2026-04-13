import type { CampLandingPage } from "@/lib/camps/camp-types";

import { SectionContainer } from "./SectionContainer";

type ScheduleSectionProps = {
  page: CampLandingPage;
};

export function ScheduleSection({ page }: ScheduleSectionProps) {
  return (
    <SectionContainer id="schedule" className="bg-white border-t border-slate-100">
      <div className="max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">Schedule & enrollment flow</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">How the week is organized</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Specific dates and daily hours are confirmed during enrollment. What stays consistent is structure: preparation, guided work, and review.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl ring-1 ring-slate-200">
          <table className="min-w-full border-collapse text-left text-sm">
            <caption className="sr-only">Schedule and enrollment details for this camp</caption>
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Topic
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {page.scheduleRows.map((row) => (
                <tr key={row.label} className="border-t border-slate-200 bg-white">
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-slate-700">
                    <div className="font-medium text-slate-900">{row.primary}</div>
                    {row.detail ? <div className="mt-1 text-slate-600">{row.detail}</div> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionContainer>
  );
}
