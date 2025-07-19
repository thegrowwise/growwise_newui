import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchContentStart, fetchContentSuccess, fetchContentFailure } from '../slices/contentSlice';
import { ContentData } from '../slices/contentSlice';

// Mock API function - this can be easily replaced with a real API call
async function fetchContentAPI(): Promise<ContentData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
      description: "Founded with a vision to revolutionize education, GrowWise School has been at the forefront of innovative learning for over a decade. Our commitment to excellence and personalized attention sets us apart.",
      imageUrl: "/images/about-school.jpg"
    },
    testimonials: [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Parent",
        content: "GrowWise has transformed my child's learning experience. The teachers are amazing and the personalized approach really works!",
        avatar: "/images/testimonials/sarah.jpg"
      },
      {
        id: "2",
        name: "Michael Chen",
        role: "Parent",
        content: "The modern facilities and dedicated staff make GrowWise the perfect choice for our family. Highly recommended!",
        avatar: "/images/testimonials/michael.jpg"
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        role: "Alumni",
        content: "My time at GrowWise prepared me for success in college and beyond. The foundation I received here was invaluable.",
        avatar: "/images/testimonials/emily.jpg"
      }
    ],
    contact: {
      title: "Get in Touch",
      description: "Ready to start your child's journey with GrowWise? Contact us today to learn more about our programs and schedule a visit.",
      email: "info@growwise.edu",
      phone: "+1 (555) 123-4567",
      address: "123 Education Street, Learning City, LC 12345"
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