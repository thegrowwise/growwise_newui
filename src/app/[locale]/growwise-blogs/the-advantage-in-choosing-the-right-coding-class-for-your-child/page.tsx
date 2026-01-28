import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, Code, Target, Users, Lightbulb, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/blogs/the-advantage-in-choosing-the-right-coding-class-for-your-child.webp'
// Option 2: S3 image: getS3ImageUrl('images/blogs/the-advantage-in-choosing-the-right-coding-class-for-your-child.webp')
const BLOG_IMAGE_URL = '/images/blogs/coding-class-for-children.jpg' // or use getS3ImageUrl('images/blogs/the-advantage-in-choosing-the-right-coding-class-for-your-child.webp') for S3

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'The Advantage in Choosing the Right Coding Class for Your Child | GrowWise', 
    description: 'Learn how selecting the right coding class can set your child up for success in technology and future career opportunities.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'The Advantage in Choosing the Right Coding Class for Your Child', url: `${baseUrl}/${locale}/growwise-blogs/the-advantage-in-choosing-the-right-coding-class-for-your-child` },
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
              alt="The Advantage in Choosing the Right Coding Class for Your Child"
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
                <span>November 20, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <span>4:21 pm</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              The Advantage in Choosing the Right Coding Class for Your Child
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                Finding the right coding class can feel overwhelming. The advantage in choosing the right coding class for your child is significant. With numerous options, from online courses to in-person boot camps, it's easy to feel lost.
              </p>

              <p className="text-gray-700 mb-8">
                Get ready to have your uncertainties squared away – this guide arms you with the smarts to make a rock-solid decision.
              </p>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="The Advantage in Choosing the Right Coding Class for Your Child"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Coding Education Matters</h2>

              <p className="text-gray-700 mb-6">
                I've witnessed coding education's ability to totally flip a kid's perspective – and it's been incredible to see. What you learn when you code goes far beyond the classroom or cubicle – it's about honing problem-solving skills, building logical thinking, and developing creativity.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Problem-Solving</h3>
                  <p className="text-gray-700 text-sm">
                    Coding teaches children to break down complex problems into manageable steps.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <Lightbulb className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Creativity</h3>
                  <p className="text-gray-700 text-sm">
                    Building projects encourages creative thinking and innovation.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Future Skills</h3>
                  <p className="text-gray-700 text-sm">
                    Prepares children for careers in technology and beyond.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">What to Look for in a Coding Class</h2>

              <p className="text-gray-700 mb-6">
                When choosing a coding class for your child, consider these important factors:
              </p>

              <div className="space-y-4 my-6">
                <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Age-Appropriate Curriculum</h3>
                  <p className="text-gray-700">
                    The class should match your child's age and skill level, starting with visual programming for younger kids and progressing to text-based coding for older students.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-[#F16112] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Experienced Instructors</h3>
                  <p className="text-gray-700">
                    Look for teachers who are not only skilled programmers but also understand how to work with children and make learning fun.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Hands-On Projects</h3>
                  <p className="text-gray-700">
                    The best coding classes include real projects that children can build, share, and be proud of.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Small Class Sizes</h3>
                  <p className="text-gray-700">
                    Smaller groups ensure your child gets personalized attention and support when needed.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">The Benefits of Structured Learning</h2>

              <p className="text-gray-700 mb-6">
                While children can learn coding on their own through online tutorials, structured classes offer unique advantages:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Guided progression</strong> – Learning builds systematically from basics to advanced concepts</li>
                <li><strong>Peer interaction</strong> – Working with other students builds collaboration skills</li>
                <li><strong>Immediate feedback</strong> – Instructors can help troubleshoot problems right away</li>
                <li><strong>Accountability</strong> – Regular classes keep children engaged and motivated</li>
                <li><strong>Community</strong> – Being part of a coding class creates lasting friendships</li>
              </ul>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Choosing Between Online and In-Person</h2>

              <p className="text-gray-700 mb-6">
                Both online and in-person coding classes have their advantages:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-[#1F396D] mb-2">Online Classes</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li>Convenient and flexible</li>
                    <li>Access to global resources</li>
                    <li>Learn at your own pace</li>
                    <li>Often more affordable</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-bold text-[#1F396D] mb-2">In-Person Classes</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li>Direct interaction with instructors</li>
                    <li>Immediate help when stuck</li>
                    <li>Social learning environment</li>
                    <li>Structured schedule</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Find the Perfect Coding Class for Your Child
                </p>
                <p className="mb-6">
                  At GrowWise, we offer coding classes designed specifically for children, with age-appropriate curricula, experienced instructors, and hands-on projects that make learning fun.
                </p>
                <Link href="/enroll">
                  <Button className="bg-white text-[#1F396D] hover:bg-gray-100 text-lg px-8 py-6">
                    Explore Our Coding Classes
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

