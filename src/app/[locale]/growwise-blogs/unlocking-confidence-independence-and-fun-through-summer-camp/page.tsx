import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Heart, Shield, Lightbulb, Users, Star, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'Unlocking Confidence, Independence, and Fun Through Summer Camp | GrowWise', 
    description: 'Discover how summer camps can help children develop essential life skills while having fun. Build confidence, independence, and social skills through engaging camp experiences.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'Unlocking Confidence, Independence, and Fun Through Summer Camp', url: `${baseUrl}/${locale}/growwise-blogs/unlocking-confidence-independence-and-fun-through-summer-camp` },
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
                <span>June 15, 2025</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Unlocking Confidence, Independence, and Fun Through Summer Camp
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                Summer camp is more than just a way to keep kids busy during break—it's a transformative experience that builds essential life skills. From <strong>confidence and independence</strong> to <strong>social connections and problem-solving</strong>, camps provide a unique environment where children can grow while having fun.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Building Confidence Through Achievement</h2>

              <p className="text-gray-700 mb-6">
                One of the most powerful benefits of summer camp is the confidence boost children experience. Away from familiar environments, kids tackle new challenges and discover capabilities they didn't know they had.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <Target className="w-8 h-8 text-[#1F396D] mx-auto mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Setting Goals</h3>
                  <p className="text-gray-700 text-sm">
                    Camps help children set and achieve personal goals, building self-esteem with each accomplishment.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <Star className="w-8 h-8 text-[#F16112] mx-auto mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Recognition</h3>
                  <p className="text-gray-700 text-sm">
                    Positive reinforcement from counselors and peers helps children see their own value and strengths.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">New Skills</h3>
                  <p className="text-gray-700 text-sm">
                    Learning new activities—from coding to sports—shows kids they can master anything with effort.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Fostering Independence</h2>

              <p className="text-gray-700 mb-6">
                Summer camp provides a safe space for children to practice independence away from home. This experience is crucial for developing self-reliance and decision-making skills.
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg my-6">
                <h3 className="text-xl font-bold text-[#1F396D] mb-3">Making Choices</h3>
                <p className="text-gray-700 mb-4">
                  At camp, children make daily decisions about activities, friendships, and how to spend their time. This autonomy builds confidence in their judgment.
                </p>
                <p className="text-gray-700">
                  <strong>Example:</strong> Choosing between coding workshop or outdoor activities teaches kids to understand their preferences and make informed decisions.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg my-6">
                <h3 className="text-xl font-bold text-[#1F396D] mb-3">Self-Care Skills</h3>
                <p className="text-gray-700">
                  Managing their own schedule, keeping track of belongings, and taking responsibility for their actions are all skills that transfer to school and home life.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Social Skills and Friendship</h2>

              <p className="text-gray-700 mb-6">
                Camp brings together children from diverse backgrounds, creating opportunities for meaningful friendships and social growth.
              </p>

              <div className="space-y-4 my-6">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-[#1F396D] mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Teamwork</h3>
                    <p className="text-gray-700">Group activities and projects teach collaboration, communication, and compromise.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-[#F16112] mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Empathy</h3>
                    <p className="text-gray-700">Living and working closely with others helps children understand different perspectives and develop compassion.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Conflict Resolution</h3>
                    <p className="text-gray-700">Camp counselors guide children through disagreements, teaching healthy ways to resolve conflicts.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Academic Benefits in Disguise</h2>

              <p className="text-gray-700 mb-6">
                While camps feel like pure fun, they're actually reinforcing academic skills:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-bold text-[#1F396D] mb-2">Problem-Solving</h3>
                  <p className="text-gray-700 text-sm">
                    Whether debugging code or planning a group project, camp activities require critical thinking and creative solutions.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-[#1F396D] mb-2">Communication</h3>
                  <p className="text-gray-700 text-sm">
                    Presenting projects, explaining ideas, and working in teams all build verbal and written communication skills.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-[#1F396D] mb-2">Time Management</h3>
                  <p className="text-gray-700 text-sm">
                    Camp schedules teach children to prioritize tasks and manage their time effectively.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-bold text-[#1F396D] mb-2">Resilience</h3>
                  <p className="text-gray-700 text-sm">
                    Facing challenges and learning from mistakes builds perseverance and a growth mindset.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">The Fun Factor: Why It Matters</h2>

              <p className="text-gray-700 mb-6">
                The "fun" in summer camp isn't just entertainment—it's a crucial component of effective learning. When children enjoy what they're doing, they're more engaged, retain information better, and develop positive associations with learning.
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-6 rounded-lg my-8">
                <p className="font-semibold mb-2">Research shows:</p>
                <p>
                  Children learn best when they're having fun. The positive emotions associated with enjoyable activities enhance memory, creativity, and motivation to learn more.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Choosing the Right Camp Experience</h2>

              <p className="text-gray-700 mb-6">
                To maximize the benefits of confidence, independence, and fun, choose a camp that:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li>Matches your child's interests and learning style</li>
                <li>Offers a balance of structure and free choice</li>
                <li>Has experienced, supportive counselors</li>
                <li>Provides opportunities for both individual achievement and teamwork</li>
                <li>Creates a safe, inclusive environment</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg my-8">
                <p className="text-gray-800 font-semibold mb-2">
                  <strong>Parent Tip:</strong> Look for camps that offer a mix of activities. Programs that combine academics (like coding or math) with creative and social activities provide the most well-rounded growth experience.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Long-Term Impact</h2>

              <p className="text-gray-700 mb-6">
                The skills children develop at summer camp don't disappear when camp ends. They carry these experiences back to school, home, and future endeavors:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1F396D] pl-6">
                  <h3 className="font-bold text-[#1F396D] mb-2">Improved School Performance</h3>
                  <p className="text-gray-700">Increased confidence and problem-solving skills translate to better academic performance.</p>
                </div>

                <div className="border-l-4 border-[#F16112] pl-6">
                  <h3 className="font-bold text-[#1F396D] mb-2">Better Social Skills</h3>
                  <p className="text-gray-700">Children who attend camp often show improved ability to work with peers and adults.</p>
                </div>

                <div className="border-l-4 border-green-600 pl-6">
                  <h3 className="font-bold text-[#1F396D] mb-2">Increased Resilience</h3>
                  <p className="text-gray-700">Camp experiences help children handle challenges and setbacks with greater confidence.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Conclusion</h2>

              <p className="text-gray-700 mb-6">
                Summer camp is an investment in your child's future. Beyond the fun memories, camps provide experiences that build confidence, foster independence, and develop social skills that last a lifetime.
              </p>

              <p className="text-gray-700 mb-8">
                Whether your child is interested in coding, academics, sports, or creative activities, there's a camp experience that can unlock their potential while ensuring they have an amazing summer.
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Ready to Give Your Child an Unforgettable Summer Experience?
                </p>
                <p className="mb-6">
                  Explore GrowWise Summer Camp programs designed to build confidence, independence, and essential life skills while having fun!
                </p>
                <Link href="/camps/winter">
                  <Button className="bg-white text-[#1F396D] hover:bg-gray-100 text-lg px-8 py-6">
                    Explore Summer Camps
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

