import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, Code, TrendingUp, Target, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/blogs/why-learning-python-is-your-fast-track-to-in-demand-job-offers.webp'
// Option 2: S3 image: getS3ImageUrl('images/blogs/why-learning-python-is-your-fast-track-to-in-demand-job-offers.webp')
const BLOG_IMAGE_URL = 'images\blogs\coding-in-python.jpg.webp'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'Why Learning Python is Your Fast Track to In-Demand Job Offers | GrowWise', 
    description: 'Python is one of the most sought-after programming languages. Discover why it\'s the key to unlocking career opportunities and in-demand job offers.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'Why Learning Python is Your Fast Track to In-Demand Job Offers', url: `${baseUrl}/${locale}/growwise-blogs/why-learning-python-is-your-fast-track-to-in-demand-job-offers` },
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
              alt="Why Learning Python is Your Fast Track to In-Demand Job Offers"
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
                <span>March 10, 2025</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Why Learning Python is Your Fast Track to In-Demand Job Offers
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                Python is one of the most sought-after programming languages in today's job market. From data science to web development, AI to automation, Python skills open doors to countless career opportunities.
              </p>

              <p className="text-gray-700 mb-8">
                Discover why Python is the key to unlocking in-demand job offers and how learning this versatile language can accelerate your career growth.
              </p>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="Why Learning Python is Your Fast Track to In-Demand Job Offers"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Python is in High Demand</h2>

              <p className="text-gray-700 mb-6">
                Python's popularity isn't just a trend—it's a reflection of its versatility and power across multiple industries:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Code className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Data Science & Analytics</h3>
                  <p className="text-gray-700 text-sm">
                    Python is the go-to language for data analysis, machine learning, and AI development.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <Briefcase className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Web Development</h3>
                  <p className="text-gray-700 text-sm">
                    Frameworks like Django and Flask make Python perfect for building scalable web applications.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Automation & Scripting</h3>
                  <p className="text-gray-700 text-sm">
                    Python excels at automating repetitive tasks and streamlining workflows.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">AI & Machine Learning</h3>
                  <p className="text-gray-700 text-sm">
                    Libraries like TensorFlow and PyTorch make Python essential for AI development.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Career Opportunities with Python</h2>

              <p className="text-gray-700 mb-6">
                Python skills open doors to high-paying roles across various industries:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Data Scientist</strong> – Analyze data and build predictive models</li>
                <li><strong>Software Engineer</strong> – Develop applications and systems</li>
                <li><strong>Machine Learning Engineer</strong> – Build and deploy AI models</li>
                <li><strong>Web Developer</strong> – Create dynamic websites and applications</li>
                <li><strong>Automation Engineer</strong> – Streamline business processes</li>
              </ul>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Ready to Start Your Python Journey?
                </p>
                <p className="mb-6">
                  Join GrowWise and learn Python from beginner to advanced level. Unlock career opportunities with in-demand skills.
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

