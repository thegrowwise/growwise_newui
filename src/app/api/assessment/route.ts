import { NextResponse } from 'next/server';

interface AssessmentFormData {
  parentName: string;
  email: string;
  countryCode: string;
  phone: string;
  studentName: string;
  grade: string;
  subjects: string[];
  assessmentType: string;
  mode: string;
  schedule: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      parentName,
      email,
      countryCode,
      phone,
      studentName,
      grade,
      subjects,
      assessmentType,
      mode,
      schedule,
      notes
    }: AssessmentFormData = body;

    // Validate required fields
    if (!parentName || !email || !phone || !studentName || !grade || !assessmentType || !mode || !schedule) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation - can be enhanced with phone validation utility)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid phone format' 
        },
        { status: 400 }
      );
    }

    // Prepare assessment data
    const assessmentData = {
      parentName: parentName.trim(),
      email: email.trim().toLowerCase(),
      countryCode: countryCode.trim(),
      phone: phone.trim(),
      studentName: studentName.trim(),
      grade: grade.trim(),
      subjects: subjects || [],
      assessmentType: assessmentType.trim(),
      mode: mode.trim(),
      schedule: schedule.trim(),
      notes: notes?.trim() || '',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    // Send emails to both receiver and sender
    const emailResult = await sendAssessmentEmails(assessmentData);

    if (emailResult.success) {
      // Log the assessment submission (in production, save to database)
      console.log('Assessment booking submission:', {
        ...assessmentData,
        emailsSent: true,
        emailIds: emailResult.emailIds
      });

      return NextResponse.json({
        success: true,
        message: 'Assessment booking received successfully. We will contact you within 24 hours to confirm your appointment.',
        emailIds: emailResult.emailIds
      });
    } else {
      throw new Error(emailResult.error || 'Failed to send emails');
    }

  } catch (error) {
    console.error('Assessment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: 'Failed to process your assessment booking. Please try again or contact us directly.'
      },
      { status: 500 }
    );
  }
}

// Email service function for assessment
async function sendAssessmentEmails(assessmentData: any) {
  try {
    // Send email to business (receiver)
    const businessEmailResult = await sendBusinessAssessmentEmail(assessmentData);
    
    // Send confirmation email to user (sender)
    const userEmailResult = await sendUserConfirmationEmail(assessmentData);

    if (businessEmailResult.success && userEmailResult.success) {
      return {
        success: true,
        emailIds: {
          business: businessEmailResult.emailId,
          user: userEmailResult.emailId
        },
        message: 'Both emails sent successfully'
      };
    } else {
      return {
        success: false,
        error: `Business email: ${businessEmailResult.success ? 'sent' : 'failed'}, User email: ${userEmailResult.success ? 'sent' : 'failed'}`
      };
    }

  } catch (error) {
    console.error('Assessment email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send emails'
    };
  }
}

// Send email to business about new assessment booking
async function sendBusinessAssessmentEmail(assessmentData: any) {
  try {
    const emailContent = {
      to: [
        'connect@thegrowwise.com', // Your business email
      ],
      subject: `New Assessment Booking from ${assessmentData.parentName}`,
      html: generateBusinessAssessmentEmailHTML(assessmentData),
      text: generateBusinessAssessmentEmailText(assessmentData)
    };

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, replace this with actual email service call
    // Example with SendGrid, Mailgun, AWS SES, etc.

    const emailId = `assessment_business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Business assessment email sent successfully:', {
      emailId,
      to: emailContent.to,
      subject: emailContent.subject,
      assessmentData
    });

    return {
      success: true,
      emailId,
      message: 'Business email sent successfully'
    };

  } catch (error) {
    console.error('Business assessment email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send business email'
    };
  }
}

// Send confirmation email to user
async function sendUserConfirmationEmail(assessmentData: any) {
  try {
    const emailContent = {
      to: [assessmentData.email],
      subject: 'Thank you for booking an assessment with GrowWise!',
      html: generateUserConfirmationEmailHTML(assessmentData),
      text: generateUserConfirmationEmailText(assessmentData)
    };

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, replace this with actual email service call

    const emailId = `assessment_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('User confirmation email sent successfully:', {
      emailId,
      to: emailContent.to,
      subject: emailContent.subject,
      assessmentData
    });

    return {
      success: true,
      emailId,
      message: 'User confirmation email sent successfully'
    };

  } catch (error) {
    console.error('User confirmation email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send user confirmation email'
    };
  }
}

// Generate HTML email for business (receiver)
function generateBusinessAssessmentEmailHTML(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1F396D;">New Assessment Booking</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #F16112; margin-top: 0;">Parent/Guardian Information</h3>
        <p><strong>Name:</strong> ${data.parentName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.countryCode} ${data.phone}</p>
        <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Student Information</h3>
        <p><strong>Student Name:</strong> ${data.studentName}</p>
        <p><strong>Grade:</strong> ${data.grade}</p>
        <p><strong>Subjects:</strong> ${data.subjects && data.subjects.length > 0 ? data.subjects.join(', ') : 'Not specified'}</p>
      </div>

      <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Assessment Details</h3>
        <p><strong>Assessment Type:</strong> ${data.assessmentType}</p>
        <p><strong>Mode:</strong> ${data.mode}</p>
        <p><strong>Preferred Schedule:</strong> ${data.schedule}</p>
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <h3 style="color: #1F396D; margin-top: 0;">Next Steps</h3>
        <ul>
          <li>Contact the parent within 24 hours to confirm the assessment</li>
          <li>Schedule the assessment based on preferred time</li>
          <li>Send assessment preparation materials</li>
          <li>Add to calendar and student management system</li>
          <li>Send reminder email 24 hours before assessment</li>
        </ul>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">
        This email was generated from the GrowWise assessment booking form.<br>
        IP Address: ${data.ip}
      </p>
    </div>
  `;
}

// Generate text email for business (receiver)
function generateBusinessAssessmentEmailText(data: any) {
  return `
New Assessment Booking

Parent/Guardian Information:
Name: ${data.parentName}
Email: ${data.email}
Phone: ${data.countryCode} ${data.phone}
Submitted: ${new Date(data.timestamp).toLocaleString()}

Student Information:
Student Name: ${data.studentName}
Grade: ${data.grade}
Subjects: ${data.subjects && data.subjects.length > 0 ? data.subjects.join(', ') : 'Not specified'}

Assessment Details:
Assessment Type: ${data.assessmentType}
Mode: ${data.mode}
Preferred Schedule: ${data.schedule}
${data.notes ? `Notes: ${data.notes}` : ''}

Next Steps:
- Contact the parent within 24 hours to confirm the assessment
- Schedule the assessment based on preferred time
- Send assessment preparation materials
- Add to calendar and student management system
- Send reminder email 24 hours before assessment
  `;
}

// Generate HTML email for user (sender)
function generateUserConfirmationEmailHTML(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1F396D; margin: 0;">Thank You for Booking!</h1>
        <p style="color: #F16112; font-size: 18px; margin: 10px 0;">Your assessment request has been received</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Booking Details</h3>
        <p><strong>Student Name:</strong> ${data.studentName}</p>
        <p><strong>Grade:</strong> ${data.grade}</p>
        <p><strong>Assessment Type:</strong> ${data.assessmentType}</p>
        <p><strong>Mode:</strong> ${data.mode}</p>
        <p><strong>Preferred Schedule:</strong> ${data.schedule}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">What Happens Next?</h3>
        <ul>
          <li>Our team will contact you within 24 hours to confirm your assessment appointment</li>
          <li>We'll send you assessment preparation materials</li>
          <li>You'll receive a calendar invitation with the confirmed date and time</li>
          <li>We'll send a reminder email 24 hours before your assessment</li>
          <li>After the assessment, we'll provide detailed feedback and recommendations</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://growwise.com" style="background-color: #1F396D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Visit Our Website
        </a>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        This email was sent from GrowWise Educational Services<br>
        If you have any questions, please contact us at connect@thegrowwise.com
      </p>
    </div>
  `;
}

// Generate text email for user (sender)
function generateUserConfirmationEmailText(data: any) {
  return `
Thank You for Booking!

Your assessment request has been received.

Booking Details:
Student Name: ${data.studentName}
Grade: ${data.grade}
Assessment Type: ${data.assessmentType}
Mode: ${data.mode}
Preferred Schedule: ${data.schedule}

What Happens Next?
- Our team will contact you within 24 hours to confirm your assessment appointment
- We'll send you assessment preparation materials
- You'll receive a calendar invitation with the confirmed date and time
- We'll send a reminder email 24 hours before your assessment
- After the assessment, we'll provide detailed feedback and recommendations

Visit our website: https://growwise.com

If you have any questions, please contact us at connect@thegrowwise.com
  `;
}

