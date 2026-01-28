import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, Code, Linkedin, TrendingUp, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/blogs/why-learning-java-coding-is-impressive-on-your-linkedin-profile.webp'
// Option 2: S3 image: getS3ImageUrl('images/blogs/why-learning-java-coding-is-impressive-on-your-linkedin-profile.webp')
const BLOG_IMAGE_URL = '/images/blogs/learning-java-is-good-for-linkedin.jpg'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'Why Learning Java Coding is Impressive on Your LinkedIn Profile | GrowWise', 
    description: 'Java remains a powerful and widely-used programming language. See how Java skills can make your LinkedIn profile stand out.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'Why Learning Java Coding is Impressive on Your LinkedIn Profile', url: `${baseUrl}/${locale}/growwise-blogs/why-learning-java-coding-is-impressive-on-your-linkedin-profile` },
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
              alt="Why Learning Java Coding is Impressive on Your LinkedIn Profile"
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
                <span>November 8, 2024</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Why Learning Java Coding is Impressive on Your LinkedIn Profile
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                Java remains one of the most powerful and widely-used programming languages in the industry. Having Java skills on your LinkedIn profile can significantly boost your professional presence and attract opportunities from top employers.
              </p>

              <p className="text-gray-700 mb-8">
                Discover why Java coding skills make your LinkedIn profile stand out and how they can advance your career.
              </p>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="Why Learning Java Coding is Impressive on Your LinkedIn Profile"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Java is Still Relevant</h2>

              <p className="text-gray-700 mb-6">
                Java continues to be a cornerstone of enterprise software development:
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Code className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Enterprise Standard</h3>
                  <p className="text-gray-700 text-sm">
                    Used by major corporations worldwide for large-scale applications.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <Linkedin className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">High Demand</h3>
                  <p className="text-gray-700 text-sm">
                    Consistently ranked among the most in-demand programming languages.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Versatile</h3>
                  <p className="text-gray-700 text-sm">
                    Powers everything from mobile apps to enterprise systems.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">How Java Skills Enhance Your LinkedIn Profile</h2>

              <p className="text-gray-700 mb-6">
                Java skills on your LinkedIn profile demonstrate:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Technical expertise</strong> in a proven, enterprise-grade language</li>
                <li><strong>Problem-solving abilities</strong> through object-oriented programming</li>
                <li><strong>Industry relevance</strong> in finance, healthcare, and technology sectors</li>
                <li><strong>Career readiness</strong> for high-paying software development roles</li>
                <li><strong>Professional credibility</strong> that attracts recruiters and employers</li>
              </ul>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Make Your LinkedIn Profile Stand Out with Java Skills
                </p>
                <p className="mb-6">
                  Learn Java with GrowWise and enhance your professional profile. Start your journey today.
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

