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

  // Course pages - Enhanced with keyword-rich titles and descriptions
  '/courses/math': {
    title: "Math Tutoring Dublin CA | K-12 Math Courses | Grade-Level, Accelerated & Integrated Math | GrowWise",
    description: "Expert math tutoring in Dublin, CA. K-12 math courses including grade-level math, accelerated math, and integrated math 1 & 2. DUSD and PUSD aligned curriculum. Algebra, Geometry, Pre-Calculus. Small class sizes, personalized instruction. Book a free math assessment today!",
    keywords: "math tutoring Dublin CA, math tutor Dublin, K-12 math courses, grade-level math, accelerated math, integrated math, DUSD math, PUSD math, algebra tutoring, geometry tutoring, pre-calculus, elementary math, middle school math, high school math, math classes Dublin CA, math help Dublin, math tutoring near me",
    path: '/courses/math',
  },

  '/courses/english': {
    title: "English Tutoring Dublin CA | Reading & Writing Courses | ELA Tutoring | GrowWise",
    description: "Expert English Language Arts tutoring in Dublin, CA. Comprehensive ELA courses: reading comprehension, vocabulary development, grammar, and essay writing. California Common Core aligned. K-12 English tutoring with proven results. Book your free English assessment!",
    keywords: "English tutoring Dublin CA, English tutor Dublin, reading comprehension, essay writing, grammar tutoring, vocabulary development, English Language Arts, ELA tutoring, writing tutor, reading tutor, English classes Dublin CA, English help Dublin, English tutoring near me, K-12 English courses",
    path: '/courses/english',
  },

  '/courses/sat-prep': {
    title: "SAT Prep Dublin CA | SAT Test Preparation Course | SAT Tutoring | GrowWise",
    description: "Top-rated SAT prep course in Dublin, CA. Comprehensive SAT preparation with practice tests, proven strategies, and personalized instruction. Expert SAT tutors help boost your score. Small classes, flexible scheduling. Book your SAT prep course today!",
    keywords: "SAT prep Dublin CA, SAT preparation, SAT course, SAT tutoring Dublin, SAT test prep, SAT strategies, SAT practice tests, SAT classes Dublin CA, SAT help, SAT tutor near me, SAT prep course, SAT score improvement, college entrance exam prep",
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
    title: "STEAM Programs Dublin CA | ML/AI, Game Development & Coding Classes | GrowWise",
    description: "Innovative STEAM programs in Dublin, CA: Machine Learning & AI, Game Development (Roblox, Scratch), Python coding, and more. Hands-on learning for K-12 students. Build real projects, develop tech skills. Expert instructors, project-based curriculum. Explore STEAM programs today!",
    keywords: "STEAM programs Dublin CA, ML AI coding, game development, coding classes for kids, programming courses, STEM education, technology courses, coding classes Dublin CA, programming for kids, STEAM education, robotics, computer science for kids",
    path: '/steam',
  },

  '/steam/ml-ai-coding': {
    title: "ML/AI Coding Course Dublin CA | Machine Learning & AI for Kids | GrowWise",
    description: "Learn Machine Learning and Artificial Intelligence coding in Dublin, CA. Hands-on ML/AI projects for K-12 students. Build real AI applications, understand machine learning concepts. Expert instructors, project-based learning. Start your AI journey today!",
    keywords: "ML AI coding Dublin CA, machine learning course, artificial intelligence course, AI coding for kids, ML programming, AI programming, machine learning for students, AI classes Dublin CA, coding AI, learn machine learning, artificial intelligence tutoring",
    path: '/steam/ml-ai-coding',
  },

  '/steam/game-development': {
    title: "Game Development Course Dublin CA | Learn to Build Games | Coding Classes | GrowWise",
    description: "Game development course for K-12 students in Dublin, CA. Learn to create games using Roblox, Scratch, and Python. Build real game projects, develop coding skills. Hands-on game development classes with expert instructors. Start building games today!",
    keywords: "game development course Dublin CA, learn game development, coding games, game programming, game design course, kids game development, Roblox coding, Scratch programming, Python game development, game development classes, coding games for kids",
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

