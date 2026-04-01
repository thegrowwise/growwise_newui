import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Download, MessageSquare } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { BlogImage } from '@/components/blogs/BlogImage'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

const PDF_PATH = '/downloads/ThinkingGap_Playbook_for_parents.pdf'
const HERO_IMAGE = '/images/blogs/thinking-gap-classroom.webp'
const SLUG = '/growwise-blogs/thinking-gap-your-kids-arent-distracted'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  return generatePageMetadata({
    locale,
    path: SLUG,
    type: 'article',
    title: "Your Kids Aren't Distracted. They Were Never Taught How to Think. | GrowWise",
    description:
      "A classroom experiment at Fallon Middle School revealed something more troubling than screen addiction — and far more fixable than most parents realize. Learn how to identify a 'thinking gap' and download the free Parent Playbook.",
    keywords:
      'critical thinking for kids, thinking gap, parenting, middle school learning, Dublin CA, analytical thinking, education, screen time, problem solving',
  })
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function ThinkingGapBlogPostPage({ params }: PageProps) {
  const { locale } = await params

  const baseUrl = getCanonicalSiteUrl()
  const pageUrl = absoluteSiteUrl(SLUG, locale, baseUrl)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Blogs', url: absoluteSiteUrl('/growwise-blogs', locale, baseUrl) },
    { name: "Your Kids Aren't Distracted", url: pageUrl },
  ])

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: "Your Kids Aren't Distracted. They Were Never Taught How to Think.",
    description:
      "A classroom experiment at Fallon Middle School revealed something more troubling than screen addiction — and far more fixable than most parents realize.",
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: {
      '@type': 'Person',
      name: 'Dublin Parent & Career Speaker',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GrowWise',
      url: baseUrl,
    },
    about: ['Education', 'Critical Thinking', 'Parenting', 'Analytical Skills'],
    keywords: ['Critical Thinking', 'Middle School', 'Dublin CA', 'Parenting', 'Thinking Gap', 'Education'],
    relatedLink: [`${baseUrl}${PDF_PATH}`],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D] text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <BlogImage
              src={HERO_IMAGE}
              alt="Middle school students in a classroom learning how to think instead of just avoiding distraction."
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Link href="/growwise-blogs" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>

            <div className="text-xs tracking-[0.2em] uppercase text-white/70 mb-3">Dublin, CA · Education &amp; Parenting · The Thinking Gap Series</div>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#F16112] font-semibold mb-4">
              <span>Opinion &amp; Insight</span>
              <span className="w-9 h-0.5 bg-[#F16112] rounded" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Your Kids Aren&apos;t Distracted.
              <br />
              <span className="italic text-[#7EE7E7]">They Were Never Taught How to Think.</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-white/80 italic max-w-3xl">
              A classroom experiment at Fallon Middle School revealed something more troubling than screen addiction — and far more fixable than most parents realize.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="font-semibold text-white/90">Dublin Parent &amp; Career Speaker</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>8 min read</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Education · Critical Thinking · Parenting</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F16112] px-5 py-3 font-semibold text-white hover:bg-[#F1894F] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download the Free Parent Playbook (PDF)
              </a>
              <a
                href="#what-you-can-do"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Jump to action steps
              </a>
            </div>
          </div>
        </section>

        {/* Article */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-7 md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1F396D] prose-a:text-[#F16112] prose-a:font-semibold">
                <p>
                  A few weeks ago, I spent the day at Fallon Middle School as a career speaker. Instead of a standard lecture, I ran a &quot;Problem-to-App&quot; workshop — a live
                  exercise where students had to think through a real-world problem and design a solution from scratch. No instructions. No template. Just a problem and forty minutes.
                </p>

                <p>
                  What I saw split cleanly into two groups. One group locked in almost immediately. Within forty minutes, they had mapped a user persona, identified a core problem, and
                  sketched a complete app concept. It was genuine innovation — and it was exciting to watch.
                </p>

                <p>
                  The second group struggled — not because they weren&apos;t smart or motivated, but because they didn&apos;t know <em>how to start</em>. They couldn&apos;t move from
                  one step to the next without a nudge. They kept waiting for a correct answer that wasn&apos;t coming.
                </p>

                <div className="my-10 border-l-4 border-[#F16112] pl-6">
                  <p className="text-xl italic text-[#1F396D] leading-relaxed m-0">
                    &quot;It wasn&apos;t a focus problem. It was a thinking gap — and the difference between the two changes everything about how we respond as parents.&quot;
                  </p>
                </div>

                <h2>The Framing We&apos;ve Been Getting Wrong</h2>
                <div className="h-1 w-12 bg-[#F16112] rounded mb-6" />

                <p>
                  When I shared this observation publicly on Nextdoor, the response was overwhelming — hundreds of parents in our community recognized it immediately. But one rebuttal
                  kept appearing, including from AI tools like ChatGPT: that children aren&apos;t <em>losing</em> analytical skills due to distraction. Rather, they were <em>never
                  taught</em> these skills in the first place.
                </p>

                <p>Here&apos;s the thing: that&apos;s not a contradiction. It&apos;s a clarification — and an important one.</p>

                <p>
                  Both framings are partially true. The strongest version holds both at once: passive consumption — hours of algorithmically curated content, step-by-step YouTube
                  tutorials, AI-generated answers — hasn&apos;t just distracted children from thinking. It has <strong>occupied the developmental space where analytical thinking was
                  supposed to be built.</strong> The skill was never installed because there was never a gap in the stimulation long enough for it to grow.
                </p>
              </div>

              <div className="mt-8 rounded-xl bg-gradient-to-br from-[#1F396D] to-[#253d6a] p-7">
                <div className="text-xs tracking-[0.2em] uppercase font-semibold text-[#F16112] mb-2">The Core Insight</div>
                <p className="text-white/90 leading-relaxed m-0">
                  Screen time didn&apos;t steal analytical thinking from our kids. It filled the space where that thinking was supposed to develop. It&apos;s not that the skill was
                  lost — it&apos;s that it was never given room to grow.
                </p>
              </div>

              <div className="prose prose-lg max-w-none mt-10 prose-headings:font-bold prose-headings:text-[#1F396D]">
                <h2>What the Research Actually Says</h2>
                <div className="h-1 w-12 bg-[#F16112] rounded mb-6" />

                <p>This isn&apos;t just a classroom observation. The data is consistent across educational research.</p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-xl overflow-hidden bg-gray-200">
                <div className="bg-white p-6 text-center">
                  <div className="text-4xl font-extrabold text-[#2A7F7F] leading-none">77%</div>
                  <div className="mt-2 text-xs text-gray-500 font-medium">
                    Increase in jobs requiring complex analytical skills since 1980 <span className="italic">(Pew Research)</span>
                  </div>
                </div>
                <div className="bg-white p-6 text-center">
                  <div className="text-4xl font-extrabold text-[#2A7F7F] leading-none">↓</div>
                  <div className="mt-2 text-xs text-gray-500 font-medium">
                    Negative correlation between heavy AI usage and independent critical thinking <span className="italic">(Gerlich, 2025)</span>
                  </div>
                </div>
                <div className="bg-white p-6 text-center">
                  <div className="text-4xl font-extrabold text-[#2A7F7F] leading-none">99%</div>
                  <div className="mt-2 text-xs text-gray-500 font-medium">
                    Of college faculty say critical thinking is essential — yet most schooling doesn&apos;t explicitly teach it
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mt-10 prose-headings:font-bold prose-headings:text-[#1F396D]">
                <p>
                  A 2025 review in <em>Frontiers in Education</em> found that education systems worldwide continue to prioritize memorization and standardized testing over analytical
                  thinking development — meaning most students are never explicitly taught how to break a complex problem into smaller parts.
                </p>
                <p>
                  A separate study on AI&apos;s cognitive impact found a measurable negative correlation between frequent AI tool usage and independent reasoning ability. Offloading
                  thinking — even to useful tools — comes with a real cognitive cost when it replaces the practice of thinking entirely.
                </p>
                <p>
                  Perhaps most telling: research on students&apos; tolerance for ambiguity shows that students raised in environments focused on finding the single &quot;right answer&quot;
                  develop a measurably lower tolerance for the open-ended situations where critical thinking actually lives. If a child has only ever been asked to select from multiple
                  choice, they will freeze when there isn&apos;t one.
                </p>

                <h2>Focus Problem vs. Thinking Gap — How to Tell</h2>
                <div className="h-1 w-12 bg-[#F16112] rounded mb-6" />

                <p>
                  This distinction matters enormously for how you respond. A child who can&apos;t focus needs one kind of support. A child who was never taught to think needs a completely
                  different one. Treating the wrong root cause wastes time and quietly erodes confidence.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden bg-gray-200">
                <div className="bg-[#E8F4F4] p-6">
                  <div className="text-xs tracking-[0.15em] uppercase font-semibold text-[#2A7F7F] mb-3">Focus / Attention Issue</div>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>Struggles across all task types</li>
                    <li>Can&apos;t focus even on preferred activities</li>
                    <li>Consistent across all environments</li>
                    <li>May benefit from medical or behavioral support</li>
                    <li>Pattern doesn&apos;t change with structure</li>
                  </ul>
                </div>
                <div className="bg-[#FEF3E8] p-6">
                  <div className="text-xs tracking-[0.15em] uppercase font-semibold text-[#E87722] mb-3">Thinking Gap</div>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>Struggles specifically on open-ended tasks</li>
                    <li>Can focus for hours on games or structured work</li>
                    <li>Task-specific — not environment-wide</li>
                    <li>Improves quickly when given the right framework</li>
                    <li>Often misread as laziness or distraction</li>
                  </ul>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mt-10 prose-headings:font-bold prose-headings:text-[#1F396D]">
                <p>
                  The child who plays Minecraft for four hours straight but cannot start a school project isn&apos;t attention-deficient. They&apos;re structure-dependent — they need the
                  environment to do the thinking for them. That is a thinking gap, and it responds well to the right kind of practice.
                </p>
              </div>

              <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#1F396D] to-[#253d6a] p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="text-5xl leading-none">📋</div>
                <div className="flex-1">
                  <div className="text-white text-xl font-bold">Free Parent Playbook — Download &amp; Share</div>
                  <p className="mt-2 text-white/70 text-sm leading-relaxed">
                    I&apos;ve put together a full PDF playbook with a diagnostic checklist, a root cause framework, and 10 at-home exercises. Designed to share — no signup required.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={PDF_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#F16112] px-4 py-2 text-sm font-semibold text-white hover:bg-[#F1894F] transition-colors"
                    >
                      Get the Free Playbook →
                    </a>
                    <span className="text-xs italic text-white/50">PDF download (no signup)</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mt-10 prose-headings:font-bold prose-headings:text-[#1F396D]">
                <h2>Why This Is Actually Good News</h2>
                <div className="h-1 w-12 bg-[#F16112] rounded mb-6" />

                <p>
                  Here is what gave me the most hope in that Fallon classroom: when I gave the struggling group the right structure — a simple framework for breaking a problem into steps —
                  something shifted visibly. Students who had been paralyzed started moving. Not perfectly, but genuinely. The thinking was happening.
                </p>

                <p>
                  Research on adolescent cognitive development is clear: the analytical capabilities essential for modern success need to be stimulated, especially during the middle school
                  years. The window is real — but it is not closed. Analytical thinking is a learnable skill. It responds to practice exactly the way a muscle responds to resistance
                  training.
                </p>

                <div className="my-10 border-l-4 border-[#F16112] pl-6">
                  <p className="text-xl italic text-[#1F396D] leading-relaxed m-0">
                    &quot;The students who thrived weren&apos;t smarter. They had simply been given more opportunities to struggle productively — and taught that struggle was part of the
                    process, not a sign of failure.&quot;
                  </p>
                </div>

                <h3 id="what-you-can-do">What you can do starting this week</h3>

                <p>
                  You don&apos;t need a tutoring center to start closing the thinking gap. Ask your child to explain something they just learned as if you were six years old. Pick a real
                  household problem and ask them to name three possible solutions and evaluate the tradeoffs. Resist the urge to give hints the moment they pause. That pause <em>is</em>{' '}
                  the work.
                </p>

                <p>
                  In a world where AI can answer almost any question instantly, the rarest and most valuable skill will be knowing how to ask the right question in the first place — and
                  having the patience to build toward the answer.
                </p>
              </div>

              <div className="mt-8 rounded-xl bg-[#E8F4F4] p-7">
                <div className="text-xs tracking-[0.2em] uppercase font-semibold text-[#2A7F7F] mb-2">Take the Next Step</div>
                <p className="text-gray-800 leading-relaxed m-0">
                  The free <strong>Thinking Gap Parent Playbook</strong> has a 10-sign diagnostic checklist, the three root cause framework, and 10 at-home exercises you can start this
                  week.
                </p>
                <div className="mt-4">
                  <a
                    href={PDF_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#F16112] hover:text-[#F1894F]"
                  >
                    <Download className="w-4 h-4" />
                    Download the Playbook (PDF)
                  </a>
                </div>
              </div>

              <div className="mt-10 rounded-2xl bg-[#1F396D] p-8 text-center">
                <div className="text-white text-2xl font-bold">Is your child experiencing a thinking gap?</div>
                <p className="mt-3 text-white/70 text-sm max-w-xl mx-auto">
                  I&apos;m happy to have a no-pressure conversation about your child&apos;s specific situation — whether or not it involves my programs.
                </p>
                <div className="mt-6 flex justify-center gap-3 flex-wrap">
                  <a
                    href="/enroll"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F16112] px-6 py-3 font-semibold text-white hover:bg-[#F1894F] transition-colors"
                  >
                    Send a DM →
                  </a>
                  <a
                    href={PDF_PATH}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Get the Playbook
                  </a>
                </div>
              </div>

              <div className="mt-10 text-sm text-gray-500 italic leading-relaxed">
                <strong>References:</strong> Pew Research Center (2016) — The State of American Jobs; Gerlich, M. (2025) — AI tools and independent reasoning; Frontiers in Education —
                Systematic review, analytical thinking in K–12 (2025); PMC — Determining factors for critical thinking development (2025); IE University — AI&apos;s cognitive implications
                (2024).
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap gap-2">
                {[
                  'Critical Thinking',
                  'Middle School',
                  'Dublin CA',
                  'Parenting',
                  'Analytical Skills',
                  'Thinking Gap',
                  'Education',
                ].map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-full bg-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/growwise-blogs" className="inline-flex items-center text-[#F16112] hover:text-[#F1894F] font-semibold transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Blogs
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

