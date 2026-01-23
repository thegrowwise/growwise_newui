import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Code, Brain, Target, Users, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'Embrace the Future of Technology: Elevate Your Coding Skills with GrowWise | GrowWise', 
    description: 'Discover how coding skills can transform your future and open doors to exciting career opportunities in technology. AI-powered learning platform for personalized coding education.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'Embrace the Future of Technology: Elevate Your Coding Skills with GrowWise', url: `${baseUrl}/${locale}/growwise-blogs/embrace-the-future-of-technology-advance-your-coding-expertise-with-growwise` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D] text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
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
                <span>February 14, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span>9:10 am</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Embrace the Future of Technology: Elevate Your Coding Skills with GrowWise
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                Technology is evolving faster than ever, and coding has become the foundation of innovation. But with so many languages, tools, and frameworks emerging, how can developers keep up?
              </p>

              <p className="text-gray-700 mb-8">
                Enter <strong>GrowWise</strong>—an AI-powered learning platform designed to personalize your coding journey, provide instant feedback, and accelerate your growth. Whether you're a beginner or a seasoned programmer, GrowWise ensures you stay ahead in the ever-changing world of technology.
              </p>

              <p className="text-gray-700 mb-8">
                Let's explore how this cutting-edge platform can transform the way you learn and master coding.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">AI-Powered Learning: Smarter, Faster, and Personalized</h2>

              <p className="text-gray-700 mb-6">
                Artificial Intelligence is reshaping education, making it more adaptive, efficient, and engaging. GrowWise leverages AI to:
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Brain className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Analyze Your Strengths</h3>
                  <p className="text-gray-700 text-sm">
                    Create a customized learning path based on your unique abilities and weaknesses.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <Zap className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Real-Time Feedback</h3>
                  <p className="text-gray-700 text-sm">
                    Get instant feedback so you can fix errors and improve your code immediately.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Hands-On Challenges</h3>
                  <p className="text-gray-700 text-sm">
                    Practice with coding challenges that simulate real-world programming scenarios.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-8">
                Instead of struggling through generic tutorials, GrowWise adapts to your unique learning style, ensuring you make progress faster than ever.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Tailored Learning Paths: Your Roadmap to Mastery</h2>

              <p className="text-gray-700 mb-6">
                GrowWise curates courses, exercises, and projects suited to your skill level, helping you master Python, JavaScript, AI, and cloud computing.
              </p>

              <div className="space-y-4 my-6">
                <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">New to coding?</h3>
                  <p className="text-gray-700">Start with beginner-friendly lessons and interactive exercises.</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-[#F16112] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Experienced developer?</h3>
                  <p className="text-gray-700">Dive into advanced projects and real-world applications.</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Exploring a new domain?</h3>
                  <p className="text-gray-700">Learn AI and cloud computing with structured courses designed by experts.</p>
                </div>
              </div>

              <p className="text-gray-700 mb-8">
                With a personalized learning path, you focus on what truly matters, ensuring <strong>efficient progress and skill mastery</strong>.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Real-Time Code Review: Instant Feedback, Instant Growth</h2>

              <p className="text-gray-700 mb-6">
                Struggling with debugging? GrowWise's AI-powered code analysis evaluates your code in real time, providing:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Optimization tips</strong> for cleaner, more efficient code</li>
                <li><strong>Error detection and explanations</strong> so you understand mistakes instantly</li>
                <li><strong>Best practices insights</strong> to help you write professional-grade programs</li>
              </ul>

              <p className="text-gray-700 mb-8">
                With AI as your coding mentor, you'll write better, faster, and bug-free code every time.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Learn by Doing: Hands-On Coding Challenges & Projects</h2>

              <p className="text-gray-700 mb-6">
                The best way to learn coding is by building, testing, and experimenting.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <Code className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Interactive Challenges</h3>
                  <p className="text-gray-700 text-sm">
                    Solve real-world problems and sharpen problem-solving skills.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Project-Based Learning</h3>
                  <p className="text-gray-700 text-sm">
                    Work on industry-level projects that prepare you for real coding jobs.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Hackathons</h3>
                  <p className="text-gray-700 text-sm">
                    Engage in coding battles, test your skills, and compete with others.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Stay Ahead of the Curve: Emerging Tech Courses</h2>

              <p className="text-gray-700 mb-6">
                The tech landscape is constantly evolving. GrowWise ensures you stay ahead by offering cutting-edge courses on:
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-6 rounded-lg my-6">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>AI and Machine Learning</strong> – Master TensorFlow, NLP, and deep learning</li>
                  <li><strong>Python</strong> – Beginner to Advanced level</li>
                  <li><strong>Cloud Computing</strong> – AWS, Azure, and modern infrastructure</li>
                  <li><strong>Web Development</strong> – Full-stack development with modern frameworks</li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Join a Thriving Developer Community</h2>

              <p className="text-gray-700 mb-6">
                Learning is better together. With GrowWise, you become part of a supportive, knowledge-sharing community.
              </p>

              <div className="space-y-4 my-6">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-[#1F396D] mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Peer-to-Peer Learning</h3>
                    <p className="text-gray-700">Connect with fellow developers and share insights.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Brain className="w-6 h-6 text-[#F16112] mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Mentorship and Career Support</h3>
                    <p className="text-gray-700">Get expert guidance on coding, projects, and job readiness.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Networking and Job Opportunities</h3>
                    <p className="text-gray-700">Engage with industry professionals and unlock career growth.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Ready to Elevate Your Coding Skills?
                </p>
                <p className="mb-6">
                  Join GrowWise today and start your personalized coding journey. Transform your future with AI-powered learning.
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

