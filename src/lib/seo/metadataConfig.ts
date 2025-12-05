/**
 * Centralized SEO metadata configuration
 * All page metadata is defined here for easy maintenance
 */

export interface PageMetadataConfig {
  title: string
  description: string
  keywords: string
  path: string
  image?: string
  type?: 'website' | 'article'
}

export const metadataConfig: Record<string, PageMetadataConfig> = {
  // Home page
  '/': {
    title: "GrowWise - K-12 Education & STEAM Programs | Dublin, CA",
    description: "Expert K-12 tutoring and STEAM programs in Dublin, CA. Math, English, coding, and SAT prep. Personalized learning for every student. Book a free assessment today!",
    keywords: "tutoring Dublin CA, K-12 education, STEAM programs, math tutor, English tutor, coding classes, SAT prep Dublin, personalized learning",
    path: '',
  },

  // Core pages
  '/about': {
    title: "About GrowWise - Expert K-12 Education & STEAM Programs | Dublin, CA",
    description: "Learn about GrowWise, Dublin CA's premier K-12 tutoring center. Expert instructors, proven results, personalized learning. Serving students since 2019.",
    keywords: "about GrowWise, tutoring center Dublin CA, K-12 education Dublin, STEAM programs, educational excellence",
    path: '/about',
  },

  '/contact': {
    title: "Contact GrowWise - K-12 Tutoring & STEAM Programs | Dublin, CA",
    description: "Get in touch with GrowWise in Dublin, CA. Contact us for K-12 tutoring, STEAM programs, free assessments, and enrollment. We're here to help your child succeed.",
    keywords: "contact GrowWise, tutoring Dublin CA, K-12 education contact, STEAM programs Dublin, free assessment booking",
    path: '/contact',
  },

  '/programs': {
    title: "Programs at GrowWise - Academic & STEAM Courses | Dublin, CA",
    description: "Explore GrowWise programs: K-12 Academic courses (Math, English) and innovative STEAM programs (ML/AI, Game Development). Personalized learning in Dublin, CA.",
    keywords: "GrowWise programs, academic courses, STEAM programs, K-12 education Dublin, math courses, coding classes",
    path: '/programs',
  },

  // Academic pages
  '/academic': {
    title: "Academic Programs - Math & English Tutoring | GrowWise Dublin, CA",
    description: "K-12 Math and English programs aligned with DUSD & PUSD standards. Grade-level, accelerated, and integrated math courses. Comprehensive English Language Arts. Personalized learning in Dublin, CA.",
    keywords: "academic programs, math tutoring Dublin CA, English tutoring, DUSD aligned curriculum, PUSD aligned, grade-level math, accelerated math, English Language Arts",
    path: '/academic',
  },

  // Course pages
  '/courses/math': {
    title: "Math Courses - K-12 Math Tutoring | GrowWise Dublin, CA",
    description: "Comprehensive math courses from elementary to high school. Grade-level math, accelerated programs, and integrated math. DUSD & PUSD aligned curriculum. Expert math tutors in Dublin, CA.",
    keywords: "math courses, math tutoring Dublin CA, K-12 math, grade-level math, accelerated math, integrated math, DUSD math, PUSD math, math tutor",
    path: '/courses/math',
  },

  '/courses/english': {
    title: "English Language Arts Courses - Reading & Writing Tutoring | GrowWise",
    description: "Comprehensive English Language Arts courses: reading comprehension, vocabulary, grammar, and essay writing. California Common Core aligned. Expert English tutors in Dublin, CA.",
    keywords: "English courses, English tutoring Dublin CA, reading comprehension, essay writing, grammar, vocabulary, English Language Arts, ELA tutor",
    path: '/courses/english',
  },

  '/courses/sat-prep': {
    title: "SAT Prep Course - SAT Test Preparation | GrowWise Dublin, CA",
    description: "Comprehensive SAT prep course with practice tests, strategies, and personalized instruction. Boost your SAT score with expert tutors. Book your SAT prep course in Dublin, CA.",
    keywords: "SAT prep, SAT preparation, SAT course, SAT tutoring Dublin CA, SAT test prep, SAT strategies, SAT practice tests",
    path: '/courses/sat-prep',
  },

  '/courses/high-school-math': {
    title: "High School Math Courses - Algebra, Geometry, Pre-Calculus | GrowWise",
    description: "High school math courses: Algebra, Geometry, Pre-Calculus, and more. Expert instruction for high school students. DUSD & PUSD aligned. Math tutoring in Dublin, CA.",
    keywords: "high school math, algebra tutoring, geometry tutoring, pre-calculus, high school math courses Dublin CA, advanced math",
    path: '/courses/high-school-math',
  },

  // STEAM pages
  '/steam': {
    title: "STEAM Programs - ML/AI, Game Development & Coding | GrowWise",
    description: "Innovative STEAM programs: Machine Learning & AI, Game Development, and coding courses. Hands-on learning for K-12 students. Build real projects and develop tech skills at GrowWise.",
    keywords: "STEAM programs, ML AI coding, game development, coding classes for kids, programming courses, STEM education Dublin CA, technology courses",
    path: '/steam',
  },

  '/steam/ml-ai-coding': {
    title: "ML/AI Coding Course - Machine Learning & Artificial Intelligence | GrowWise",
    description: "Learn Machine Learning and Artificial Intelligence coding. Hands-on projects, real-world applications. ML/AI course for K-12 students. Build AI projects at GrowWise.",
    keywords: "ML AI coding, machine learning course, artificial intelligence course, AI coding for kids, ML programming, AI programming Dublin CA",
    path: '/steam/ml-ai-coding',
  },

  '/steam/game-development': {
    title: "Game Development Course - Learn to Build Games | GrowWise",
    description: "Game development course for K-12 students. Learn to create games, build projects, and develop coding skills. Hands-on game development classes in Dublin, CA.",
    keywords: "game development course, learn game development, coding games, game programming, game design course Dublin CA, kids game development",
    path: '/steam/game-development',
  },

  // Enrollment pages
  '/enroll': {
    title: "Enroll at GrowWise - K-12 Tutoring & STEAM Programs | Dublin, CA",
    description: "Enroll your child in GrowWise K-12 tutoring and STEAM programs. Easy enrollment process. Choose from math, English, coding, and more. Start your learning journey today.",
    keywords: "enroll GrowWise, tutoring enrollment, K-12 enrollment Dublin CA, STEAM program enrollment, sign up for tutoring",
    path: '/enroll',
  },

  '/enroll-academic': {
    title: "Enroll in Academic Programs - Math & English Tutoring | GrowWise",
    description: "Enroll in GrowWise academic programs: Math and English Language Arts. DUSD & PUSD aligned curriculum. Personalized learning for K-12 students. Enroll today in Dublin, CA.",
    keywords: "enroll academic programs, math enrollment, English enrollment, academic tutoring enrollment Dublin CA, K-12 enrollment",
    path: '/enroll-academic',
  },

  '/book-assessment': {
    title: "Book Free Assessment - K-12 Placement Assessment | GrowWise",
    description: "Book your free 60-minute K-12 placement assessment at GrowWise. Evaluate your child's academic level and get personalized learning recommendations. Dublin, CA.",
    keywords: "free assessment, placement assessment, K-12 assessment, academic evaluation, free tutoring assessment Dublin CA, book assessment",
    path: '/book-assessment',
  },

  // Camp pages
  '/camps/winter': {
    title: "Winter Camp 2025 - Academic & STEAM Winter Programs | GrowWise",
    description: "Join GrowWise Winter Camp 2025! Academic workshops, STEAM activities, and fun learning experiences. December 22-30, 2025. Enroll now for winter break programs in Dublin, CA.",
    keywords: "winter camp 2025, winter break programs, academic winter camp, STEAM winter camp, winter tutoring Dublin CA, December camp",
    path: '/camps/winter',
  },

  '/camps/winter/calendar': {
    title: "Winter Camp Schedule 2025 - Workshop Calendar | GrowWise",
    description: "View the complete Winter Camp 2025 schedule. See all workshops, dates, and times. Plan your child's winter break learning experience at GrowWise in Dublin, CA.",
    keywords: "winter camp schedule, winter camp calendar, workshop schedule, December camp schedule, winter break activities",
    path: '/camps/winter/calendar',
  },
}

/**
 * Get metadata configuration for a given path
 */
export function getMetadataConfig(path: string): PageMetadataConfig | null {
  // Normalize path (remove leading/trailing slashes, handle empty path)
  const normalizedPath = path === '' || path === '/' ? '/' : path.replace(/^\/+|\/+$/g, '')
  const lookupPath = normalizedPath === '' ? '/' : `/${normalizedPath}`
  
  return metadataConfig[lookupPath] || null
}

/**
 * Get all metadata configs (useful for sitemap generation, etc.)
 */
export function getAllMetadataConfigs(): PageMetadataConfig[] {
  return Object.values(metadataConfig)
}

