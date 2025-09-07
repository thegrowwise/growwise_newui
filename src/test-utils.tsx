import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import contentReducer from './store/slices/contentSlice'

// Create a mock store for testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      content: contentReducer,
    },
    preloadedState: {
      content: {
        data: null,
        loading: false,
        error: null,
      },
    },
  })
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: ReturnType<typeof createTestStore>
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { store = createTestStore(), ...renderOptions } = options

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Mock data for testing
export const mockEnglishCourses = [
  {
    id: 'reading-enrichment-k-5',
    name: 'Reading Enrichment K-5',
    description: 'Comprehensive reading program focusing on Reading, Annotations, Brainstorming, and Vocabulary development for elementary students.',
    level: 'Elementary',
    duration: 'Flexible',
    gradeLevel: ['Elementary'],
    courseType: ['Core English'],
    alignment: ['California Standards', 'DUSD Aligned', 'PUSD Aligned'],
    priceRange: '$216 - $648',
    price: 216,
    originalPrice: null,
    features: [
      'Phonics and decoding strategies',
      'Reading comprehension techniques',
    ],
    detailedDescription: 'Our Reading Enrichment program for K-5 students builds strong literacy foundations.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  }
]

export const mockMathCourses = [
  {
    id: 'middle-school-math',
    name: 'Middle School Math Program',
    description: 'Aligned with California school district standards',
    price: 280,
    priceRange: '$280–$1152',
    duration: '12 weeks',
    level: 'Grades 6-8',
    gradeLevel: ['Middle School'],
    courseType: ['Core Math'],
    alignment: ['California Standards'],
    features: [
      'Comprehensive curriculum aligned with California standards',
      'Pre-algebra foundations',
    ],
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop'
  }
]

// Common test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver
}

export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn()
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.ResizeObserver = mockResizeObserver
}



