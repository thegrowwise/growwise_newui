/**
 * Centralized SEO metadata configuration
 * All page metadata is defined here for easy maintenance
 * Titles: max 60 characters. Descriptions: max 150 characters (no pricing).
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
    title: 'Grades 1-12 Tutoring & STEAM | Dublin CA | GrowWise',
    description:
      'Grades 1-12 tutoring and STEAM in Dublin, CA. Math, English, coding, and SAT prep. Small groups, personalized lessons. Book a free assessment.',
    keywords:
      'tutoring Dublin CA, Grades 1-12 education, STEAM programs, math tutor, English tutor, coding classes, SAT prep Dublin, personalized learning',
    path: '',
  },

  // Core pages
  '/about': {
    title: 'About GrowWise | Dublin CA | Grades 1-12 & STEAM',
    description:
      "GrowWise offers Grades 1-12 tutoring and STEAM in Dublin, CA. Expert instructors, personalized learning, and proven results.",
    keywords:
      'about GrowWise, tutoring center Dublin CA, Grades 1-12 education Dublin, STEAM programs, educational excellence',
    path: '/about',
  },

  '/contact': {
    title: 'Contact GrowWise | Dublin CA | Talk to Us',
    description:
      'Reach GrowWise in Dublin, CA for tutoring, STEAM programs, and enrollment. Call, email, or visit—we respond within one business day.',
    keywords:
      'contact GrowWise, tutoring Dublin CA, Grades 1-12 education contact, STEAM programs Dublin, free assessment booking',
    path: '/contact',
  },

  '/programs': {
    title: 'Programs | Academic & STEAM | GrowWise',
    description:
      'Browse GrowWise academic and STEAM programs in Dublin, CA. Math, English, ML/AI, game dev, and coding paths for every learner.',
    keywords:
      'GrowWise programs, academic courses, STEAM programs, Grades 1-12 education Dublin, math courses, coding classes',
    path: '/programs',
  },

  // Academic pages
  '/academic': {
    title: 'Grades 1-12 Academic Programs | Dublin CA | GrowWise',
    description:
      'Math and English programs aligned with DUSD and PUSD. Grade-level, accelerated, and integrated paths. Small groups in Dublin, CA.',
    keywords:
      'academic programs, math tutoring Dublin CA, English tutoring, DUSD aligned curriculum, PUSD aligned, grade-level math, accelerated math, English Language Arts',
    path: '/academic',
  },

  '/courses/math': {
    title: 'Math Tutoring Dublin CA | Grades 1-12 | GrowWise',
    description:
      'Math tutoring for grades 1–12 in Dublin, CA. Common Core aligned, small groups, and placement support. Book a free assessment.',
    keywords:
      'math tutoring Dublin CA, math tutor Dublin, Grades 1-12 math courses, grade-level math, accelerated math, integrated math, DUSD math, PUSD math, algebra tutoring, geometry tutoring, pre-calculus, elementary math, middle school math, high school math, math classes Dublin CA, math help Dublin, math tutoring near me',
    path: '/courses/math',
  },

  '/courses/english': {
    title: 'English Tutoring Dublin CA | ELA | GrowWise',
    description:
      'English and ELA tutoring for grades 1–12 in Dublin, CA. Reading, writing, and grammar in small groups. Book a free assessment.',
    keywords:
      'English tutoring Dublin CA, English tutor Dublin, reading comprehension, essay writing, grammar tutoring, vocabulary development, English Language Arts, ELA tutoring, writing tutor, reading tutor, English classes Dublin CA, English help Dublin, English tutoring near me, Grades 1-12 English courses',
    path: '/courses/english',
  },

  '/courses/sat-prep': {
    title: 'SAT Prep Dublin CA | GrowWise School',
    description:
      'SAT prep in Dublin, CA with practice tests and strategy. Small classes and expert coaches. Book your readiness check.',
    keywords:
      'SAT prep Dublin CA, SAT preparation, SAT course, SAT tutoring Dublin, SAT test prep, SAT strategies, SAT practice tests, SAT classes Dublin CA, SAT help, SAT tutor near me, SAT prep course, SAT score improvement, college entrance exam prep',
    path: '/courses/sat-prep',
  },

  '/courses/high-school-math': {
    title: 'High School Math Tutoring | Dublin CA | GrowWise',
    description:
      'High school math in Dublin, CA: algebra through calculus. DUSD aligned, small groups, and clear pacing. Book a free assessment.',
    keywords:
      'high school math, algebra tutoring, geometry tutoring, pre-calculus, high school math courses Dublin CA, advanced math',
    path: '/courses/high-school-math',
  },

  '/coding': {
    title: 'Coding Classes Kids | Dublin CA | GrowWise',
    description:
      'Coding classes for ages 10–18 in Dublin, CA. Python, JavaScript, and web basics in small groups. Book a free trial.',
    keywords:
      'coding classes Dublin CA, coding for kids Dublin, Python classes kids, JavaScript course kids, web development course Dublin, coding programs Grades 1-12, coding tutor Dublin, learn to code Dublin CA, kids coding near me, programming classes Dublin CA, coding classes near me',
    path: '/coding',
  },

  '/game-dev': {
    title: 'Game Dev for Kids | Dublin CA | GrowWise',
    description:
      'Game dev for ages 6–16 in Dublin, CA. Scratch, Roblox, and project builds. Hands-on classes with expert coaches. Book a free trial.',
    keywords:
      'game development Dublin CA, game development for kids, Scratch programming Dublin, Roblox coding classes, Minecraft modding, kids game design, game development courses near me, learn game development Dublin, coding games for kids Dublin CA, game programming classes',
    path: '/game-dev',
  },

  '/steam': {
    title: 'STEAM Programs | Dublin CA | GrowWise',
    description:
      'STEAM programs in Dublin, CA: ML/AI, game dev, and Python. Project-based classes for Grades 1–12. Book a free trial.',
    keywords:
      'STEAM programs Dublin CA, ML AI coding, game development, coding classes for kids, programming courses, STEM education, technology courses, coding classes Dublin CA, programming for kids, STEAM education, robotics, computer science for kids',
    path: '/steam',
  },

  '/steam/ml-ai-coding': {
    title: 'ML & AI Coding for Kids | Dublin CA | GrowWise',
    description:
      'ML and AI coding in Dublin, CA. Hands-on projects for students. Small classes and expert instructors. Book a free trial.',
    keywords:
      'ML AI coding Dublin CA, machine learning course, artificial intelligence course, AI coding for kids, ML programming, AI programming, machine learning for students, AI classes Dublin CA, coding AI, learn machine learning, artificial intelligence tutoring',
    path: '/steam/ml-ai-coding',
  },

  '/steam/game-development': {
    title: 'Game Development Course | Dublin CA | GrowWise',
    description:
      'Game development in Dublin, CA. Roblox, Scratch, and Python projects for Grades 1–12. Book a free trial.',
    keywords:
      'game development course Dublin CA, learn game development, coding games, game programming, game design course, kids game development, Roblox coding, Scratch programming, Python game development, game development classes, coding games for kids',
    path: '/steam/game-development',
  },

  '/enroll': {
    title: 'Enroll | Grades 1-12 & STEAM | GrowWise Dublin',
    description:
      'Enroll in GrowWise Grades 1-12 tutoring or STEAM in Dublin, CA. Pick a path and start with a quick intake.',
    keywords:
      'enroll GrowWise, tutoring enrollment, Grades 1-12 enrollment Dublin CA, STEAM program enrollment, sign up for tutoring',
    path: '/enroll',
  },

  '/enroll-academic': {
    title: 'Academic Enrollment | Math & English | GrowWise',
    description:
      'Enroll in GrowWise math and English programs. DUSD & PUSD aligned curriculum and small groups in Dublin, CA.',
    keywords:
      'enroll academic programs, math enrollment, English enrollment, academic tutoring enrollment Dublin CA, Grades 1-12 enrollment',
    path: '/enroll-academic',
  },

  '/book-assessment': {
    title: 'Free Academic Assessment in Dublin, CA | GrowWise',
    description:
      'Book a free academic assessment for your child at GrowWise in Dublin, CA. Get expert evaluation in math or English and a personalized learning plan.',
    keywords:
      'free academic assessment Dublin CA, free assessment, placement assessment, math English evaluation, personalized learning plan, book assessment',
    path: '/book-assessment',
  },

  '/math-finals-practice-session': {
    title: 'Math Finals Sunday Session 12–1 | Dublin, CA | GrowWise',
    description:
      'Request a complimentary in-center high school math finals session (Sunday 12–1 pm) or four-session prep in Dublin, CA. Algebra 1 through Pre-Calculus.',
    keywords:
      'high school math finals prep, free math practice session, Dublin CA math tutoring, algebra finals, geometry finals, Pre-Calculus review, Tri-Valley math, GrowWise',
    path: '/math-finals-practice-session',
  },

  // Thank-you: runtime `generateMetadata` uses `buildFormThankYouMetadata` + `src/data/form-thank-you/en.json` (noindex).
  '/book-assessment/thank-you': {
    title: 'Assessment request received | GrowWise',
    description:
      'Thank you — we received your free assessment booking. Our team will contact you within 24 hours to confirm your appointment.',
    keywords: 'GrowWise, assessment, thank you, confirmation',
    path: '/book-assessment/thank-you',
  },
  '/enroll-academic/thank-you': {
    title: 'Academic enrollment request received | GrowWise',
    description:
      'Thank you for your academic enrollment request. We will connect with you within 24 hours.',
    keywords: 'GrowWise, academic enrollment, thank you',
    path: '/enroll-academic/thank-you',
  },
  '/enroll/thank-you': {
    title: 'Enrollment request received | GrowWise',
    description:
      'Thank you for your enrollment request. A GrowWise advisor will contact you within 24 hours.',
    keywords: 'GrowWise, enrollment, thank you',
    path: '/enroll/thank-you',
  },
  '/contact/thank-you': {
    title: 'Message received | GrowWise',
    description:
      'Thank you for contacting GrowWise. We will respond as soon as possible, typically within one business day.',
    keywords: 'GrowWise, contact, thank you',
    path: '/contact/thank-you',
  },

  '/camps': {
    title: 'Kids Camps Dublin CA | STEAM & Academic | GrowWise',
    description:
      'Summer and winter camps in Dublin, CA: coding, AI, robotics, math, and writing. Accredited programs for Grades 1–12. Reserve a spot.',
    keywords:
      'kids camps Dublin CA, summer camp Dublin, STEAM camp Tri-Valley, coding camp kids, winter camp Dublin, academic camp Dublin CA',
    path: '/camps',
  },

  '/camps/winter': {
    title: 'Winter Camp 2025 | Dublin CA | GrowWise',
    description:
      'GrowWise Winter Camp: academic and STEAM workshops during winter break in Dublin, CA. Reserve your week.',
    keywords:
      'winter camp 2025, winter break programs, academic winter camp, STEAM winter camp, winter tutoring Dublin CA, December camp',
    path: '/camps/winter',
  },

  '/camps/winter/calendar': {
    title: 'Winter Camp Schedule 2025 | GrowWise',
    description:
      'Winter camp workshop schedule in Dublin, CA. View dates, times, and themes. Reserve your spot early.',
    keywords:
      'winter camp schedule, winter camp calendar, workshop schedule, December camp schedule, winter break activities',
    path: '/camps/winter/calendar',
  },

  '/camps/summer': {
    title: 'Summer STEM Camps Dublin CA | AI, Coding & Math | GrowWise',
    description:
      'Summer STEM camps in Dublin and Tri-Valley: coding, AI, robotics, and math. Small groups. Reserve a spot.',
    keywords:
      'summer coding camp Dublin CA, summer STEAM camp Dublin CA 2026, coding camp kids Tri-Valley, summer math camp Dublin CA, AI camp for kids Dublin CA, robotics camp kids Dublin CA, game development camp kids, young authors camp summer 2026, summer camp 2026 Dublin CA, STEM camp Pleasanton, STEM camp San Ramon, coding camp Livermore, kids coding camp Danville, machine learning camp for kids, Python coding camp kids',
    path: '/camps/summer',
    image: 'https://growwiseschool.org/assets/camps/summer-camp-banner.png',
  },

  '/camps/summer/guide-success': {
    title: 'Thank You — Summer Camp Guide | GrowWise',
    description:
      'Thanks for requesting the GrowWise summer camp guide. Check email and reserve your week before seats fill.',
    keywords:
      'GrowWise summer camp, camp guide PDF, Dublin CA summer camp, STEM camp Tri-Valley, early bird summer camp',
    path: '/camps/summer/guide-success',
    image: 'https://growwiseschool.org/assets/camps/summer-camp-banner.png',
  },

  '/growwise-blogs': {
    title: 'GrowWise Blog | Math, English & Coding Tips',
    description:
      'Articles on tutoring, English, coding, and STEAM for Tri-Valley families. Practical tips from GrowWise educators.',
    keywords:
      'math tutoring tips, English tutoring advice, coding for kids, STEAM education, Grades 1-12 education blog, Dublin CA education, parenting tips, learning resources',
    path: '/growwise-blogs',
  },

  '/workshop-calendar': {
    title: 'Free Workshop Calendar | GrowWise Dublin',
    description:
      'Free Saturday workshops in Dublin, CA: reading, math, coding, and parent sessions. View dates and register.',
    keywords:
      'workshop calendar, free workshops, Saturday workshops, reading workshop, math olympiad, scratch coding, AI studio, parent webinar, Dublin CA',
    path: '/workshop-calendar',
  },

  '/privacy-policy': {
    title: 'Privacy Policy | GrowWise',
    description:
      'Read the GrowWise privacy policy. Learn how we collect, use, and protect your personal information.',
    keywords: 'GrowWise privacy policy, data protection, personal information',
    path: '/privacy-policy',
  },

  '/terms-conditions': {
    title: 'Terms & Conditions | GrowWise',
    description:
      'Read the GrowWise terms and conditions governing use of our website, programs, and services.',
    keywords: 'GrowWise terms conditions, terms of service, website terms',
    path: '/terms-conditions',
  },
}

/**
 * Get metadata configuration for a given path
 */
export function getMetadataConfig(path: string): PageMetadataConfig | null {
  // Normalize: empty string or "/" → lookup "/"; other paths strip leading/trailing slashes then prepend one
  if (path === '' || path === '/') {
    return metadataConfig['/'] || null
  }
  const stripped = path.replace(/^\/+|\/+$/g, '')
  const lookupPath = stripped === '' ? '/' : `/${stripped}`
  return metadataConfig[lookupPath] || null
}

/**
 * Get all metadata configs (useful for sitemap generation, etc.)
 */
export function getAllMetadataConfigs(): PageMetadataConfig[] {
  return Object.values(metadataConfig)
}
