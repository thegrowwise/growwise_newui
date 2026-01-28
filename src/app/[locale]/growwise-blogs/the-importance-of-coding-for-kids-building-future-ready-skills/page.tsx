import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, Code, Target, Brain, Rocket, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/blogs/the-importance-of-coding-for-kids-building-future-ready-skills.webp'
// Option 2: S3 image: getS3ImageUrl('images/blogs/the-importance-of-coding-for-kids-building-future-ready-skills.webp')
const BLOG_IMAGE_URL = '/images/blogs/importanceofcoding.png.webp' // or use getS3ImageUrl('images/blogs/the-importance-of-coding-for-kids-building-future-ready-skills.webp') for S3

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'The Importance of Coding for Kids: Building Future-Ready Skills | GrowWise', 
    description: 'Understand why coding education for children is crucial for developing problem-solving skills and preparing them for the future.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'The Importance of Coding for Kids: Building Future-Ready Skills', url: `${baseUrl}/${locale}/growwise-blogs/the-importance-of-coding-for-kids-building-future-ready-skills` },
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
              alt="The Importance of Coding for Kids: Building Future-Ready Skills"
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
                <span>September 25, 2024</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              The Importance of Coding for Kids: Building Future-Ready Skills
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                In an increasingly digital world, coding has become one of the most important skills children can learn. Understanding why coding education for children is crucial helps parents make informed decisions about their child's future.
              </p>

              <p className="text-gray-700 mb-8">
                Coding isn't just about writing code – it's about developing problem-solving skills, logical thinking, and creativity that will serve children throughout their lives.
              </p>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="The Importance of Coding for Kids: Building Future-Ready Skills"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Coding Matters for Kids</h2>

              <p className="text-gray-700 mb-6">
                Coding education provides children with essential skills that extend far beyond programming:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Brain className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Critical Thinking</h3>
                  <p className="text-gray-700 text-sm">
                    Coding teaches children to think logically and break down complex problems into manageable parts.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Problem-Solving</h3>
                  <p className="text-gray-700 text-sm">
                    Children learn to identify problems, develop solutions, and test their ideas systematically.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <Rocket className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Creativity</h3>
                  <p className="text-gray-700 text-sm">
                    Building projects encourages creative expression and innovation.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Persistence</h3>
                  <p className="text-gray-700 text-sm">
                    Debugging code teaches children to persevere through challenges.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Future-Ready Skills</h2>

              <p className="text-gray-700 mb-6">
                The jobs of tomorrow will require different skills than today. By learning to code, children are preparing for:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Technology careers</strong> – Software development, data science, AI engineering</li>
                <li><strong>Digital literacy</strong> – Understanding how technology works and how to use it effectively</li>
                <li><strong>Adaptability</strong> – Learning new tools and technologies as they emerge</li>
                <li><strong>Collaboration</strong> – Working with others on coding projects builds teamwork skills</li>
                <li><strong>Entrepreneurship</strong> – Coding skills enable children to build their own projects and startups</li>
              </ul>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">When to Start Learning</h2>

              <p className="text-gray-700 mb-6">
                Children can start learning coding concepts as early as elementary school. Age-appropriate tools make it fun and engaging:
              </p>

              <div className="space-y-4 my-6">
                <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Ages 5-8: Visual Programming</h3>
                  <p className="text-gray-700">
                    Tools like Scratch introduce coding concepts through drag-and-drop blocks, making it accessible and fun for young children.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-[#F16112] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Ages 9-12: Game Development</h3>
                  <p className="text-gray-700">
                    Platforms like Roblox Studio and Minecraft allow children to create games while learning coding fundamentals.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Ages 13+: Text-Based Coding</h3>
                  <p className="text-gray-700">
                    Older children can learn real programming languages like Python, JavaScript, or Java through structured courses.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Beyond Technical Skills</h2>

              <p className="text-gray-700 mb-6">
                Coding education provides benefits that extend beyond technical knowledge:
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-6 rounded-lg my-6">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Confidence</strong> – Successfully building projects boosts self-esteem</li>
                  <li><strong>Math skills</strong> – Coding reinforces mathematical concepts in practical ways</li>
                  <li><strong>Reading comprehension</strong> – Following code and documentation improves reading skills</li>
                  <li><strong>Attention to detail</strong> – Debugging teaches careful observation</li>
                  <li><strong>Communication</strong> – Explaining code to others improves communication skills</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Start Building Future-Ready Skills Today
                </p>
                <p className="mb-6">
                  At GrowWise, we offer coding classes designed specifically for children, helping them build the skills they'll need for the future while having fun.
                </p>
                <Link href="/enroll">
                  <Button className="bg-white text-[#1F396D] hover:bg-gray-100 text-lg px-8 py-6">
                    Explore Our Coding Programs
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

