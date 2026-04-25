import { CONTACT_INFO } from '@/lib/constants'

/**
 * Shared FAQ copy for the math finals practice landing (visible section + JSON-LD).
 * Keep in sync: page server JSON-LD and MathFinalsPracticeLanding Accordion.
 */
export const MATH_FINALS_PRACTICE_FAQS: ReadonlyArray<{
  question: string
  answer: string
}> = [
  {
    question: 'Is the Sunday 12–1 pm session free?',
    answer:
      'Yes. The complimentary in-center session is a preview in the Sunday 12–1 pm window—separate from the paid four-session prep course. It is not a full finals-prep package. Limited seats; registration is required.',
  },
  {
    question: 'Are Math Finals Prep sessions free?',
    answer:
      'No. Only the complimentary Sunday session (12–1 pm window) is free. Math Finals Prep refers to the four-session structured finals-period program, which is paid. Our team will explain enrollment, schedule, and investment when you are ready.',
  },
  {
    question: 'Who is this session for?',
    answer:
      'The preview hour is for high school students in the Tri-Valley and nearby areas who are preparing for end-of-year math finals and want focused, instructor-led practice. If you are unsure whether the level fits your student, share details in the form and we can confirm.',
  },
  {
    question: 'What subjects are covered?',
    answer:
      'The preview is designed to support final exam prep for high school courses in Algebra 1, Algebra 2, and Pre-Calculus. Your child should register for the subject that matches the course they are taking this year.',
  },
  {
    question: 'Do we have to join the full Math Finals Prep program?',
    answer:
      'No. The complimentary session is optional. Math Finals Prep is also optional—you can request the preview only, ask about the paid program only, or both. There is no pressure to continue.',
  },
  {
    question: 'Where is the session held?',
    answer: `The in-person preview is at the GrowWise center: ${CONTACT_INFO.street}, ${CONTACT_INFO.city} ${CONTACT_INFO.zipCode}. (Room or check-in details are confirmed when we follow up on your request.)`,
  },
  {
    question: 'Is this tutoring?',
    answer:
      'No. This is a structured finals practice session in the 12–1 pm window, not long-term tutoring. The goal is curriculum-aligned, exam-style practice and helping students identify what still needs review before their school exam.',
  },
  {
    question: 'Will this help if my child has major foundational gaps?',
    answer:
      'Probably not on its own. This session is best for students who need targeted finals review, not full remediation of months of missed material. If a student has deeper gaps, ongoing tutoring is usually the better fit.',
  },
  {
    question: 'What happens during the session?',
    answer:
      'The complimentary session is paced as a 2-hour experience (teaching and practice) aligned to Quarter 4 finals topics, with new topics in each session when offered on separate Sundays. The focus is finals-style work and what still needs attention before the school exam.',
  },
  {
    question: 'Is this online or in person?',
    answer: `This is an in-center session at GrowWise in ${CONTACT_INFO.city}, California.`,
  },
  {
    question: 'How many free sessions can a student book?',
    answer: 'One complimentary finals practice session per student.',
  },
  {
    question: 'Is this a good fit for strong students too?',
    answer:
      'Yes. Students who are already doing reasonably well can still benefit from timed, exam-style practice and a final check on weak areas before finals week.',
  },
  {
    question: 'What should students bring?',
    answer:
      'Students should bring the basics they would normally use for math work, such as pencils, an eraser, and any allowed calculator relevant to their course.',
  },
  {
    question: 'Why are you offering this for free?',
    answer:
      'We want local students to get one structured opportunity to practice before finals in a calm, academic setting. It also gives families a chance to experience how GrowWise runs focused math support sessions.',
  },
]
