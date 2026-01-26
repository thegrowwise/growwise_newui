import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, BookOpen, CheckCircle, AlertCircle, TrendingUp, Target, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/firstBlog.webp'
// Option 2: S3 image: getS3ImageUrl('images/firstBlog.webp')
const BLOG_IMAGE_URL = '/images/firstBlog.webp' // or use getS3ImageUrl('images/firstBlog.webp') for S3

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'Why U.S. Kids Are Falling Behind in Math and English — and How Parents Can Help | GrowWise', 
    description: 'Understanding the challenges and solutions for improving student performance in core subjects. Learn how regular assessments help parents spot problem areas early and rebuild confidence.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'Why U.S. Kids Are Falling Behind in Math and English', url: `${baseUrl}/${locale}/growwise-blogs/us-kids-falling-behind-math-english-parent-assessments` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D] text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Cover Image Background */}
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <BlogImage
              src={BLOG_IMAGE_URL}
              alt="NAEP Achievement Scores showing declining trends in Math and Reading"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="relative max-w-4xl mx-auto z-10">
            <Link 
              href="/growwise-blogs" 
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>
            <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Anshika Verma</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>October 8, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span>11:10 am</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Why U.S. Kids Are Falling Behind in Math and English — and How Parents Can Help
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                When your child brings home a low grade in math or English, it's more than a number — it hurts. You see their confidence fade, homework turns into tears, and you wonder, <em>"Where did we go wrong?"</em>
              </p>

              <p className="text-gray-700 mb-6">
                Across the U.S., millions of children are falling behind — not from lack of ability, but because small learning gaps go unnoticed until they become big obstacles. Studies show that post-pandemic, students in grades 3–8 are scoring significantly lower in math and reading than before.
              </p>

              <p className="text-gray-700 mb-8">
                The result? Anxious kids. Frustrated parents. Mounting pressure to catch up.
              </p>

              <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 my-8 rounded-r-lg">
                <p className="text-gray-800 font-semibold mb-2">
                  But there's hope.
                </p>
                <p className="text-gray-700">
                  <strong>Regular, low-stress assessments</strong> help parents spot problem areas early, track progress, and rebuild confidence — before it's too late. Because knowing where your child stands today is the first step toward helping them thrive tomorrow.
                </p>
              </div>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="Twelfth Grade NAEP Achievement Scores: 2015-2024 showing declining trends in Math and Reading proficiency, with a mother and daughter studying at a table"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">The Eye-Opening Truth</h2>

              <p className="text-gray-700 mb-6">
                In 2024, only <strong>35% of high-school seniors</strong> were proficient in reading, and just <strong>22%</strong> in math. Even more troubling, <strong>45% scored below basic</strong> in math. At the middle-school level, about <strong>1 in 3 eighth-graders</strong> couldn't reach basic reading proficiency — numbers confirmed by the latest <em>National Assessment of Educational Progress (NAEP)</em> report.
              </p>

              <p className="text-gray-700 mb-6">
                Behind those statistics are real children sitting at kitchen tables, struggling to finish homework they don't truly understand. Many parents are surprised to learn their honor-roll child is <em>below grade level</em> when they take an external benchmark test or apply for an advanced course.
              </p>

              <p className="text-gray-700 mb-6">
                So what went wrong?
              </p>

              <p className="text-gray-700 mb-8">
                America's academic challenge isn't just about lost class time during the pandemic. It's about <strong>visibility</strong>. Parents no longer see graded tests; teachers rarely have time for detailed feedback; schools increasingly rely on digital platforms that show only a single letter grade.
              </p>

              <p className="text-gray-700 mb-6">
                Without test papers in hand, parents can't see <em>how</em> their child reasoned, where errors occurred, or what skills need reinforcement. Grades have become summaries, not stories.
              </p>

              <blockquote className="border-l-4 border-[#F16112] pl-6 py-4 my-8 bg-orange-50 rounded-r-lg">
                <p className="text-gray-800 italic text-lg">
                  "When we can't see the process, we can't guide the progress."
                </p>
              </blockquote>

              <p className="text-gray-700 mb-8">
                That's where <strong>regular assessments</strong>—short, skill-based, independent checks—become essential. They reveal what's happening beneath the surface, turning invisible learning gaps into visible action plans.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">The Transparency Gap</h2>

              <p className="text-gray-700 mb-6">
                Just a decade ago, a child brought home every quiz and worksheet. Parents could flip through the pages and notice patterns—missed steps in long division, confusion over fractions, skipped punctuation.
              </p>

              <p className="text-gray-700 mb-6">
                Today, many schools have stopped sending those papers home. Why?
              </p>

              <ol className="list-decimal pl-6 space-y-4 mb-8 text-gray-700">
                <li>
                  <strong>Privacy Regulations (FERPA & digital compliance)</strong><br />
                  Schools must protect student data. As grading systems moved online, districts interpreted privacy laws conservatively—limiting paper circulation and detailed sharing.
                </li>
                <li>
                  <strong>Standardization and Efficiency</strong><br />
                  Teachers upload grades into learning-management systems designed for analytics, not transparency. Parents see "85 percent – Proficient," but the item-level data stays locked behind district firewalls.
                </li>
                <li>
                  <strong>Administrative Overload</strong><br />
                  With large class sizes and testing schedules, teachers often don't have capacity to photocopy, scan, or explain individual results. The system favors speed over insight.
                </li>
              </ol>

              <p className="text-gray-700 mb-6">
                The result? A <strong>communication blackout</strong>.<br />
                Parents who used to understand <em>why</em> a child lost points now receive only a digital report card. Conversations shift from learning ("How did you solve this?") to logistics ("Why is your grade low?").
              </p>

              <p className="text-gray-700 mb-8">
                This lack of visibility has a quiet cost. Kids internalize confusion as failure. Parents misinterpret grades as progress. Teachers feel pressure to "move on" even when mastery hasn't been reached.
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
                <p className="text-gray-800 font-semibold">
                  When <strong>transparency disappears</strong>, <strong>trust erodes</strong>.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">The Broken Parent–Teacher Ecosystem</h2>

              <p className="text-gray-700 mb-6">
                Education works best as a triangle—<strong>student, teacher, parent</strong>. Each side supports the other. But over time, that triangle has warped.
              </p>

              <ul className="list-disc pl-6 space-y-3 mb-8 text-gray-700">
                <li><strong>Teachers</strong> are burdened with administrative tasks, standardized testing goals, and limited instructional minutes. Personalized communication becomes a luxury.</li>
                <li><strong>Parents</strong> rely on sparse online dashboards that show numbers but not narratives.</li>
                <li><strong>Students</strong> float between both worlds, receiving fragmented messages: "Study harder" at home, "Move to the next unit" at school.</li>
              </ul>

              <p className="text-gray-700 mb-6">
                This disconnect creates what educators call <strong>"feedback voids."</strong> Without concrete feedback loops, small misunderstandings compound into significant academic decline.
              </p>

              <p className="text-gray-700 mb-6">
                In English classes, a child might misinterpret theme vs. main idea for months because no one caught it early. In math, forgetting integer-sign rules can derail algebraic reasoning for years.
              </p>

              <p className="text-gray-700 mb-6">
                Add to this the mental-health toll:<br />
                Many students' anxiety stems not from difficulty but from <strong>ambiguity</strong>. When they don't understand <em>why</em> they're wrong, stress replaces curiosity.
              </p>

              <blockquote className="border-l-4 border-[#F16112] pl-6 py-4 my-8 bg-orange-50 rounded-r-lg">
                <p className="text-gray-800 italic text-lg">
                  The real source of many students' stress isn't workload—it's confusion.
                </p>
              </blockquote>

              <p className="text-gray-700 mb-8">
                Parents see symptoms—tears during homework, declining confidence, resistance to reading—but the root is often hidden learning gaps.
              </p>

              <p className="text-gray-700 mb-8">
                That's why rebuilding the parent-teacher ecosystem starts with one principle: <strong>shared visibility.</strong> Everyone involved in a child's education should know exactly what's improving and what's lagging.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Understanding Regular Assessments</h2>

              <p className="text-gray-700 mb-6">
                When parents hear the word <em>assessment</em>, they often picture a long, stressful exam.<br />
                But in effective learning systems, <strong>regular assessments</strong> are not tests—they are <strong>check-ins</strong>.
              </p>

              <p className="text-gray-700 mb-6">
                Think of them as the academic equivalent of a doctor's routine health check: short, diagnostic, and preventive.
              </p>

              <p className="text-gray-700 mb-4">
                There are three main types parents should understand:
              </p>

              <ol className="list-decimal pl-6 space-y-4 mb-8 text-gray-700">
                <li>
                  <strong>Diagnostic Assessments</strong> – Given at the start of a unit or program, they identify baseline strengths and weaknesses.<br />
                  <em>Example:</em> A 6th-grader might score well in geometry but struggle with fractions—vital information before starting pre-algebra.
                </li>
                <li>
                  <strong>Formative Assessments</strong> – Small, frequent quizzes or activities that show progress in real time.<br />
                  <em>Example:</em> A quick comprehension check after each reading passage reveals whether vocabulary, inference, or main idea needs focus.
                </li>
                <li>
                  <strong>Summative Assessments</strong> – Broader end-of-term evaluations that confirm mastery after instruction.
                </li>
              </ol>

              <p className="text-gray-700 mb-6">
                The most powerful tools are the first two, because they help teachers and parents adjust early—<strong>before small gaps widen into lasting deficits</strong>.
              </p>

              <blockquote className="border-l-4 border-[#F16112] pl-6 py-4 my-8 bg-orange-50 rounded-r-lg">
                <p className="text-gray-800 italic text-lg">
                  Regular assessments turn the unknown into the knowable—and the knowable into a clear action plan.
                </p>
              </blockquote>

              <p className="text-gray-700 mb-8">
                Unlike standardized tests, they measure <em>growth</em>, not comparison. Each score becomes a data point in your child's personal learning story.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">How Regular Assessments Reduce Stress and Build Confidence</h2>

              <p className="text-gray-700 mb-6">
                Many parents worry that extra assessments will overwhelm their child.<br />
                In truth, the opposite is usually true.
              </p>

              <p className="text-gray-700 mb-6">
                Children feel calmer when expectations are clear and progress is visible.<br />
                When they see improvement—<em>"I got 6 out of 10 last week, and 8 this week!"</em>—their brains associate learning with reward, not fear.
              </p>

              <p className="text-gray-700 mb-6">
                Research from the <em>American Educational Research Association</em> shows that <strong>students who receive timely feedback perform up to 30 percent better</strong> than those who only receive grades at term's end. Immediate feedback activates motivation centers in the brain, reinforcing positive study habits.
              </p>

              <p className="text-gray-700 mb-6">
                In GrowWise classrooms and online sessions, teachers use micro-assessments that take <strong>five to seven minutes</strong>.<br />
                They're designed to feel like quick challenges or puzzles, not tests. The results feed into personalized dashboards where both parent and teacher can see:
              </p>

              <ul className="list-disc pl-6 space-y-2 mb-8 text-gray-700">
                <li>Mastered skills (green)</li>
                <li>Emerging skills (yellow)</li>
                <li>At-risk skills (red)</li>
              </ul>

              <p className="text-gray-700 mb-8">
                When a child sees progress visualized, anxiety melts into ownership.<br />
                Confidence doesn't come from perfection—it comes from <strong>proof of growth</strong>.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">How GrowWise Is Re-Imagining Academic Feedback</h2>

              <p className="text-gray-700 mb-6">
                At <strong>GrowWise</strong>, we believe education should come first and business second — which means transparency, not transactions.
              </p>

              <p className="text-gray-700 mb-6">
                Our <strong>student assessment ecosystem</strong> helps parents, teachers, and students stay connected through three core principles.
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-[#1F396D]">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-3">Clarity for Parents</h3>
                  <p className="text-gray-700">
                    Each diagnostic report is written in clear, parent-friendly language. Parents can see exactly which learning standards their child has mastered, which are developing, and which need more targeted practice.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-[#F16112]">
                  <h3 className="text-xl font-bold text-[#F16112] mb-3">Continuity for Students</h3>
                  <p className="text-gray-700">
                    Every assessment automatically updates the learner's personalized path. When a student improves in fractions but struggles with ratios, the next module adapts instantly. This ensures continuous growth and individualized learning for every child.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                  <h3 className="text-xl font-bold text-green-800 mb-3">Collaboration with Teachers</h3>
                  <p className="text-gray-700">
                    Teachers meet weekly to review anonymized performance trends. If data shows that 40 percent of seventh-graders missed proportional reasoning questions, lesson plans are adjusted to strengthen those skills across the class.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-8">
                GrowWise's <strong>digital progress reports</strong> combine human insight with AI analytics. Our algorithms highlight not only what went wrong but also why, revealing common issues such as conceptual gaps, reading stamina challenges, or patterns of careless mistakes.
              </p>

              <p className="text-gray-700 mb-8">
                Parents can log in anytime to track real-time progress, without waiting for report cards or grading cycles. GrowWise restores the transparency schools need—without the paperwork.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Parent Action Plan: Five Steps to Support Your Child</h2>

              <ol className="list-decimal pl-6 space-y-4 mb-8 text-gray-700">
                <li>
                  <strong>Schedule Regular Check-Ins</strong><br />
                  Every 6–8 weeks, arrange a short assessment in math and English. It keeps the feedback loop active.
                </li>
                <li>
                  <strong>Look Beyond Grades</strong><br />
                  Ask: <em>Which sub-skills are strong? Where does fluency drop?</em> Growth charts tell a fuller story than report cards.
                </li>
                <li>
                  <strong>Balance Academics and Activities</strong><br />
                  If you notice stress or fatigue, scale back. One sport and one STEM or creative activity are plenty. Every skill needs practice time to show results.
                </li>
                <li>
                  <strong>Discuss Mistakes Positively</strong><br />
                  Treat errors as clues, not failures. Model curiosity: <em>"What made this problem tricky?"</em>
                </li>
                <li>
                  <strong>Collaborate, Don't Compare</strong><br />
                  Each child's path is unique. Regular assessments are mirrors, not scoreboards.
                </li>
              </ol>

              <p className="text-gray-700 mb-8">
                When parents take these steps, learning becomes less about pressure and more about partnership.
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8">
                <p className="text-lg mb-4">
                  GrowWise launched a monthly (<strong>Last week of the month</strong>) initiative offering free assessments to elementary and Middle School students. Feel free to enroll your child:
                </p>
                <Link href="/enroll-academic">
                  <Button className="bg-white text-[#1F396D] hover:bg-gray-100">
                    Enroll Now - K-12 Courses
                  </Button>
                </Link>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">FAQs</h2>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Why did schools stop returning test papers?</h3>
                  <p className="text-gray-700">
                    Mostly due to privacy (FERPA) and the shift to digital grading systems. Districts interpret data-sharing rules cautiously, so parents see summaries instead of itemized results.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">How often should my child take independent assessments?</h3>
                  <p className="text-gray-700">
                    Every 6–8 weeks is ideal—often enough to notice trends but not intrusive.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Will frequent testing increase anxiety?</h3>
                  <p className="text-gray-700">
                    Not when designed properly. Short, low-stakes assessments build familiarity and confidence.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Are GrowWise assessments aligned with school standards?</h3>
                  <p className="text-gray-700">
                    Yes. They mirror California Common Core and local district pacing guides (DUSD / PUSD), ensuring direct relevance.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Can assessments predict future performance?</h3>
                  <p className="text-gray-700">
                    They reveal trends that strongly correlate with future success—especially in foundational areas like computation fluency and reading comprehension.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">What's the difference between diagnostic and progress assessments?</h3>
                  <p className="text-gray-700">
                    Diagnostics show where learning begins; progress assessments track how far a student has moved since.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">What if my child resists being tested?</h3>
                  <p className="text-gray-700">
                    Explain that it's not about grades—it's about discovering <em>how their brain learns best.</em> Pair each session with positive reinforcement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">How do I register my child?</h3>
                  <p className="text-gray-700">
                    <Link href="/enroll-academic" className="text-[#F16112] hover:underline font-semibold">
                      Enroll Now-K-12-Courses
                    </Link>
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Conclusion: Rebuilding Trust Through Transparency</h2>

              <p className="text-gray-700 mb-6">
                The parent-teacher ecosystem may be strained, but it's not broken beyond repair.<br />
                We need new bridges—ones built on data, empathy, and consistent feedback.
              </p>

              <p className="text-gray-700 mb-6">
                Grades tell us <em>what happened.</em><br />
                Assessments tell us <em>why it happened—and what to do next.</em>
              </p>

              <p className="text-gray-700 mb-6">
                Every child deserves that clarity. Every parent deserves that insight.<br />
                Regular assessments aren't about adding pressure; they're about <strong>giving visibility back to families</strong>.
              </p>

              <blockquote className="border-l-4 border-[#F16112] pl-6 py-4 my-8 bg-orange-50 rounded-r-lg">
                <p className="text-gray-800 italic text-lg mb-2">
                  The more we understand, the better we can guide.
                </p>
                <p className="text-gray-800 italic text-lg">
                  The sooner we measure, the faster we can close the gap.
                </p>
              </blockquote>

              <p className="text-gray-700 mb-8">
                At GrowWise, we stand with parents and teachers who believe learning is a journey, not a mystery.
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  🎯 Book a Free Assessment at GrowWise
                </p>
                <p className="mb-6">
                  Let's track progress, uncover potential, and help your child move forward—confidently and clearly.
                </p>
                <Link href="/book-assessment">
                  <Button className="bg-white text-[#1F396D] hover:bg-gray-100 text-lg px-8 py-6">
                    Book Assessment
                  </Button>
                </Link>
              </div>

            </div>

            {/* Back to Blogs Link */}
            <div className="mt-8 text-center">
              <Link 
                href="/growwise-blogs" 
                className="inline-flex items-center text-[#F16112] hover:text-[#F1894F] font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Blogs
              </Link>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enroll Today and Unlock Your Kid's Potential!
            </h2>
            <Link
              href="/enroll"
              className="inline-flex items-center gap-2 mt-6 px-8 py-4 bg-white text-[#1F396D] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Enroll Now
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

