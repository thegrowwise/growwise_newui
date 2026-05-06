import type { FAQItem } from '@/components/schema/FAQSchema'
import { CONTACT_INFO } from '@/lib/constants'

export const MATH_COURSE_FAQ_JSONLD: FAQItem[] = [
  {
    question: 'Does GrowWise offer math tutoring in Dublin CA?',
    answer:
      'Yes. GrowWise offers in-person math tutoring for grades 1–12 at 4564 Dublin Blvd, Dublin, CA. Programs cover elementary math through AP Precalculus and SAT prep.',
  },
  {
    question: 'What math subjects does GrowWise tutor?',
    answer:
      'GrowWise tutors all K-12 math subjects including elementary math, middle school math, Algebra 1, Algebra 2, Geometry, Precalculus, AP Precalculus, and SAT Math.',
  },
  {
    question: 'How is GrowWise math tutoring different?',
    answer:
      'Classes are small — 4 to 8 students — and instruction is structured around building deep understanding, not just test prep. Students track real progress each session.',
  },
]

export const ENGLISH_COURSE_FAQ_JSONLD: FAQItem[] = [
  {
    question: 'Does GrowWise offer English tutoring in Dublin CA?',
    answer:
      'Yes. GrowWise offers in-person English, reading, and writing classes for grades 1–12 in Dublin, CA at 4564 Dublin Blvd.',
  },
  {
    question: 'What English programs does GrowWise offer?',
    answer:
      'GrowWise offers reading comprehension, essay writing, grammar, creative writing, and English Language Arts tutoring for grades 1–12 in the Tri-Valley area.',
  },
]

/** Visible accordion FAQs on /courses/math — single source for UI + merged JSON-LD in layout */
export const MATH_COURSE_VISIBLE_FAQS: FAQItem[] = [
  {
    question: 'What math courses do you offer at GrowWise?',
    answer:
      'We offer comprehensive Grades 1-12 math courses including grade-level math (aligned with California Common Core Standards), accelerated math programs, and integrated math 1 & 2. Our courses cover Algebra, Geometry, Pre-Calculus, and more. All programs are aligned with DUSD and PUSD curriculum standards.',
  },
  {
    question: 'How do I know which math course is right for my child?',
    answer:
      "We offer a free 60-minute placement assessment to evaluate your child's current math level and identify strengths and areas for improvement. Our education experts will recommend the perfect math program based on the assessment results, your child's grade level, and learning goals.",
  },
  {
    question: 'Are your math courses aligned with school curriculum?',
    answer:
      "Yes, our math courses are aligned with Dublin Unified School District (DUSD) and Pleasanton Unified School District (PUSD) standards, as well as California Common Core Standards (CACCS). This ensures your child's learning at GrowWise complements their school curriculum.",
  },
  {
    question: 'What is the difference between grade-level, accelerated, and integrated math?',
    answer:
      'Grade-level math follows the standard curriculum pace for each grade. Accelerated math moves at a faster pace, allowing students to cover more material. Integrated math combines algebra, geometry, and statistics into a unified approach, which is common in many modern high school curricula.',
  },
  {
    question: 'How much does math tutoring cost at GrowWise?',
    answer: `Our math courses start at $35 per session. Pricing may vary based on the specific program, class size, and duration. We offer flexible scheduling options and packages. Contact us at ${CONTACT_INFO.phone} or ${CONTACT_INFO.email} for detailed pricing information.`,
  },
  {
    question: 'Do you offer online or in-person math tutoring?',
    answer:
      'We offer in-person math tutoring at our Dublin, CA location. Our modern facility provides the perfect environment for focused learning. Contact us to learn more about our current class formats and availability.',
  },
  {
    question: 'What makes GrowWise math tutoring different from other tutoring centers?',
    answer:
      'GrowWise offers personalized math instruction with expert tutors, small class sizes, and curriculum alignment with local school districts. We provide proven results, flexible scheduling, and a supportive learning environment. Our instructors are experienced educators who understand both the curriculum and how to help students succeed.',
  },
]

/** Visible accordion FAQs on /courses/english */
export const ENGLISH_COURSE_VISIBLE_FAQS: FAQItem[] = [
  {
    question: 'What English courses do you offer at GrowWise?',
    answer:
      'We offer comprehensive English Language Arts courses for Grades 1-12 students, including reading comprehension, vocabulary development, grammar and mechanics, essay writing, creative writing, and literary analysis. All courses are aligned with California Common Core Standards.',
  },
  {
    question: 'How do I know which English course is right for my child?',
    answer:
      "We offer a free 60-minute placement assessment to evaluate your child's current English level, reading comprehension, and writing skills. Our education experts will recommend the perfect English program based on the assessment results and your child's grade level.",
  },
  {
    question: 'Are your English courses aligned with school curriculum?',
    answer:
      'Yes, our English Language Arts courses are aligned with California Common Core Standards, ensuring your child\'s learning at GrowWise complements their school curriculum. We also align with Dublin Unified School District (DUSD) and Pleasanton Unified School District (PUSD) standards.',
  },
  {
    question: 'What is included in your English tutoring program?',
    answer:
      'Our English programs cover reading comprehension strategies, vocabulary building, grammar and mechanics, essay writing (narrative, expository, persuasive), creative writing, literary analysis, and test preparation. We provide personalized instruction tailored to each student\'s needs.',
  },
  {
    question: 'How much does English tutoring cost at GrowWise?',
    answer: `Our English courses start at $35 per session. Pricing may vary based on the specific program, class size, and duration. We offer flexible scheduling options and packages. Contact us at ${CONTACT_INFO.phone} or ${CONTACT_INFO.email} for detailed pricing information.`,
  },
  {
    question: 'Do you help with college application essays?',
    answer:
      'Yes, our high school English programs include college application essay writing support. We help students craft compelling personal statements and essays that showcase their unique strengths and experiences.',
  },
  {
    question: 'What makes GrowWise English tutoring different?',
    answer:
      'GrowWise offers personalized English instruction with expert tutors, small class sizes, and curriculum alignment with local school districts. We focus on building strong reading and writing skills through proven methodologies, providing detailed feedback, and creating a supportive learning environment.',
  },
]

export const MATH_COURSE_MERGED_FAQ_JSONLD: FAQItem[] = [
  ...MATH_COURSE_FAQ_JSONLD,
  ...MATH_COURSE_VISIBLE_FAQS,
]

export const ENGLISH_COURSE_MERGED_FAQ_JSONLD: FAQItem[] = [
  ...ENGLISH_COURSE_FAQ_JSONLD,
  ...ENGLISH_COURSE_VISIBLE_FAQS,
]

export const BOOK_ASSESSMENT_FAQ_JSONLD: FAQItem[] = [
  {
    question: 'Is the GrowWise academic assessment free?',
    answer:
      'Yes. GrowWise offers a free academic assessment for new students to identify learning gaps and recommend the right program. Book online or call (925) 456-4606.',
  },
  {
    question: 'What happens after I book an assessment at GrowWise?',
    answer:
      "After submitting the form, a GrowWise team member will contact you within 24 hours to schedule your child's free in-person assessment at our Dublin, CA center.",
  },
]
