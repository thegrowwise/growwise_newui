import { NextResponse } from 'next/server';
import { ContactFormData } from '@/components/chatbot/ContactForm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, source }: ContactFormData = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', errors: [{ field: 'name', message: 'Name, email and phone are required' }] },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format', errors: [{ field: 'email', message: 'Please enter a valid email address' }] },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone format', errors: [{ field: 'phone', message: 'Invalid phone format' }] },
        { status: 400 }
      );
    }

    // Validate message length (min 10 characters when provided)
    const messageVal = typeof message === 'string' ? message.trim() : '';
    if (messageVal.length > 0 && messageVal.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message must be at least 10 characters long',
          errors: [{ field: 'message', message: 'Message must be at least 10 characters long' }]
        },
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

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM system
    // 4. Send confirmation email to user

    // For now, we'll simulate the email sending process
    const emailResult = await sendContactEmail(contactData);

    if (emailResult.success) {
      // Log the contact submission (in production, save to database)
      console.log('Contact form submission:', {
        ...contactData,
        emailSent: true,
        emailId: emailResult.emailId
      });

      return NextResponse.json({
        success: true,
        message: 'Contact information received successfully. We will contact you within 24 hours.',
        emailId: emailResult.emailId
      });
    } else {
      throw new Error(emailResult.error || 'Failed to send email');
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        errors: [{ field: 'form', message: errorMessage }]
      },
      { status: 500 }
    );
  }
}

// Email service function
async function sendContactEmail(contactData: any) {
  try {
    // In a real application, you would integrate with:
    // - SendGrid, Mailgun, AWS SES, or similar email service
    // - Your backend email service
    // - CRM system like HubSpot, Salesforce, etc.

    // For demonstration, we'll simulate the email sending
    const emailContent = {
      to: [
        'connect@thegrowwise.com', // Your business email
      ],
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1F396D;">New Contact Form Submission</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #F16112; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone}</p>
            <p><strong>Source:</strong> ${contactData.source}</p>
            <p><strong>Submitted:</strong> ${new Date(contactData.timestamp).toLocaleString()}</p>
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
            IP Address: ${contactData.ip}
          </p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Contact Information:
        Name: ${contactData.name}
        Email: ${contactData.email}
        Phone: ${contactData.phone}
        Source: ${contactData.source}
        Submitted: ${new Date(contactData.timestamp).toLocaleString()}
        
        ${contactData.message ? `Message: ${contactData.message}` : ''}
        
        Next Steps:
        - Contact the lead within 24 hours
        - Send personalized program information
        - Schedule assessment or consultation if requested
        - Add to CRM system for follow-up
      `
    };

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, replace this with actual email service call
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: emailContent.to,
      from: process.env.FROM_EMAIL,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };
    
    await sgMail.send(msg);
    */

    // Simulate successful email sending
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Email sent successfully:', {
      emailId,
      to: emailContent.to,
      subject: emailContent.subject,
      contactData
    });

    return {
      success: true,
      emailId,
      message: 'Email sent successfully'
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}
