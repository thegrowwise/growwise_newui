import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import Link from 'next/link'
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/growwise-blogs', locale)
  return metadata || { 
    title: 'GrowWise Blogs | Tips on Math, English, Coding & STEAM Programs', 
    description: 'Tips and blogs on math tutoring, English help, coding for kids, and STEAM Programs for K–12 in Dublin, Pleasanton, and San Ramon.' 
  }
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
    title: 'Why U.S. Kids Are Falling Behind in Math and English — and How Parents Can Help',
    excerpt: 'Understanding the challenges and solutions for improving student performance in core subjects.',
    href: '#',
    readMore: 'Read More »'
  },
  {
    id: '2',
    category: 'academic',
    title: '12 Smart & Simple Ways to Improve Your Child\'s Focus',
    excerpt: 'Practical strategies to help your child develop better concentration and attention skills.',
    href: '#',
    readMore: 'Read More »'
  },
  {
    id: '3',
    category: 'academic',
    title: 'How to Identify Learning Gaps in Your Child\'s Education at Home',
    excerpt: 'Learn how to spot and address learning gaps to ensure your child stays on track.',
    href: '#',
    readMore: 'Read More »'
  },
  {
    id: '4',
    category: 'Coding',
    title: 'How to Choose the Right Summer Camp for Your Child: A Parent\'s Guide',
    excerpt: 'A comprehensive guide to selecting the perfect summer camp experience for your child.',
    href: '#',
    readMore: 'Read More »'
  },
  {
    id: '5',
    category: 'Coding',
    title: 'How to Go from Roblox Player to Game Developer and Earn Real Robux',
    excerpt: 'Transform your child\'s gaming passion into valuable coding and development skills.',
    href: '#',
    readMore: 'Read More »'
  },
  {
    id: '6',
    category: 'Coding',
    title: 'Unlocking Confidence, Independence, and Fun Through Summer Camp',
    excerpt: 'Discover how summer camps can help children develop essential life skills while having fun.',
    href: '#',
    readMore: 'Read More »'
  }
];

export default async function GrowWiseBlogsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = 'https://thegrowwise.com'
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Blogs', url: `${baseUrl}/${locale}/growwise-blogs` },
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
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
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
            <div className="mt-12 flex justify-center items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#F16112] hover:text-[#F16112] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-[#F16112] text-white rounded-lg font-semibold">1</button>
                <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#F16112] hover:text-[#F16112] transition-colors">2</button>
                <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#F16112] hover:text-[#F16112] transition-colors">3</button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#F16112] hover:text-[#F16112] transition-colors">
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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

