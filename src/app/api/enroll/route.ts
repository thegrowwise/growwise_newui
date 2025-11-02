import { NextResponse } from 'next/server';

interface EnrollFormData {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  postal: string;
  bootcamp?: string;
  course?: string;
  level: string;
  agree: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email, 
      mobile, 
      city, 
      postal, 
      bootcamp, 
      course, 
      level, 
      agree 
    }: EnrollFormData = body;

    // Validate required fields
    if (!fullName || !email || !mobile || !city || !postal || !level) {
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
    const cleanPhone = mobile.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Validate agreement
    if (!agree) {
      return NextResponse.json(
        { error: 'You must agree to receive communications' },
        { status: 400 }
      );
    }

    // Prepare enrollment data
    const enrollmentData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      city: city.trim(),
      postal: postal.trim(),
      bootcamp: bootcamp?.trim() || 'None',
      course: course?.trim() || 'None',
      level: level.trim(),
      agree,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    // Send emails to both receiver and sender
    const emailResult = await sendEnrollmentEmails(enrollmentData);

    if (emailResult.success) {
      // Log the enrollment submission (in production, save to database)
      console.log('Enrollment form submission:', {
        ...enrollmentData,
        emailsSent: true,
        emailIds: emailResult.emailIds
      });

      return NextResponse.json({
        success: true,
        message: 'Enrollment information received successfully. We will contact you within 24 hours.',
        emailIds: emailResult.emailIds
      });
    } else {
      throw new Error(emailResult.error || 'Failed to send emails');
    }

  } catch (error) {
    console.error('Enrollment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: 'Failed to process your enrollment. Please try again or contact us directly.'
      },
      { status: 500 }
    );
  }
}

// Email service function for enrollment
async function sendEnrollmentEmails(enrollmentData: any) {
  try {
    // Send email to business (receiver)
    const businessEmailResult = await sendBusinessEnrollmentEmail(enrollmentData);
    
    // Send confirmation email to user (sender)
    const userEmailResult = await sendUserConfirmationEmail(enrollmentData);

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
    console.error('Enrollment email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send emails'
    };
  }
}

// Send email to business about new enrollment
async function sendBusinessEnrollmentEmail(enrollmentData: any) {
  try {
    const emailContent = {
      to: [
        'connect@thegrowwise.com', // Your business email
      ],
      subject: `New Course Enrollment from ${enrollmentData.fullName}`,
      html: generateBusinessEnrollmentEmailHTML(enrollmentData),
      text: generateBusinessEnrollmentEmailText(enrollmentData)
    };

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, replace this with actual email service call
    // Example with SendGrid, Mailgun, AWS SES, etc.

    const emailId = `enroll_business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Business enrollment email sent successfully:', {
      emailId,
      to: emailContent.to,
      subject: emailContent.subject,
      enrollmentData
    });

    return {
      success: true,
      emailId,
      message: 'Business email sent successfully'
    };

  } catch (error) {
    console.error('Business enrollment email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send business email'
    };
  }
}

// Send confirmation email to user
async function sendUserConfirmationEmail(enrollmentData: any) {
  try {
    const emailContent = {
      to: [enrollmentData.email],
      subject: 'Thank you for enrolling with GrowWise!',
      html: generateUserConfirmationEmailHTML(enrollmentData),
      text: generateUserConfirmationEmailText(enrollmentData)
    };

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, replace this with actual email service call

    const emailId = `enroll_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('User confirmation email sent successfully:', {
      emailId,
      to: emailContent.to,
      subject: emailContent.subject,
      enrollmentData
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
function generateBusinessEnrollmentEmailHTML(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1F396D;">New Course Enrollment</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #F16112; margin-top: 0;">Student Information</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Mobile:</strong> ${data.mobile}</p>
        <p><strong>Location:</strong> ${data.city}, ${data.postal}</p>
        <p><strong>Level:</strong> ${data.level}</p>
        <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112;">
        <h3 style="color: #1F396D; margin-top: 0;">Course Selection</h3>
        <p><strong>Bootcamp:</strong> ${data.bootcamp}</p>
        <p><strong>Course:</strong> ${data.course}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
        <h3 style="color: #1F396D; margin-top: 0;">Next Steps</h3>
        <ul>
          <li>Contact the student within 24 hours</li>
          <li>Send course materials and schedule</li>
          <li>Schedule placement assessment if needed</li>
          <li>Add to student management system</li>
          <li>Send welcome package</li>
        </ul>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">
        This email was generated from the GrowWise enrollment form.<br>
        IP Address: ${data.ip}
      </p>
    </div>
  `;
}

// Generate text email for business (receiver)
function generateBusinessEnrollmentEmailText(data: any) {
  return `
New Course Enrollment

Student Information:
Name: ${data.fullName}
Email: ${data.email}
Mobile: ${data.mobile}
Location: ${data.city}, ${data.postal}
Level: ${data.level}
Submitted: ${new Date(data.timestamp).toLocaleString()}

Course Selection:
Bootcamp: ${data.bootcamp}
Course: ${data.course}

Next Steps:
- Contact the student within 24 hours
- Send course materials and schedule
- Schedule placement assessment if needed
- Add to student management system
- Send welcome package
  `;
}

// Generate HTML email for user (sender)
function generateUserConfirmationEmailHTML(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1F396D; margin: 0;">Welcome to GrowWise!</h1>
        <p style="color: #F16112; font-size: 18px; margin: 10px 0;">Thank you for enrolling with us</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Your Enrollment Details</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Mobile:</strong> ${data.mobile}</p>
        <p><strong>Location:</strong> ${data.city}, ${data.postal}</p>
        <p><strong>Level:</strong> ${data.level}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112;">
        <h3 style="color: #1F396D; margin-top: 0;">Selected Programs</h3>
        <p><strong>Bootcamp:</strong> ${data.bootcamp}</p>
        <p><strong>Course:</strong> ${data.course}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
        <h3 style="color: #1F396D; margin-top: 0;">What Happens Next?</h3>
        <ul>
          <li>Our team will contact you within 24 hours</li>
          <li>We'll send you detailed course information</li>
          <li>We'll schedule your placement assessment</li>
          <li>You'll receive your welcome package</li>
          <li>We'll set up your learning account</li>
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
Welcome to GrowWise!

Thank you for enrolling with us.

Your Enrollment Details:
Name: ${data.fullName}
Email: ${data.email}
Mobile: ${data.mobile}
Location: ${data.city}, ${data.postal}
Level: ${data.level}

Selected Programs:
Bootcamp: ${data.bootcamp}
Course: ${data.course}

What Happens Next?
- Our team will contact you within 24 hours
- We'll send you detailed course information
- We'll schedule your placement assessment
- You'll receive your welcome package
- We'll set up your learning account

Visit our website: https://growwise.com

If you have any questions, please contact us at connect@thegrowwise.com
  `;
}
