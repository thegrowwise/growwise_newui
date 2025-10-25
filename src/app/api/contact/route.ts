import { NextResponse } from 'next/server';
import { ContactFormData } from '@/components/chatbot/ContactForm';
import { emailService } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, source }: ContactFormData = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Prepare contact data
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message?.trim() || '',
      source: source || 'chatbot',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    // Generate unique submission ID
    const submissionId = `CF-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    // Send contact form notification
    console.log('📤 Sending contact_form notification via email');
    const contactNotificationResult = await emailService.sendContactNotification(contactData, submissionId);
    
    // Send confirmation email to user
    console.log('📤 Sending confirmation notification via email');
    const confirmationResult = await emailService.sendConfirmationEmail(contactData, submissionId);
    
    // Log the submission with notification results
    const notifications = {
      email: {
        success: contactNotificationResult.success,
        error: contactNotificationResult.success ? null : contactNotificationResult.error
      }
    };
    
    console.log('📊 Contact form submission logged:', {
      timestamp: contactData.timestamp,
      submissionId,
      name: contactData.name,
      email: contactData.email,
      subject: contactData.message || 'Contact Form Submission',
      ip: contactData.ip,
      userAgent: request.headers.get('user-agent') || 'Unknown',
      notifications
    });

    if (contactNotificationResult.success) {
      console.log('✅ email notification sent successfully');
    } else {
      console.log('❌ SendGrid contact notification failed:', contactNotificationResult.error);
    }
    
    if (confirmationResult.success) {
      console.log('✅ email notification sent successfully');
    } else {
      console.log('❌ SendGrid confirmation email failed:', confirmationResult.error);
    }
    
    // Always return success to user, even if emails fail
    return NextResponse.json({
      success: true,
      message: 'Contact information received successfully. We will contact you within 24 hours.',
      submissionId,
      emailId: contactNotificationResult.emailId,
      ...(contactNotificationResult.success && confirmationResult.success ? {} : {
        warning: 'Some email notifications failed, but your information was received'
      })
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: 'Failed to process your request. Please try again or contact us directly.'
      },
      { status: 500 }
    );
  }
}

