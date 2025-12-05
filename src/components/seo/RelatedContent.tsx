/**
 * Related Content Section Component for Internal Linking
 * Improves SEO by creating contextual links between related pages
 */

'use client'

import Link from 'next/link'
import { 
  BookOpen, 
  Calculator, 
  Target, 
  Award, 
  Sparkles, 
  CheckCircle,
  GraduationCap
} from 'lucide-react'

interface RelatedContentProps {
  locale: string
  currentPage?: 'math' | 'english' | 'sat-prep' | 'high-school-math' | 'steam' | 'ml-ai' | 'game-dev'
}

export function RelatedContent({ locale, currentPage }: RelatedContentProps) {
  const basePath = `/${locale}`
  
  // Define all related content items
  const allItems = [
    {
      id: 'math',
      href: `${basePath}/courses/math`,
      title: 'Math Courses',
      description: 'Comprehensive K-12 math courses: Grade-level, Accelerated, and Integrated Math programs.',
      icon: Calculator,
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-100 hover:border-blue-300',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
    },
    {
      id: 'english',
      href: `${basePath}/courses/english`,
      title: 'English Courses',
      description: 'Comprehensive English Language Arts programs for K-12 students. Reading, writing, and grammar.',
      icon: BookOpen,
      gradient: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-100 hover:border-emerald-300',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-600',
    },
    {
      id: 'sat-prep',
      href: `${basePath}/courses/sat-prep`,
      title: 'SAT Prep',
      description: 'Boost your SAT score with expert test preparation strategies and practice tests.',
      icon: Target,
      gradient: 'from-purple-50 to-pink-50',
      border: 'border-purple-100 hover:border-purple-300',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600',
    },
    {
      id: 'high-school-math',
      href: `${basePath}/courses/high-school-math`,
      title: 'High School Math',
      description: 'Advanced math courses including Algebra, Geometry, Pre-Calculus, and Calculus.',
      icon: GraduationCap,
      gradient: 'from-orange-50 to-amber-50',
      border: 'border-orange-100 hover:border-orange-300',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-600',
    },
    {
      id: 'academic',
      href: `${basePath}/academic`,
      title: 'Academic Programs',
      description: 'Explore all our K-12 academic programs aligned with DUSD & PUSD standards.',
      icon: Award,
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-100 hover:border-green-300',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
    },
    {
      id: 'steam',
      href: `${basePath}/steam`,
      title: 'STEAM Programs',
      description: 'Innovative STEAM programs: ML/AI, Game Development, and Coding classes.',
      icon: Sparkles,
      gradient: 'from-cyan-50 to-teal-50',
      border: 'border-cyan-100 hover:border-cyan-300',
      iconColor: 'text-cyan-600',
      textColor: 'text-cyan-600',
    },
    {
      id: 'assessment',
      href: `${basePath}/book-assessment`,
      title: 'Free Assessment',
      description: 'Book a free academic assessment to identify strengths and areas for improvement.',
      icon: CheckCircle,
      gradient: 'from-red-50 to-rose-50',
      border: 'border-red-100 hover:border-red-300',
      iconColor: 'text-red-600',
      textColor: 'text-red-600',
    },
  ]

  // Filter out current page
  const relatedItems = allItems.filter(item => item.id !== currentPage).slice(0, 6)

  return (
    <section className="py-16 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Explore Related <span className="text-[#F16112]">Programs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedItems.map((item) => {
            const IconComponent = item.icon
            // Create hover color class - use explicit classes for Tailwind JIT
            const hoverColorClass = item.textColor === 'text-blue-600' ? 'group-hover:text-blue-600' :
                                   item.textColor === 'text-emerald-600' ? 'group-hover:text-emerald-600' :
                                   item.textColor === 'text-purple-600' ? 'group-hover:text-purple-600' :
                                   item.textColor === 'text-orange-600' ? 'group-hover:text-orange-600' :
                                   item.textColor === 'text-green-600' ? 'group-hover:text-green-600' :
                                   item.textColor === 'text-cyan-600' ? 'group-hover:text-cyan-600' :
                                   'group-hover:text-red-600'
            return (
              <Link 
                key={item.id}
                href={item.href}
                className={`group bg-gradient-to-br ${item.gradient} rounded-xl p-6 hover:shadow-xl transition-all duration-300 border ${item.border}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                  <h3 className={`text-xl font-bold text-gray-900 transition-colors ${hoverColorClass}`}>
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
                <span className={`${item.textColor} font-semibold group-hover:underline`}>
                  Learn More →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

