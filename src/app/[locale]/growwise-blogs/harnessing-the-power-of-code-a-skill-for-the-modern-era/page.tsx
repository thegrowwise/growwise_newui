import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, Code, Zap, Globe, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/blogs/harnessing-the-power-of-code-a-skill-for-the-modern-era.webp'
// Option 2: S3 image: getS3ImageUrl('images/blogs/harnessing-the-power-of-code-a-skill-for-the-modern-era.webp')
const BLOG_IMAGE_URL = '/images/blogs/harnessingthepower.webp' // or use getS3ImageUrl('images/blogs/harnessing-the-power-of-code-a-skill-for-the-modern-era.webp') for S3

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'Harnessing the Power of Code: A Skill for the Modern Era | GrowWise', 
    description: 'Explore why coding has become an essential skill in today\'s digital world and how it opens doors to innovation and opportunity.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'Harnessing the Power of Code: A Skill for the Modern Era', url: `${baseUrl}/${locale}/growwise-blogs/harnessing-the-power-of-code-a-skill-for-the-modern-era` },
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
              alt="Harnessing the Power of Code: A Skill for the Modern Era"
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
                <span>October 15, 2024</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Harnessing the Power of Code: A Skill for the Modern Era
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                In today's digital world, coding has evolved from a niche technical skill to an essential literacy. Understanding code is no longer just for computer scientists – it's becoming fundamental for success across industries and careers.
              </p>

              <p className="text-gray-700 mb-8">
                Explore why coding has become an essential skill in today's digital world and how it opens doors to innovation and opportunity.
              </p>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="Harnessing the Power of Code: A Skill for the Modern Era"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Coding Matters in the Modern Era</h2>

              <p className="text-gray-700 mb-6">
                Coding is the language of the digital age. From websites to mobile apps, from artificial intelligence to automation, code powers nearly everything we interact with daily.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Globe className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Digital Literacy</h3>
                  <p className="text-gray-700 text-sm">
                    Understanding code helps you navigate and understand the digital world around you.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <Zap className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Problem-Solving</h3>
                  <p className="text-gray-700 text-sm">
                    Coding teaches logical thinking and systematic problem-solving approaches.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Career Opportunities</h3>
                  <p className="text-gray-700 text-sm">
                    Coding skills open doors to high-demand, well-paying careers.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Coding Across Industries</h2>

              <p className="text-gray-700 mb-6">
                Coding skills are valuable far beyond traditional tech companies:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Healthcare</strong> – Medical software, data analysis, health informatics</li>
                <li><strong>Finance</strong> – Algorithmic trading, fintech applications, data modeling</li>
                <li><strong>Education</strong> – Learning platforms, educational tools, EdTech solutions</li>
                <li><strong>Entertainment</strong> – Game development, streaming platforms, digital media</li>
                <li><strong>Manufacturing</strong> – Automation, robotics, quality control systems</li>
              </ul>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">The Future is Coded</h2>

              <p className="text-gray-700 mb-6">
                As technology continues to advance, coding skills become even more critical. Artificial intelligence, machine learning, automation, and the Internet of Things all rely on code. Those who understand coding will be better positioned to:
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-6 rounded-lg my-6">
                <ul className="list-disc list-inside space-y-2">
                  <li>Adapt to technological changes</li>
                  <li>Create innovative solutions</li>
                  <li>Understand and leverage new technologies</li>
                  <li>Build tools that solve real-world problems</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Start Your Coding Journey Today
                </p>
                <p className="mb-6">
                  Learn coding with GrowWise and harness the power of code for the modern era. Build skills that will serve you for a lifetime.
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

