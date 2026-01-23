import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, BookOpen, CheckCircle, Target, Users, Clock, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'How to Choose the Right Summer Camp for Your Child: A Parent\'s Guide | GrowWise', 
    description: 'A comprehensive guide to selecting the perfect summer camp experience for your child. Find camps that match interests, learning goals, and personality.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'How to Choose the Right Summer Camp for Your Child', url: `${baseUrl}/${locale}/growwise-blogs/how-to-choose-the-right-summer-camp-for-your-child-a-parents-guide` },
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
                <span>May 27, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span>1:00 am</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              How to Choose the Right Summer Camp for Your Child: A Parent's Guide
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                Choosing the right summer camp for your child can feel overwhelming, but it doesn't have to be. With so many programs out there, it's important to find a camp that matches your child's <strong>interests, learning goals, and personality</strong>.
              </p>

              <p className="text-gray-700 mb-8">
                Here's a quick guide to help you make the best choice for a meaningful and memorable summer.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Identify Your Goals</h2>

              <p className="text-gray-700 mb-6">
                Start by asking:
              </p>

              <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg my-6">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Do you want your child to stay ahead academically?</li>
                  <li>Are you looking to nurture creativity or confidence?</li>
                  <li>Is your child eager to explore <strong>STEM, art, or coding</strong>?</li>
                </ul>
              </div>

              <p className="text-gray-700 mb-8">
                Your goals will determine whether an <strong>academic summer camp</strong>, a <strong>sports camp</strong>, or a <strong>tech-focused camp</strong> is the right fit.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Match the Camp to Your Child's Interests</h2>

              <p className="text-gray-700 mb-6">
                Summer is the perfect time for your child to:
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-[#F16112] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Explore new skills</h3>
                  <p className="text-gray-700 text-sm">
                    Like game development, creative writing, or public speaking
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <BookOpen className="w-8 h-8 text-[#1F396D] mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Reinforce school subjects</h3>
                  <p className="text-gray-700 text-sm">
                    Like math or reading comprehension
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Discover passions</h3>
                  <p className="text-gray-700 text-sm">
                    Through hands-on projects
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-8">
                Choose a camp that blends <strong>fun with growth</strong>, and watch your child thrive!
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Look for Small Groups and Quality Instructors</h2>

              <p className="text-gray-700 mb-6">
                Low student-to-teacher ratios mean more <strong>personalized attention</strong>.<br />
                Experienced, passionate instructors can make learning exciting and engaging, especially in camps that focus on coding, AI, or academic enrichment.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Check the Schedule and Flexibility</h2>

              <p className="text-gray-700 mb-6">
                Make sure the camp:
              </p>

              <div className="space-y-4 my-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-[#1F396D] mt-1" />
                  <p className="text-gray-700">Fits your family's summer schedule</p>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-[#F16112] mt-1" />
                  <p className="text-gray-700">Offers part-time or full-day options</p>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-green-600 mt-1" />
                  <p className="text-gray-700">Has flexible drop-off/pick-up times (especially helpful for working parents)</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Go Local and Trusted (DON'T JOIN THE RACE)</h2>

              <p className="text-gray-700 mb-6">
                Look for camps near you that have:
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-yellow-50 p-6 rounded-lg text-center">
                  <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                  <p className="font-semibold text-gray-800">Positive reviews</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <MapPin className="w-8 h-8 text-[#1F396D] mx-auto mb-3" />
                  <p className="font-semibold text-gray-800">Strong local presence</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <p className="font-semibold text-gray-800">Real success stories</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Encourage Creativity Through Game Design</h2>

              <p className="text-gray-700 mb-8">
                If you're in Dublin, CA, check out <strong>GrowWise Summer Camp</strong>—offering high-quality, engaging programs in <strong>math mastery, Roblox coding, web development, and AI/ML</strong> for Grades K–12.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">FAQ's on Summer Camp 2025</h2>

              <div className="space-y-6 my-8">
                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">How do I choose the right summer camp for my child?</h3>
                  <p className="text-gray-700">
                    Start by identifying your goals. Are you looking to boost academics, build confidence, or explore new interests like coding or public speaking? Once you know what you want your child to gain, you can match them with a camp that aligns with their goals and personality.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">What types of camps are best for kids interested in STEM or coding?</h3>
                  <p className="text-gray-700">
                    Tech-focused camps such as those offering game development, coding, or AI projects are ideal. Look for programs that provide hands-on learning with experienced instructors and small group sizes for more personalized attention.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">My child struggles with math and reading—can a summer camp help?</h3>
                  <p className="text-gray-700">
                    Yes! Academic summer camps can reinforce key subjects like math, reading comprehension, and writing in a fun, low-pressure environment. These camps are designed to help kids catch up or get ahead while enjoying their summer.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">What skills will my child gain besides coding?</h3>
                  <p className="text-gray-700 mb-2">
                    Students will build:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Problem-solving and logical thinking</strong></li>
                    <li><strong>Creative design and storytelling</strong></li>
                    <li><strong>Communication and collaboration</strong></li>
                    <li><strong>Digital entrepreneurship through Robux monetization</strong></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">How important is the student-to-teacher ratio in summer camps?</h3>
                  <p className="text-gray-700">
                    Very important. A low student-to-teacher ratio ensures your child gets individualized support and stays engaged. It also allows instructors to better understand and respond to your child's learning style.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">What should I consider about scheduling and flexibility?</h3>
                  <p className="text-gray-700">
                    Choose a camp that fits your summer schedule and offers flexibility, especially if you're a working parent. Many camps offer part-time, full-day, or weekly enrollment options, along with convenient drop-off and pick-up windows.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">Should I pick a popular camp or look for local options?</h3>
                  <p className="text-gray-700">
                    It's best to choose a <strong>trusted local camp</strong> with a strong reputation and positive parent reviews rather than just following trends. Look for real success stories, consistent programming, and a camp that understands your community's needs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1F396D] mb-2">How do I register my child?</h3>
                  <p className="text-gray-700">
                    Visit our Summer Camp 2025 page to view dates, locations, and registration options. Spots are limited, so we encourage early sign-up.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Conclusion</h2>

              <h3 className="text-2xl font-bold text-[#1F396D] mb-4">Make Summer Count with the Right Camp Choice</h3>

              <p className="text-gray-700 mb-6">
                Choosing the right <strong>summer camp for your child</strong> is about more than just keeping them busy—it's about unlocking their potential. Whether you're looking for <strong>academic enrichment</strong>, a <strong>coding camp for kids</strong>, or a place where your child can explore new skills in a supportive setting, the right program can make a lasting impact.
              </p>

              <p className="text-gray-700 mb-6">
                By aligning the camp experience with your child's <strong>interests, personality, and learning goals</strong>, you're giving them the chance to build confidence, develop essential life skills, and return to school more prepared and motivated. From <strong>STEM and literacy camps</strong> to creative and public speaking programs, today's camps offer so much more than fun—they offer <strong>future-ready learning in a personalized environment</strong>.
              </p>

              <p className="text-gray-700 mb-8">
                Don't just choose the most popular camp—choose the one that's the right fit for your child. A thoughtful decision today can lead to a <strong>transformative summer experience</strong> that helps your child grow academically, socially, and emotionally.
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Enroll Today and Unlock Your Kid's Potential!
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

