import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchContentStart, fetchContentSuccess, fetchContentFailure } from '../slices/contentSlice';
import { ContentData } from '../slices/contentSlice';
import { CONTACT_INFO } from '@/lib/constants';
import { siteGoogleTrustReviewCards } from '@/lib/siteGoogleTrustReviews';

// Mock API function - this can be easily replaced with a real API call
async function fetchContentAPI(): Promise<ContentData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const googleReviews = siteGoogleTrustReviewCards();

  // For now, return mock data
  // In production, this would be: return fetch('/api/content').then(res => res.json());
  return {
    hero: {
      title: "GrowWise School",
      subtitle: "Empowering Future Leaders",
      description: "Transform your child's education with our innovative learning approach that combines traditional values with modern technology.",
      ctaText: "Enroll Now",
      ctaLink: "/enroll"
    },
    features: [
      {
        id: "1",
        title: "Personalized Learning",
        description: "Tailored curriculum designed to meet each student's unique learning style and pace.",
        icon: "🎯"
      },
      {
        id: "2",
        title: "Expert Teachers",
        description: "Experienced educators committed to nurturing academic excellence and character development.",
        icon: "👨‍🏫"
      },
      {
        id: "3",
        title: "Modern Facilities",
        description: "State-of-the-art classrooms and technology to enhance the learning experience.",
        icon: "🏫"
      },
      {
        id: "4",
        title: "Holistic Development",
        description: "Focus on academic, social, emotional, and physical development of every child.",
        icon: "🌟"
      }
    ],
    about: {
      title: "About GrowWise",
      description:
        "GrowWise School offers personalized K-12 and STEAM learning in Dublin, CA—with expert instructors and programs aligned to local schools.",
      imageUrl: "/images/about-school.jpg"
    },
    testimonials: [
      {
        id: '1',
        name: googleReviews[0].name,
        role: googleReviews[0].role,
        content: googleReviews[0].content,
        avatar: '',
      },
      {
        id: '2',
        name: googleReviews[1].name,
        role: googleReviews[1].role,
        content: googleReviews[1].content,
        avatar: '',
      },
      {
        id: '3',
        name: googleReviews[2].name,
        role: googleReviews[2].role,
        content: googleReviews[2].content,
        avatar: '',
      },
    ],
    contact: {
      title: "Get in Touch",
      description: "Ready to start your child's journey with GrowWise? Contact us today to learn more about our programs and schedule a visit.",
      email: CONTACT_INFO.email,
      phone: CONTACT_INFO.phone,
      address: CONTACT_INFO.address
    },
    navigation: {
      logo: "GrowWise",
      menuItems: [
        { id: "1", label: "Home", href: "/" },
        { id: "2", label: "About", href: "/about" },
        { id: "3", label: "Programs", href: "/programs" },
        { id: "4", label: "Admissions", href: "/admissions" },
        { id: "5", label: "Contact", href: "/contact" }
      ]
    },
    footer: {
      description: "Empowering students to reach their full potential through innovative education and personalized learning experiences.",
      socialLinks: [
        { id: "1", platform: "Facebook", url: "https://facebook.com/growwise", icon: "📘" },
        { id: "2", platform: "Twitter", url: "https://twitter.com/growwise", icon: "🐦" },
        { id: "3", platform: "Instagram", url: "https://instagram.com/growwise", icon: "📷" },
        { id: "4", platform: "LinkedIn", url: "https://linkedin.com/company/growwise", icon: "💼" }
      ],
      links: [
        { id: "1", label: "Privacy Policy", url: "/privacy" },
        { id: "2", label: "Terms of Service", url: "/terms" },
        { id: "3", label: "Careers", url: "/careers" },
        { id: "4", label: "Newsletter", url: "/newsletter" }
      ]
    }
  };
}

function* fetchContentSaga() {
  try {
    const content: ContentData = yield call(fetchContentAPI);
    yield put(fetchContentSuccess(content));
  } catch (error) {
    yield put(fetchContentFailure(error instanceof Error ? error.message : 'Failed to fetch content'));
  }
}

export function* watchFetchContent() {
  yield takeLatest(fetchContentStart.type, fetchContentSaga);
} 