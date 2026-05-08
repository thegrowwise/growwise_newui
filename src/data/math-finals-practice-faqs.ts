import { CONTACT_INFO } from '@/lib/constants'

/**
 * Shared FAQ copy for the math finals landing (visible section + JSON-LD).
 * Keep in sync: page server JSON-LD and MathFinalsPracticeLanding Accordion.
 */
export const MATH_FINALS_PRACTICE_FAQS: ReadonlyArray<{
  question: string
  answer: string
}> = [
  {
    question: 'What is Math Finals Prep?',
    answer:
      'Math Finals Prep is GrowWise’s four-session, structured program for high school students preparing for end-of-year math finals. It focuses on exam-style practice and Quarter 4–aligned review for Algebra 1, Algebra 2, and Pre-Calculus—not reteaching an entire course in one sitting.',
  },
  {
    question: 'Who is this program for?',
    answer:
      'It is for high school students in the Tri-Valley and nearby areas who want focused finals-period support before exams. If you are unsure about level or pacing, share details in the form and we can confirm fit.',
  },
  {
    question: 'What subjects are covered?',
    answer:
      'The program supports final exam prep for high school Algebra 1, Algebra 2, and Pre-Calculus. Register for the track that matches the course your student is taking this year.',
  },
  {
    question: 'How do we enroll or get schedule details?',
    answer:
      'Submit the request form. Our team will follow up by email or phone with session timing, structure, and enrollment steps—including investment—so you can decide with full information.',
  },
  {
    question: 'Where is the program held?',
    answer: `Sessions are in person at the GrowWise center: ${CONTACT_INFO.street}, ${CONTACT_INFO.city} ${CONTACT_INFO.zipCode}. (Room or check-in details are confirmed when we follow up.)`,
  },
  {
    question: 'Is this the same as ongoing tutoring?',
    answer:
      'No. This is a time-bound finals prep program with a defined scope. Students who need long-term or full-course remediation usually benefit more from regular tutoring than from a short finals sequence alone.',
  },
  {
    question: 'Will this help if my child has major foundational gaps?',
    answer:
      'Probably not on its own. The program works best for students who need targeted finals review, not for catching up on months of missed material. If there are deeper gaps, ongoing tutoring is often the better fit.',
  },
  {
    question: 'What happens during the sessions?',
    answer:
      'Across the four sessions, students get instructor-led review and exam-style practice aligned to Quarter 4 finals topics, with attention to what still needs work before the school exam. Exact pacing is adjusted to the group and course track.',
  },
  {
    question: 'Is this online or in person?',
    answer: `This program runs in person at GrowWise in ${CONTACT_INFO.city}, California.`,
  },
  {
    question: 'Is this a good fit for strong students too?',
    answer:
      'Yes. Students who are already doing well can still benefit from timed, exam-style practice and a final check on weak areas before finals week.',
  },
  {
    question: 'What should students bring?',
    answer:
      'Students should bring what they normally use for math work—pencils, an eraser, and any calculator allowed for their school course, if applicable.',
  },
]
