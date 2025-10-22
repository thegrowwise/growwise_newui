import sgMail from '@sendgrid/mail';

export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
  message?: string;
}

export class EmailService {
  private static instance: EmailService;
  private isInitialized: boolean = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private initialize(): void {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SENDGRID_API_KEY not found in environment variables');
      return;
    }

    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.isInitialized = true;
      console.log('SendGrid email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SendGrid:', error);
    }
  }

  public isConfigured(): boolean {
    return this.isInitialized && !!process.env.SENDGRID_API_KEY;
  }

  public async sendContactNotification(contactData: any, submissionId: string): Promise<EmailResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'SendGrid not configured - SENDGRID_API_KEY missing'
      };
    }

    try {
      const msg = {
        to: [
          process.env.CONTACT_EMAIL_1 || 'info@growwise.com',
          process.env.CONTACT_EMAIL_2 || 'support@growwise.com'
        ],
        from: process.env.FROM_EMAIL || 'noreply@growwise.com',
        subject: `New Contact Form Submission from ${contactData.name}`,
        html: this.generateContactNotificationHTML(contactData, submissionId),
        text: this.generateContactNotificationText(contactData, submissionId)
      };

      await sgMail.send(msg);
      
      const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        emailId,
        message: 'Contact notification sent successfully'
      };

    } catch (error) {
      console.error('SendGrid contact notification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send contact notification'
      };
    }
  }

  public async sendConfirmationEmail(contactData: any, submissionId: string): Promise<EmailResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'SendGrid not configured - SENDGRID_API_KEY missing'
      };
    }

    try {
      const msg = {
        to: contactData.email,
        from: process.env.FROM_EMAIL || 'noreply@growwise.com',
        subject: 'Thank you for contacting GrowWise!',
        html: this.generateConfirmationHTML(contactData, submissionId),
        text: this.generateConfirmationText(contactData, submissionId)
      };

      await sgMail.send(msg);
      
      return {
        success: true,
        message: 'Confirmation email sent successfully'
      };

    } catch (error) {
      console.error('SendGrid confirmation email failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send confirmation email'
      };
    }
  }

  private generateContactNotificationHTML(contactData: any, submissionId: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #F16112; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone}</p>
          <p><strong>Source:</strong> ${contactData.source}</p>
          <p><strong>Submitted:</strong> ${new Date(contactData.timestamp).toLocaleString()}</p>
          <p><strong>Submission ID:</strong> ${submissionId}</p>
        </div>

        ${contactData.message ? `
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112;">
            <h3 style="color: #1F396D; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${contactData.message}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
          <h3 style="color: #1F396D; margin-top: 0;">Next Steps</h3>
          <ul>
            <li>Contact the lead within 24 hours</li>
            <li>Send personalized program information</li>
            <li>Schedule assessment or consultation if requested</li>
            <li>Add to CRM system for follow-up</li>
          </ul>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          This email was generated from the GrowWise website contact form.<br>
          IP Address: ${contactData.ip}<br>
          Submission ID: ${submissionId}
        </p>
      </div>
    `;
  }

  private generateContactNotificationText(contactData: any, submissionId: string): string {
    return `
      New Contact Form Submission
      
      Contact Information:
      Name: ${contactData.name}
      Email: ${contactData.email}
      Phone: ${contactData.phone}
      Source: ${contactData.source}
      Submitted: ${new Date(contactData.timestamp).toLocaleString()}
      Submission ID: ${submissionId}
      
      ${contactData.message ? `Message: ${contactData.message}` : ''}
      
      Next Steps:
      - Contact the lead within 24 hours
      - Send personalized program information
      - Schedule assessment or consultation if requested
      - Add to CRM system for follow-up
    `;
  }

  private generateConfirmationHTML(contactData: any, submissionId: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">Thank you for contacting GrowWise!</h2>
        
        <p>Dear ${contactData.name},</p>
        
        <p>Thank you for reaching out to us! We have received your message and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #F16112; margin-top: 0;">Your Submission Details</h3>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone}</p>
          <p><strong>Submission ID:</strong> ${submissionId}</p>
        </div>
        
        <p>In the meantime, feel free to explore our programs and courses on our website.</p>
        
        <p>Best regards,<br>The GrowWise Team</p>
      </div>
    `;
  }

  private generateConfirmationText(contactData: any, submissionId: string): string {
    return `
      Thank you for contacting GrowWise!
      
      Dear ${contactData.name},
      
      Thank you for reaching out to us! We have received your message and will get back to you within 24 hours.
      
      Your Submission Details:
      Name: ${contactData.name}
      Email: ${contactData.email}
      Phone: ${contactData.phone}
      Submission ID: ${submissionId}
      
      In the meantime, feel free to explore our programs and courses on our website.
      
      Best regards,
      The GrowWise Team
    `;
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();