import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl, publicPath } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import Link from 'next/link'
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { page } = (await searchParams) ?? {}
  const pageNum = Number.parseInt(page ?? '1', 10)

  const metadata = generateMetadataFromPath('/growwise-blogs', locale)
  const baseMetadata =
    metadata || {
      title: 'GrowWise Blog | Math, English & Coding Tips',
      description:
        'Practical articles on tutoring, English, coding, and STEAM for Dublin and Tri-Valley families.',
    }

  // Paginated URLs consolidate to page 1 via canonical; indexable so crawlers align with default metadata.
  if (Number.isFinite(pageNum) && pageNum > 1) {
    return {
      ...baseMetadata,
      alternates: {
        canonical: absoluteSiteUrl('/growwise-blogs', locale, getCanonicalSiteUrl()),
      },
    }
  }

  return baseMetadata
}

interface BlogPost {
  id: string;
  category: 'academic' | 'Coding';
  title: string;
  excerpt: string;
  href: string;
  readMore?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    category: 'academic',
    title: 'US Kids & Core Skills — How Parents Can Help',
    excerpt: 'Understanding the challenges and solutions for improving student performance in core subjects.',
    href: '/growwise-blogs/us-kids-falling-behind-math-english-parent-assessments',
    readMore: 'Read article »'
  },
  {
    id: '2',
    category: 'academic',
    title: '12 Smart & Simple Ways to Improve Your Child\'s Focus',
    excerpt: 'Practical strategies to help your child develop better concentration and attention skills.',
    href: '/growwise-blogs/improve-child-focus-feel-valued',
    readMore: 'Read article »'
  },
  {
    id: '3',
    category: 'academic',
    title: 'Spot Learning Gaps at Home',
    excerpt: 'Learn how to spot and address learning gaps to ensure your child stays on track.',
    href: '/growwise-blogs/how-to-identify-learning-gaps-in-your-childs-education-at-home-parent-guide',
    readMore: 'Read article »'
  },
  {
    id: '4',
    category: 'Coding',
    title: 'Choosing the Right Summer Camp (Parents)',
    excerpt: 'A comprehensive guide to selecting the perfect summer camp experience for your child.',
    href: '/growwise-blogs/how-to-choose-the-right-summer-camp-for-your-child-a-parents-guide',
    readMore: 'Read article »'
  },
  {
    id: '5',
    category: 'Coding',
    title: 'From Roblox Player to Game Developer',
    excerpt: 'Transform your child\'s gaming passion into valuable coding and development skills.',
    href: '/growwise-blogs/how-to-go-from-roblox-player-to-game-developer-and-earn-real-robux',
    readMore: 'Read article »'
  },
  {
    id: '6',
    category: 'Coding',
    title: 'Summer Camp: Confidence & Fun',
    excerpt: 'Discover how summer camps can help children develop essential life skills while having fun.',
    href: '/growwise-blogs/unlocking-confidence-independence-and-fun-through-summer-camp',
    readMore: 'Read article »'
  },
  {
    id: '7',
    category: 'Coding',
    title: 'Coding & Tech Skills',
    excerpt: 'Discover how coding skills can transform your future and open doors to exciting career opportunities in technology.',
    href: '/growwise-blogs/embrace-the-future-of-technology-advance-your-coding-expertise-with-growwise',
    readMore: 'Read article »'
  },
  {
    id: '8',
    category: 'Coding',
    title: 'Coding Skills & Tomorrow’s AI',
    excerpt: 'Learn how mastering coding today positions you to be at the forefront of tomorrow\'s AI-driven innovations.',
    href: '/growwise-blogs/how-coding-skills-empower-you-to-shape-tomorrows-ai-innovations',
    readMore: 'Read article »'
  },
  {
    id: '9',
    category: 'Coding',
    title: 'Python for In-Demand Careers',
    excerpt: 'Python is one of the most sought-after programming languages. Discover why it\'s the key to unlocking career opportunities.',
    href: '/growwise-blogs/why-learning-python-is-your-fast-track-to-in-demand-job-offers',
    readMore: 'Read article »'
  },
  {
    id: '10',
    category: 'Coding',
    title: 'Technical Schools in 2025',
    excerpt: 'Explore why technical education and coding skills are becoming essential investments for career success in 2025.',
    href: '/growwise-blogs/technical-schools-in-2025-a-smart-investment-for-your-career',
    readMore: 'Read article »'
  },
  {
    id: '11',
    category: 'Coding',
    title: 'Programming Skills on a Resume',
    excerpt: 'Programming skills are increasingly valuable across industries. Learn how they can enhance your resume and career prospects.',
    href: '/growwise-blogs/how-programming-skills-on-a-resume-will-open-more-career-opportunities',
    readMore: 'Read article »'
  },
  {
    id: '12',
    category: 'Coding',
    title: 'Java Skills on LinkedIn',
    excerpt: 'Java remains a powerful and widely-used programming language. See how Java skills can make your LinkedIn profile stand out.',
    href: '/growwise-blogs/why-learning-java-coding-is-impressive-on-your-linkedin-profile',
    readMore: 'Read article »'
  },
  {
    id: '13',
    category: 'Coding',
    title: 'Best Programming Languages for Careers',
    excerpt: 'Discover which programming languages offer the best career opportunities and how to choose the right one for your goals.',
    href: '/growwise-blogs/unlock-your-future-the-best-programming-languages-for-career-advancement',
    readMore: 'Read article »'
  },
  {
    id: '14',
    category: 'Coding',
    title: 'Choosing the Right Coding Class',
    excerpt: 'Learn how selecting the right coding class can set your child up for success in technology and future career opportunities.',
    href: '/growwise-blogs/the-advantage-in-choosing-the-right-coding-class-for-your-child',
    readMore: 'Read article »'
  },
  {
    id: '15',
    category: 'Coding',
    title: 'Code as a Modern Skill',
    excerpt: 'Explore why coding has become an essential skill in today\'s digital world and how it opens doors to innovation and opportunity.',
    href: '/growwise-blogs/harnessing-the-power-of-code-a-skill-for-the-modern-era',
    readMore: 'Read article »'
  },
  {
    id: '16',
    category: 'Coding',
    title: 'Coding for Kids — Future-Ready Skills',
    excerpt: 'Understand why coding education for children is crucial for developing problem-solving skills and preparing them for the future.',
    href: '/growwise-blogs/the-importance-of-coding-for-kids-building-future-ready-skills',
    readMore: 'Read article »'
  }
];

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function GrowWiseBlogsPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const postsPerPage = 6
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = blogPosts.slice(startIndex, endIndex)
  
  const baseUrl = getCanonicalSiteUrl()
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Blogs', url: absoluteSiteUrl('/growwise-blogs', locale, baseUrl) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              GrowWise Blogs
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Tips and blogs on math tutoring, English help, coding for kids, and STEAM Programs for K–12 in Dublin, Pleasanton, and San Ramon.
            </p>
            <p className="text-base md:text-lg text-gray-200/95 max-w-2xl mx-auto mt-4">
              Looking ahead to summer?{' '}
              <Link href={publicPath('/camps/summer', locale)} className="font-semibold text-white underline decoration-white/60 hover:decoration-white">
                Explore summer camps
              </Link>{' '}
              in Dublin and the Tri-Valley.
            </p>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  {/* Category Badge */}
                  <div className="px-6 pt-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      post.category === 'academic'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1F396D] mb-3 hover:text-[#F16112] transition-colors">
                      <Link href={post.href} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link
                      href={post.href}
                      className="inline-flex items-center text-[#F16112] font-semibold hover:text-[#F1894F] transition-colors group"
                    >
                      {post.readMore || 'Read More'}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                {currentPage > 1 ? (
                  <Link
                    href={publicPath(`/growwise-blogs${currentPage > 2 ? `?page=${currentPage - 1}` : ''}`, locale)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#F16112] hover:text-[#F16112] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Page</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Page</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={publicPath(`/growwise-blogs${pageNum > 1 ? `?page=${pageNum}` : ''}`, locale)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#F16112] text-white'
                          : 'bg-white border-2 border-gray-300 hover:border-[#F16112] hover:text-[#F16112]'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                </div>
                {currentPage < totalPages ? (
                  <Link
                    href={publicPath(`/growwise-blogs?page=${currentPage + 1}`, locale)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#F16112] hover:text-[#F16112] transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enroll Today to Unlock Learning Potential for K-12 Students!
            </h2>
            <Link
              href="/enroll"
              className="inline-flex items-center gap-2 mt-6 px-8 py-4 bg-white text-[#1F396D] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
