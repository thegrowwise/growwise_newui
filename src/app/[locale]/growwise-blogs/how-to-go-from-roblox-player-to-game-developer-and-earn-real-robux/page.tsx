import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BlogImage } from '@/components/blogs/BlogImage'
import { getS3ImageUrl } from '@/lib/constants'
import { ArrowLeft, Calendar, User, Code, Gamepad2, TrendingUp, DollarSign, Lightbulb, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Image path - update this to your actual image location
// Option 1: Local image in public folder: '/images/blogs/how-to-go-from-roblox-player-to-game-developer-and-earn-real-robux.webp'
// Option 2: S3 image: getS3ImageUrl('images/blogs/how-to-go-from-roblox-player-to-game-developer-and-earn-real-robux.webp')
const BLOG_IMAGE_URL = '\images\blogs\fifthBlog.webp' // or use getS3ImageUrl('images/blogs/how-to-go-from-roblox-player-to-game-developer-and-earn-real-robux.webp') for S3

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { 
    title: 'How to Go from Roblox Player to Game Developer and Earn Real Robux | GrowWise', 
    description: 'Transform your child\'s gaming passion into valuable coding and development skills. Learn Roblox game development and turn screen time into productive skill time.' 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
    { name: 'How to Go from Roblox Player to Game Developer', url: `${baseUrl}/${locale}/growwise-blogs/how-to-go-from-roblox-player-to-game-developer-and-earn-real-robux` },
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
              alt="How to Go from Roblox Player to Game Developer and Earn Real Robux"
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
                <span>April 30, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span>12:12 am</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              How to Go from Roblox Player to Game Developer and Earn Real Robux
            </h1>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none">
              
              <p className="lead text-xl text-gray-700 mb-8">
                If your child can't stop talking about Roblox, they're not alone. With over <strong>200 million monthly users</strong> and millions of user-generated games, Roblox has become more than a trend — it's a universe kids live in. But what if this obsession could become something meaningful?
              </p>

              <p className="text-gray-700 mb-8">
                Instead of just playing games, your child could <strong>start creating them</strong>. Learning Roblox game development turns screen time into <strong>productive skill time,</strong> where fun meets future-ready learning.
              </p>

              {/* Featured Image */}
              <div className="my-8 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                  <BlogImage
                    src={BLOG_IMAGE_URL}
                    alt="How to Go from Roblox Player to Game Developer and Earn Real Robux"
                    fill
                    className="object-cover rounded-xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>

              <p className="text-gray-700 mb-8">
                At <strong>GrowWise</strong>, we turn Roblox enthusiasm into real-world confidence through our Roblox Coding Summer Camp, designed for students who love the game and are ready to start building.
              </p>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">What Is Roblox Game Development?</h2>

              <p className="text-gray-700 mb-6">
                Roblox is a global online platform that lets users play and create games. Using <strong>Roblox Studio</strong>, kids can build their own interactive worlds, learn to code using <strong>Lua</strong>, and even publish games for others to play.
              </p>

              <p className="text-gray-700 mb-8">
                Unlike passive gaming, <strong>Roblox game development is active learning</strong>. It blends coding, storytelling, design, and logic—all while being fun and highly motivating.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-3">Encourages Social and Emotional Growth</h3>
                  <p className="text-gray-700">
                    Building games requires storytelling, collaboration, and empathy—skills that go beyond the screen and into the real world.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-[#F16112] p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-[#1F396D] mb-3">Boosts Independence and Confidence</h3>
                  <p className="text-gray-700">
                    When kids build something of their own, they become creators—not just consumers. Completing a working game builds pride and ownership.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Roblox Obsession Isn't a Bad Thing</h2>

              <p className="text-gray-700 mb-6">
                Instead of seeing Roblox as a distraction, think of it as a <strong>creative gateway</strong>.
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-6 rounded-lg my-6">
                <ul className="list-disc list-inside space-y-2">
                  <li>Roblox isn't a single game — it's a <strong>game engine</strong> where players can become creators.</li>
                  <li>Kids already understand the interface and game mechanics — that gives them a head start.</li>
                  <li>Instead of just playing, they can <strong>build characters, worlds, scripts, and experiences</strong> for others to enjoy.</li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Educational Power of Roblox</h2>

              <p className="text-gray-700 mb-6">
                At its core, <strong>Roblox game development</strong> introduces kids to practical skills through play. Here's what makes it powerful:
              </p>

              <div className="space-y-4 my-6">
                <div className="flex items-start gap-4">
                  <Code className="w-6 h-6 text-[#1F396D] mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Coding Skills</h3>
                    <p className="text-gray-700">Learn Lua programming language, a real-world coding skill used in game development.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Gamepad2 className="w-6 h-6 text-[#F16112] mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Game Design</h3>
                    <p className="text-gray-700">Understand game mechanics, user experience, and interactive design principles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Lightbulb className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Problem-Solving</h3>
                    <p className="text-gray-700">Develop logical thinking and debugging skills when things don't work as expected.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <DollarSign className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1F396D] mb-1">Entrepreneurship</h3>
                    <p className="text-gray-700">Learn about monetization, marketing, and building a user base for their games.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">From Player to Developer: The Journey</h2>

              <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg my-6">
                <h3 className="text-xl font-bold text-[#1F396D] mb-3">Step 1: Start with Roblox Studio</h3>
                <p className="text-gray-700 mb-4">
                  Roblox Studio is free and intuitive. Kids can start building immediately, even without prior coding experience.
                </p>
                <p className="text-gray-700">
                  <strong>Tip:</strong> Begin with simple projects like obstacle courses or basic games before moving to complex scripts.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-[#F16112] p-6 rounded-r-lg my-6">
                <h3 className="text-xl font-bold text-[#1F396D] mb-3">Step 2: Learn Lua Programming</h3>
                <p className="text-gray-700 mb-4">
                  Lua is the scripting language used in Roblox. It's beginner-friendly but powerful enough for advanced game development.
                </p>
                <p className="text-gray-700">
                  <strong>Tip:</strong> Structured learning through camps or courses accelerates understanding and prevents frustration.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg my-6">
                <h3 className="text-xl font-bold text-[#1F396D] mb-3">Step 3: Publish and Share</h3>
                <p className="text-gray-700 mb-4">
                  Once a game is complete, kids can publish it on Roblox for others to play. This builds confidence and real-world experience.
                </p>
                <p className="text-gray-700">
                  <strong>Tip:</strong> Encourage iteration—the best games improve over time based on player feedback.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Earning Real Robux: The Business Side</h2>

              <p className="text-gray-700 mb-6">
                Beyond coding skills, Roblox game development teaches valuable business concepts:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <DollarSign className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">In-Game Purchases</h3>
                  <p className="text-gray-700 text-sm">
                    Learn about virtual economies and how to create value for players.
                  </p>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-yellow-600 mb-3" />
                  <h3 className="font-bold text-[#1F396D] mb-2">Marketing & Growth</h3>
                  <p className="text-gray-700 text-sm">
                    Understand how to attract players and build a community around your game.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8">
                <p className="text-xl font-bold mb-4">
                  Ready to Transform Gaming into Learning?
                </p>
                <p className="mb-6">
                  At GrowWise, our Roblox Coding Summer Camp turns your child's passion for gaming into real-world skills. Students learn coding, game design, and entrepreneurship in a supportive, fun environment.
                </p>
                <Link href="/camps/winter">
                  <Button className="bg-white text-[#1F396D] hover:bg-gray-100 text-lg px-8 py-6">
                    Explore Our Roblox Camp
                  </Button>
                </Link>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Why Choose Structured Learning?</h2>

              <p className="text-gray-700 mb-6">
                While kids can learn Roblox development on their own, structured programs offer:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-8">
                <li><strong>Expert guidance</strong> from experienced instructors</li>
                <li><strong>Peer collaboration</strong> and learning from others</li>
                <li><strong>Structured curriculum</strong> that builds skills progressively</li>
                <li><strong>Real projects</strong> that can be published and shared</li>
                <li><strong>Support</strong> when challenges arise</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-[#1F396D] p-6 rounded-r-lg my-8">
                <p className="text-gray-800 font-semibold mb-2">
                  <strong>Parent Tip:</strong> Look for programs that balance fun with learning. The best Roblox camps keep kids engaged while teaching valuable skills they'll use beyond gaming.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#1F396D] mt-12 mb-6">Conclusion</h2>

              <p className="text-gray-700 mb-6">
                Roblox isn't just a game—it's a platform for creativity, learning, and entrepreneurship. By guiding your child from player to developer, you're helping them build skills that matter in the digital age.
              </p>

              <p className="text-gray-700 mb-8">
                Whether they're interested in coding, game design, or earning Robux, Roblox game development offers a pathway to real-world skills. With the right support and structure, your child can turn their gaming passion into productive learning.
              </p>

              <div className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white p-8 rounded-xl my-8 text-center">
                <p className="text-xl font-bold mb-4">
                  Start Your Child's Game Development Journey Today!
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

