/**
 * Shared constants for the GrowWise application
 */

// Contact Information
export const CONTACT_INFO = {
  phone: '(925) 456-4606',
  email: 'connect@thegrowwise.com',
  businessEmail: 'connect@thegrowwise.com',
  enrollmentEmail: 'connect@thegrowwise.com',
  replyToEmails: ['connect@thegrowwise.com', 'thegrowwise@gmail.com'],
  address: '4564 Dublin Blvd, Dublin, CA 94568',
  formattedAddress: '📍 4564 Dublin Blvd, Dublin, CA',
  city: 'Dublin, CA',
  street: '4564 Dublin Blvd',
  zipCode: '94568',
} as const;

// Convenience exports for common use cases
export const PHONE_PLACEHOLDER = CONTACT_INFO.phone;
export const EMAIL = CONTACT_INFO.email;
export const BUSINESS_EMAIL = CONTACT_INFO.businessEmail;
export const ADDRESS = CONTACT_INFO.address;
export const FORMATTED_ADDRESS = CONTACT_INFO.formattedAddress;
export const CITY = CONTACT_INFO.city;

