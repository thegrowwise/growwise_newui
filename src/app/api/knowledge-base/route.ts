import { NextRequest, NextResponse } from 'next/server';
import { CONTACT_INFO } from '@/lib/constants';

/**
 * Knowledge Base API
 * Provides structured information that can be queried dynamically
 * This allows the LLM to retrieve specific information on-demand
 * instead of having everything in the context (cost-effective)
 */

interface KnowledgeBaseEntry {
  category: string;
  key: string;
  value: string | string[];
  metadata?: Record<string, any>;
}

// Structured knowledge base - easy to maintain and extend
const KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  // Contact Information
  {
    category: 'contact',
    key: 'phone',
    value: CONTACT_INFO.phone,
    metadata: { format: 'phone', clickable: true }
  },
  {
    category: 'contact',
    key: 'email',
    value: CONTACT_INFO.email,
    metadata: { format: 'email', clickable: true }
  },
  {
    category: 'contact',
    key: 'address',
    value: CONTACT_INFO.address,
    metadata: { format: 'address', clickable: true }
  },
  {
    category: 'contact',
    key: 'formattedAddress',
    value: CONTACT_INFO.formattedAddress,
  },
  {
    category: 'contact',
    key: 'businessEmail',
    value: CONTACT_INFO.businessEmail,
  },
  {
    category: 'contact',
    key: 'enrollmentEmail',
    value: CONTACT_INFO.enrollmentEmail,
  },
  
  // Programs
  {
    category: 'programs',
    key: 'k12',
    value: [
      'Math Courses: Elementary Math, Middle School Math, DUSD Accelerated Math, High School Math (including Calculus)',
      'ELA Courses: English Mastery K-12, Reading Enrichment, Grammar Boost',
      'Writing Lab: Creative Writing, Essay Writing, Create & Reflect programs',
      'SAT/ACT Prep: Math Test Prep, Online SAT Test Prep, Online ACT Test Prep'
    ]
  },
  {
    category: 'programs',
    key: 'steam',
    value: [
      'Game Development: Roblox Studio, Scratch visual programming, Minecraft coding',
      'Python Programming: Python Kickstart (beginner), Python Power Up (intermediate), Python Pro (advanced)',
      'Young Founders: Youth CEO leadership program, I Am Brand personal branding',
      'ML/Gen AI: Prompt Engineering, AI for Everyone, ML/AI for Highschoolers'
    ]
  },
  
  // Services
  {
    category: 'services',
    key: 'assessments',
    value: 'FREE 60-minute assessment for K-12 programs',
  },
  {
    category: 'services',
    key: 'trials',
    value: 'FREE 30-minute trial class for STEAM courses',
  },
  
  // Statistics
  {
    category: 'statistics',
    key: 'students',
    value: '325+ students enrolled',
  },
  {
    category: 'statistics',
    key: 'courses',
    value: '25+ courses offered',
  },
  {
    category: 'statistics',
    key: 'satisfaction',
    value: '98% student satisfaction rate',
  },
  
  // Popular Courses
  {
    category: 'courses',
    key: 'popular',
    value: [
      'Python Coding (Project-based learning)',
      'Math Mastery (1:1 attention)',
      'AI Explorer (Future-ready skills)',
      'Reading Mastery (Accelerated growth)'
    ]
  },
];

/**
 * Search knowledge base by category, key, or keyword
 */
function searchKnowledgeBase(query: string): KnowledgeBaseEntry[] {
  const lowerQuery = query.toLowerCase();
  
  return KNOWLEDGE_BASE.filter(entry => {
    // Search in category
    if (entry.category.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in key
    if (entry.key.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in value
    const valueStr = Array.isArray(entry.value) 
      ? entry.value.join(' ').toLowerCase()
      : entry.value.toLowerCase();
    
    if (valueStr.includes(lowerQuery)) {
      return true;
    }
    
    return false;
  });
}

/**
 * Get knowledge base entry by category and key
 */
function getEntry(category: string, key: string): KnowledgeBaseEntry | null {
  return KNOWLEDGE_BASE.find(
    entry => entry.category === category && entry.key === key
  ) || null;
}

/**
 * Get all entries in a category
 */
function getCategory(category: string): KnowledgeBaseEntry[] {
  return KNOWLEDGE_BASE.filter(entry => entry.category === category);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const key = searchParams.get('key');
    
    // If specific category and key requested
    if (category && key) {
      const entry = getEntry(category, key);
      if (entry) {
        return NextResponse.json({ 
          success: true,
          data: entry 
        });
      }
      return NextResponse.json({ 
        success: false,
        error: 'Entry not found' 
      }, { status: 404 });
    }
    
    // If category requested
    if (category) {
      const entries = getCategory(category);
      return NextResponse.json({ 
        success: true,
        data: entries 
      });
    }
    
    // If search query provided
    if (query) {
      const results = searchKnowledgeBase(query);
      return NextResponse.json({ 
        success: true,
        data: results,
        count: results.length
      });
    }
    
    // Return all entries (limited to prevent large responses)
    return NextResponse.json({ 
      success: true,
      data: KNOWLEDGE_BASE,
      count: KNOWLEDGE_BASE.length
    });
    
  } catch (error) {
    console.error('Knowledge Base API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

