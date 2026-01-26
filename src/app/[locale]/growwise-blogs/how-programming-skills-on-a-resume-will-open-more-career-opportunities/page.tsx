import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, FileText, Briefcase, TrendingUp, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/blogs/how-programming-skills-on-a-resume-will-open-more-career-opportunities.webp'
// Option 2: S3 image: getS3ImageUrl('images/blogs/how-programming-skills-on-a-resume-will-open-more-career-opportunities.webp')
const BLOG_IMAGE_URL = '\images\blogs\programming-skills-resume.jpg' // or use getS3ImageUrl('images/blogs/how-programming-skills-on-a-resume-will-open-more-career-opportunities.webp') for S3

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'How Programming Skills on a Resume Will Open More Career Opportunities | GrowWise', 
    description: 'Programming skills are increasingly valuable across industries. Learn how they can enhance your resume and career prospects.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'How Programming Skills on a Resume Will Open More Career Opportunities', url: `${baseUrl}/${locale}/growwise-blogs/how-programming-skills-on-a-resume-will-open-more-career-opportunities` },
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
              alt="How Programming Skills on a Resume Will Open More Career Opportunities"
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
                <span>December 5, 2024</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              How Programming Skills on a Resume Will Open More Career Opportunities
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                In today's competitive job market, programming skills are increasingly valuable across industries. Whether you're in tech, finance, healthcare, or marketing, coding abilities can significantly enhance your resume and open doors to new career opportunities.
              </p>

              <p className="text-gray-700 mb-8">
                Learn how programming skills can transform your career prospects and make you stand out to employers.
              </p>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="How Programming Skills on a Resume Will Open More Career Opportunities"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Programming Skills Matter</h2>

              <p className="text-gray-700 mb-6">
                Programming skills demonstrate valuable qualities that employers seek:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Problem-Solving Ability</h3>
                  <p className="text-gray-700 text-sm">
                    Coding shows you can break down complex problems and find solutions.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Technical Literacy</h3>
                  <p className="text-gray-700 text-sm">
                    Understanding technology is essential in our digital world.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <Briefcase className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Versatility</h3>
                  <p className="text-gray-700 text-sm">
                    Programming skills apply across multiple industries and roles.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Automation Skills</h3>
                  <p className="text-gray-700 text-sm">
                    Ability to automate tasks increases efficiency and value.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Career Opportunities Across Industries</h2>

              <p className="text-gray-700 mb-6">
                Programming skills open doors in various fields:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Technology</strong> – Software development, web development, data science</li>
                <li><strong>Finance</strong> – Algorithmic trading, financial modeling, fintech</li>
                <li><strong>Healthcare</strong> – Medical software, data analysis, health informatics</li>
                <li><strong>Marketing</strong> – Data analytics, automation, digital marketing tools</li>
                <li><strong>Education</strong> – EdTech development, learning platforms, educational tools</li>
              </ul>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Boost Your Resume with Programming Skills
                </p>
                <p className="mb-6">
                  Start learning programming today with GrowWise and unlock new career opportunities.
                </p>
                <Link href="/enroll">
                  <Button className="bg-white text-[#1F396D] hover:bg-gray-100 text-lg px-8 py-6">
                    Enroll Now
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

