# Email Configuration Setup

This document explains how to configure email notifications for the contact form using SendGrid.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@growwise.com
CONTACT_EMAIL_1=info@growwise.com
CONTACT_EMAIL_2=support@growwise.com
```

## SendGrid Setup

1. **Create a SendGrid Account**
   - Go to [SendGrid](https://sendgrid.com/) and create an account
   - Verify your account via email

2. **Generate API Key**
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Choose "Restricted Access" and give it "Mail Send" permissions
   - Copy the generated API key

3. **Verify Sender Identity**
   - Go to Settings > Sender Authentication
   - Verify a single sender or domain
   - Use the verified email as your `FROM_EMAIL`

4. **Configure Environment Variables**
   - Add your API key to `SENDGRID_API_KEY`
   - Set `FROM_EMAIL` to your verified sender email
   - Set `CONTACT_EMAIL_1` and `CONTACT_EMAIL_2` to where you want to receive notifications

## Testing

After configuration, test the contact form to ensure emails are being sent successfully. Check the console logs for:

- `✅ email notification sent successfully` - Contact notification sent
- `✅ email notification sent successfully` - Confirmation email sent
- `❌ SendGrid contact notification failed: [error]` - If there are issues

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Check that your `SENDGRID_API_KEY` is correct
   - Ensure the API key has "Mail Send" permissions
   - Verify the sender email is authenticated

2. **"Forbidden" Error**
   - Check that your sender email is verified in SendGrid
   - Ensure the `FROM_EMAIL` matches a verified sender

3. **"Not Found" Error**
   - Verify your SendGrid account is active
   - Check that you're using the correct API key

### Debug Mode

To enable debug logging, you can add this to your `.env.local`:

```bash
DEBUG_EMAIL=true
```

This will provide more detailed logging about email sending attempts.

## Email Templates

The system sends two types of emails:

1. **Contact Notification** - Sent to your team when someone submits the contact form
2. **Confirmation Email** - Sent to the user confirming their submission

Both emails include:
- Contact information
- Submission ID for tracking
- Timestamp
- IP address (for notifications only)

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment-specific API keys for different deployments
- Regularly rotate your API keys
- Monitor your SendGrid usage and billing