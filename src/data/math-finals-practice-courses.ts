/**
 * Finals prep by level — on-page cards and JSON-LD OfferCatalog (keep in sync).
 */
export const MATH_FINALS_PREP_COURSES = [
  {
    key: 'algebra-1',
    title: 'Algebra 1 Finals Prep',
    topics: [
      'linear equations',
      'inequalities',
      'graphing lines',
      'slope',
      'systems of equations',
      'exponents',
      'polynomials',
      'factoring basics',
      'word problems',
    ],
    /** Used in @graph Course description */
    schemaDescription:
      'Exam-style review for Algebra 1 final exams, including linear equations, inequalities, graphing, systems, exponents, polynomials, factoring basics, and word problems.',
  },
  {
    key: 'algebra-2',
    title: 'Algebra 2 Finals Prep',
    topics: [
      'quadratics',
      'polynomial functions',
      'rational expressions',
      'radical expressions',
      'exponential functions',
      'logarithms',
      'transformations',
      'complex numbers if covered',
    ],
    schemaDescription:
      'Focused review for Algebra 2 final exams, including quadratics, polynomial and rational functions, exponentials, logarithms, transformations, and related topics as covered in your class.',
  },
  {
    key: 'precalculus',
    title: 'Precalculus Finals Prep',
    topics: [
      'functions',
      'transformations',
      'polynomial and rational functions',
      'exponential and logarithmic functions',
      'unit circle',
      'trigonometry',
      'identities',
      'inverse functions',
      'conic sections if covered',
    ],
    schemaDescription:
      'Structured Precalculus finals review covering functions, transformations, polynomial and rational functions, exponential and logarithmic functions, trigonometry, the unit circle, identities, and related topics as covered in your class.',
  },
  {
    key: 'ap-precalculus',
    title: 'AP Precalculus Finals Prep',
    topics: [
      'function modeling',
      'graph interpretation',
      'polynomial and rational functions',
      'exponential and logarithmic functions',
      'trigonometric functions',
      'calculator and non-calculator problem types',
    ],
    schemaDescription:
      'AP Precalculus finals preparation focused on function modeling, graph interpretation, polynomial and rational functions, exponential and logarithmic functions, and trigonometric functions, including calculator and non-calculator problem types as your course emphasizes.',
  },
] as const
