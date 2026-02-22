import { ContactFormData } from '@/components/chatbot/ContactForm';
import { BACKEND_URL } from './config';

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  emailId?: string;
  error?: string;
}

export class ContactService {
  private static instance: ContactService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = BACKEND_URL;
  }

  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  /**
   * Submit contact form data to the backend
   */
  async submitContactForm(data: ContactFormData): Promise<ContactSubmissionResult> {
    try {
      // Transform the data to match backend expectations
      // Use name field directly, or construct from firstName/lastName if name is not provided
      const name = data.name?.trim() || `${data.firstName || ''} ${data.lastName || ''}`.trim();
      
      const backendData = {
        name: name,
        email: data.email?.trim() || '',
        phone: data.phone?.trim() || '',
        subject: data.subject || 'Contact Form Submission from Chatbot',
        message: data.message?.trim() || 'User requested personalized information through chatbot.',
        // Additional metadata
        program: data.program || '',
        gradeLevel: data.gradeLevel || '',
        preferredContact: data.preferredContact || 'email'
      };

      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: result.message || 'Contact information submitted successfully',
        emailId: result.submissionId
      };

    } catch (error) {
      console.error('ContactService Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: 'Failed to submit contact information. Please try again or contact us directly.'
      };
    }
  }

  /**
   * Validate contact form data
   */
  validateContactData(data: ContactFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  }

  /**
   * Send follow-up email to user (if needed)
   */
  async sendConfirmationEmail(email: string, name: string): Promise<ContactSubmissionResult> {
    try {
      // This would typically call a separate API endpoint for sending confirmation emails
      // For now, we'll just log it
      console.log('Sending confirmation email to:', { email, name });
      
      return {
        success: true,
        message: 'Confirmation email sent successfully'
      };
    } catch (error) {
      console.error('Confirmation email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send confirmation email',
        message: 'Contact information received, but confirmation email failed to send'
      };
    }
  }

  /**
   * Get contact form analytics (for admin purposes)
   */
  async getContactAnalytics(): Promise<any> {
    try {
      // This would typically call an admin API endpoint
      // For now, return mock data
      return {
        totalSubmissions: 0,
        todaySubmissions: 0,
        sourceBreakdown: {
          chatbot: 0,
          website: 0,
          referral: 0
        }
      };
    } catch (error) {
      console.error('Analytics error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const contactService = ContactService.getInstance();
