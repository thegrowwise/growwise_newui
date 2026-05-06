import type { FAQItem } from '@/components/schema/FAQSchema'

/** Prepended to summer hub FAQ JSON-LD (deduped against mock FAQ list by question text). */
export const SUMMER_HUB_PRIORITY_FAQS: FAQItem[] = [
  {
    question: 'What age groups are GrowWise summer camps for?',
    answer:
      'GrowWise summer camps in Dublin, CA are designed for students in grades 3–12, ages 8–18. Each camp is grouped by skill level, not just age.',
  },
  {
    question: 'Where are GrowWise summer camps held?',
    answer:
      'All GrowWise summer camps are held in-person at 4564 Dublin Blvd, Dublin, CA 94568 in the Tri-Valley area.',
  },
  {
    question: 'What summer camps does GrowWise offer?',
    answer:
      'GrowWise offers AI Studio, Game Development, Robotics, Math Olympiad, and Young Authors summer camps for grades 3–12 in Dublin, CA.',
  },
  {
    question: 'How do I enroll my child in a GrowWise summer camp?',
    answer:
      'Book a free academic assessment at growwiseschool.org/book-assessment or call (925) 456-4606. Spots are limited to 8–12 students per camp.',
  },
  {
    question: 'Are GrowWise summer camps worth it?',
    answer:
      'Students leave with a real project they built — a working game, a trained AI model, a published story, or a robot. Not a certificate. Something they made.',
  },
]
