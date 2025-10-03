export interface MathCourse {
  id: string;
  name: string;
  description: string;
  price: number;
  priceRange: string;
  duration: string;
  level: string;
  gradeLevel: string[];
  courseType: string[];
  alignment: string[];
  features: string[];
  image: string;
  originalPrice?: number;
}

export const mathCourses: MathCourse[] = [
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
      'Geometry basics',
      'Problem-solving strategies',
      'Small group instruction',
      'Regular assessments'
    ],
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop'
  },
  {
    id: 'elementary-math',
    name: 'Elementary Math Program',
    description: 'Aligned with California school district standards',
    price: 280,
    priceRange: '$280–$1280',
    duration: '10 weeks',
    level: 'Grades K-5',
    gradeLevel: ['Elementary'],
    courseType: ['Core Math'],
    alignment: ['California Standards'],
    features: [
      'Basic arithmetic fundamentals',
      'Number sense development',
      'Introduction to fractions',
      'Simple geometry concepts',
      'Interactive learning activities',
      'Age-appropriate instruction'
    ],
    image: 'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?w=400&h=300&fit=crop'
  },
  {
    id: 'math-course-1-2',
    name: 'Math Course 1/2',
    description: '100% aligned with PUSD and DUSD',
    price: 280,
    priceRange: '$280–$1280',
    duration: '14 weeks',
    level: 'Grades 6-7',
    gradeLevel: ['Middle School'],
    courseType: ['Core Math'],
    alignment: ['DUSD Aligned', 'PUSD Aligned'],
    features: [
      'Perfectly aligned with DUSD and PUSD curriculum',
      'Comprehensive middle school foundations',
      'Pre-algebra preparation',
      'District-specific standards',
      'Personalized instruction',
      'Progress tracking'
    ],
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop'
  },
  {
    id: 'math-course-3',
    name: 'Math Course 3',
    description: 'Accelerated Math for Grade 7',
    price: 280,
    priceRange: '$280–$1280',
    duration: '12 weeks',
    level: 'Grade 7',
    gradeLevel: ['Middle School'],
    courseType: ['Accelerated'],
    alignment: ['California Standards'],
    features: [
      'Accelerated curriculum for advanced students',
      'Grade 7 advanced mathematics',
      'Pre-algebra mastery',
      'Advanced problem-solving',
      'Challenging assignments',
      'College prep foundation'
    ],
    image: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=400&h=300&fit=crop'
  },
  {
    id: 'math-integrated-1',
    name: 'Math Course Integrated 1',
    description: 'Double Accelerated Math for Grade 7',
    price: 280,
    priceRange: '$280–$1280',
    duration: '16 weeks',
    level: 'Grade 7',
    gradeLevel: ['Middle School'],
    courseType: ['Double Accelerated'],
    alignment: ['California Standards'],
    features: [
      'Double accelerated curriculum',
      'High school level mathematics',
      'Integrated math approach',
      'Advanced algebraic concepts',
      'Rigorous coursework',
      'Exceptional student preparation'
    ],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
  },
  {
    id: 'math-integrated-2',
    name: 'Math Course Integrated 2',
    description: 'Double Accelerated Math for Grade 7',
    price: 280,
    priceRange: '$280–$1280',
    duration: '16 weeks',
    level: 'Grade 7',
    gradeLevel: ['Middle School'],
    courseType: ['Double Accelerated'],
    alignment: ['California Standards'],
    features: [
      'Advanced integrated mathematics',
      'Continuation of Integrated 1',
      'Complex algebraic concepts',
      'Geometry integration',
      'High school preparation',
      'Advanced problem solving'
    ],
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop'
  },
  {
    id: 'algebra-1',
    name: 'Algebra 1',
    description: '100% aligned with DUSD and PUSD',
    price: 360,
    priceRange: '$360–$1160',
    duration: '18 weeks',
    level: 'Grades 9-10',
    gradeLevel: ['High School'],
    courseType: ['Core Math'],
    alignment: ['DUSD Aligned', 'PUSD Aligned'],
    features: [
      'Complete Algebra 1 curriculum',
      'DUSD and PUSD alignment',
      'Linear equations mastery',
      'Quadratic functions',
      'Graphing techniques',
      'High school preparation'
    ],
    image: 'https://images.unsplash.com/photo-1635070041409-bbf03b61710a?w=400&h=300&fit=crop'
  },
  {
    id: 'algebra-2',
    name: 'Algebra 2',
    description: '100% aligned with DUSD and PUSD',
    price: 360,
    priceRange: '$360–$1160',
    duration: '18 weeks',
    level: 'Grades 10-11',
    gradeLevel: ['High School'],
    courseType: ['Core Math'],
    alignment: ['DUSD Aligned', 'PUSD Aligned'],
    features: [
      'Advanced Algebra 2 concepts',
      'Perfect DUSD and PUSD alignment',
      'Polynomial functions',
      'Exponential and logarithmic functions',
      'Trigonometry introduction',
      'College readiness preparation'
    ],
    image: 'https://images.unsplash.com/photo-1635070041701-cc4d4d4b8ca4?w=400&h=300&fit=crop'
  }
];