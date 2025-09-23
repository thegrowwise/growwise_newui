# Contact Form Integration Setup

## Overview
The chatbot has been enhanced with a contact form that collects user information (name, email, phone) and sends it to a backend server for email processing.

## Features Implemented

### 1. Contact Form Component (`src/components/chatbot/ContactForm.tsx`)
- Collects: First Name, Last Name, Email, Phone Number, Optional Message
- Form validation with real-time error feedback
- Loading states and success/error handling
- Responsive design with Tailwind CSS

### 2. API Endpoint (`src/app/api/contact/route.ts`)
- Handles POST requests to `/api/contact`
- Validates form data (email format, phone format)
- Simulates email sending (ready for real email service integration)
- Returns success/error responses

### 3. Contact Service (`src/lib/contactService.ts`)
- Singleton service for handling contact form submissions
- Form validation utilities
- Phone number formatting
- Error handling and retry logic

### 4. Enhanced Chatbot (`src/components/chatbot/Chatbot.tsx`)
- Triggers contact form for specific queries:
  - Assessment/Trial requests
  - Pricing inquiries
  - Scheduling/Booking requests
- Seamless integration with existing chat flow
- Form submission handling with success/error states

## How It Works

### Trigger Conditions
The contact form appears when users ask about:
- **Assessments/Trials**: "free assessment", "trial class", "demo"
- **Pricing**: "price", "cost", "fee", "payment"
- **Scheduling**: "schedule", "book", "appointment", "register", "enroll"

### User Flow
1. User asks a qualifying question
2. Bot responds with information + contact form
3. User fills out form with contact details
4. Form submits to `/api/contact` endpoint
5. Backend processes and sends email notification
6. User receives confirmation message

## Email Service Integration

### Current Implementation
- Simulates email sending with console logging
- Ready for integration with real email services

### To Integrate Real Email Service

#### Option 1: SendGrid
```bash
npm install @sendgrid/mail
```

Add to `.env.local`:
```
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@growwise.com
```

#### Option 2: Mailgun
```bash
npm install mailgun-js
```

Add to `.env.local`:
```
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-domain.com
FROM_EMAIL=noreply@growwise.com
```

#### Option 3: AWS SES
```bash
npm install aws-sdk
```

Add to `.env.local`:
```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
FROM_EMAIL=noreply@growwise.com
```

### Email Template
The system sends formatted emails with:
- Contact information
- User message (if provided)
- Timestamp and source tracking
- Next steps for follow-up

## Database Integration (Optional)

To store contact submissions in a database:

1. Set up your preferred database (PostgreSQL, MongoDB, etc.)
2. Add database connection to `.env.local`
3. Update `/api/contact/route.ts` to save submissions
4. Add contact management dashboard

## Testing

### Test the Contact Form
1. Open the chatbot
2. Ask: "I want to book a free assessment"
3. Fill out the contact form
4. Check console logs for email simulation
5. Verify success message appears

### Test Different Triggers
- "What are your prices?"
- "How do I schedule a trial class?"
- "I want to enroll my child"

## Customization

### Modify Form Fields
Edit `src/components/chatbot/ContactForm.tsx`:
- Add/remove form fields
- Update validation rules
- Change styling

### Update Bot Responses
Edit `src/components/chatbot/Chatbot.tsx`:
- Modify trigger conditions
- Update response messages
- Add new contact form triggers

### Customize Email Template
Edit `src/app/api/contact/route.ts`:
- Update email HTML template
- Modify email recipients
- Add additional email content

## Security Considerations

- Form validation on both client and server
- Rate limiting (implement if needed)
- Input sanitization
- CSRF protection (Next.js handles this)
- Email validation and phone number validation

## Production Deployment

1. Set up real email service
2. Configure environment variables
3. Test email delivery
4. Set up monitoring and logging
5. Configure backup email service if needed

## Support

For questions or issues with the contact form integration, check:
- Console logs for error messages
- Network tab for API call status
- Email service logs for delivery issues
