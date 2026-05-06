/** Plain-text crawl hints for LLMs — fixed host URLs per product spec. */

const BODY = `# GrowWise School

> K-12 tutoring and STEAM enrichment in Dublin, CA. Math, English, coding, AI, robotics, SAT prep, and summer camps for Grades 1–12 in the Tri-Valley.

## Programs
- [Academic (Math & English)](https://www.growwiseschool.org/academic)
- [STEAM (Coding, AI, Game Dev)](https://www.growwiseschool.org/steam)
- [Summer Camps](https://www.growwiseschool.org/camps/summer)
- [SAT Prep](https://www.growwiseschool.org/courses/sat-prep)
- [Workshops](https://www.growwiseschool.org/workshop-calendar)

## Info
- [About](https://www.growwiseschool.org/about)
- [Contact](https://www.growwiseschool.org/contact)
- [Blog](https://www.growwiseschool.org/growwise-blogs)

Location: 4564 Dublin Blvd, Dublin, CA 94568
Phone: (925) 456-4606
Serving: Dublin, Pleasanton, San Ramon, Livermore
`

export async function GET(): Promise<Response> {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

export const dynamic = 'force-dynamic'
