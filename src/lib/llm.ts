interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  content: string;
  error?: string;
}

// GrowWise specific context for the LLM
const GROWWISE_CONTEXT = `
You are a helpful assistant for GrowWise, an educational platform serving Tri-Valley families with comprehensive K-12 academic programs and exciting STEAM courses.

About GrowWise:
- We serve 300+ students with 25+ courses
- 98% student satisfaction rate
- Expert instructors with years of experience
- Personalized 1:1 attention and small group learning

K-12 Academic Programs:
- Math Courses: Elementary Math, Middle School Math, DUSD Accelerated Math, High School Math (including Calculus)
- ELA Courses: English Mastery K-12, Reading Enrichment, Grammar Boost
- Writing Lab: Creative Writing, Essay Writing, Create & Reflect programs
- SAT/ACT Prep: Math Test Prep, Online SAT Test Prep, Online ACT Test Prep

STEAM Programs:
- Game Development: Roblox Studio, Scratch visual programming, Minecraft coding
- Python Programming: Python Kickstart (beginner), Python Power Up (intermediate), Python Pro (advanced)
- Young Founders: Youth CEO leadership program, I Am Brand personal branding
- ML/Gen AI: Prompt Engineering, AI for Everyone, ML/AI for Highschoolers

Popular Courses:
- Python Coding (Project-based learning)
- Math Mastery (1:1 attention)
- AI Explorer (Future-ready skills)
- Reading Mastery (Accelerated growth)

Services:
- FREE 60-minute assessment for K-12 programs
- FREE 30-minute trial class for STEAM courses
- Competitive pricing (contact for details)
- Expert instructors and proven results

Testimonials:
- Sarah Johnson (Parent): "GrowWise transformed my daughter's approach to learning. She went from struggling with math to excelling in advanced courses."
- Michael Chen (Student): "The STEAM programs opened up a whole new world. I'm now pursuing computer science in college!"
- Lisa Rodriguez (Parent): "The personalized attention and innovative teaching methods make GrowWise stand out."

Always be helpful, friendly, and informative. If you don't know something specific, direct them to contact GrowWise directly for more information.
`;

export class LLMService {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async generateResponse(messages: ChatMessage[]): Promise<LLMResponse> {
    if (!this.apiKey) {
      return {
        content: "I'm sorry, but the AI service is not configured. Please contact GrowWise directly for assistance.",
        error: 'API key not configured'
      };
    }

    try {
      // Add system context to messages
      const systemMessage: ChatMessage = {
        role: 'system',
        content: GROWWISE_CONTEXT
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [systemMessage, ...messages],
          max_tokens: 500,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
      };
    } catch (error) {
      console.error('LLM API Error:', error);
      return {
        content: "I'm experiencing technical difficulties. Please try again or contact GrowWise directly for assistance.",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Fallback to rule-based responses if LLM fails
  getFallbackResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! Welcome to GrowWise! 🎓 We're a leading educational platform serving Tri-Valley families with comprehensive K-12 academic programs and exciting STEAM courses. How can I help you today?";
    }
    
    if (input.includes('course') || input.includes('program')) {
      return "We offer comprehensive K-12 academic programs and exciting STEAM courses! Our K-12 programs include Math, ELA, Writing Lab, and SAT/ACT prep. For STEAM, we have Game Development, Python Programming, Young Founders, and ML/AI courses. Would you like to know more about any specific program?";
    }
    
    if (input.includes('assessment') || input.includes('trial') || input.includes('free')) {
      return "We offer FREE assessments and trial classes! 🎓 K-12 Programs: 60-minute FREE assessment. 🚀 STEAM Courses: 30-minute trial class. These help us create a personalized learning plan for your child. Would you like to book one?";
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('fee')) {
      return "We offer competitive pricing for all our programs. For the most accurate pricing information, I'd recommend booking a free assessment where our team can provide detailed information based on your specific needs. Would you like to schedule a free assessment?";
    }
    
    if (input.includes('contact') || input.includes('phone') || input.includes('email')) {
      return "You can reach us through our website contact form, phone, or email. We're here to answer any questions about our programs and help you get started on your learning journey! Our team is responsive and will get back to you within 24 hours.";
    }
    
    return "That's a great question! I'd be happy to help you with that. GrowWise offers comprehensive K-12 academic programs and exciting STEAM courses. Could you provide a bit more detail about what specific information you're looking for?";
  }
}

export const llmService = new LLMService();
