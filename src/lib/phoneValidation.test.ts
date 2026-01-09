/**
 * Phone Validation Test Suite
 * 
 * Run with: npm test phoneValidation.test.ts
 * or: npx jest phoneValidation.test.ts
 */

import {
  validatePhone,
  validatePhoneByCallingCode,
  getPhonePlaceholder,
  getPhonePlaceholderByCallingCode
} from './phoneValidation';

describe('Phone Validation', () => {
  describe('US (+1, 10 digits)', () => {
    test('valid: +1 5551234567', () => {
      const result = validatePhone('US', '+1 5551234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
      expect(result.errorMessage).toBeNull();
    });

    test('valid: +1 (555) 123-4567', () => {
      const result = validatePhone('US', '+1 (555) 123-4567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
    });

    test('valid: +15551234567', () => {
      const result = validatePhone('US', '+15551234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
    });

    test('invalid: missing country code', () => {
      const result = validatePhone('US', '5551234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Include country code');
    });

    test('invalid: too short', () => {
      const result = validatePhone('US', '+1 555123456');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('10 digits');
    });

    test('invalid: too long', () => {
      const result = validatePhone('US', '+1 55512345678');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('10 digits');
    });
  });

  describe('India (+91, 10 digits, first digit 6-9)', () => {
    test('valid: +91 9876543210', () => {
      const result = validatePhone('IN', '+91 9876543210');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+919876543210');
    });

    test('valid: +91 8123456789', () => {
      const result = validatePhone('IN', '+91 8123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+918123456789');
    });

    test('valid: +91 7123456789', () => {
      const result = validatePhone('IN', '+91 7123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+917123456789');
    });

    test('valid: +91 6123456789', () => {
      const result = validatePhone('IN', '+91 6123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+916123456789');
    });

    test('invalid: starts with 5', () => {
      const result = validatePhone('IN', '+91 5123456789');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('start with');
    });

    test('invalid: starts with 4', () => {
      const result = validatePhone('IN', '+91 4123456789');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('start with');
    });
  });

  describe('United Kingdom (+44, 10 digits, remove leading 0)', () => {
    test('valid: +44 7123456789', () => {
      const result = validatePhone('GB', '+44 7123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+447123456789');
    });

    test('valid: +44 07123456789 (leading 0 removed)', () => {
      const result = validatePhone('GB', '+44 07123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+447123456789');
    });

    test('valid: +44 (0) 7123 456789', () => {
      const result = validatePhone('GB', '+44 (0) 7123 456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+447123456789');
    });
  });

  describe('UAE (+971, 9 digits)', () => {
    test('valid: +971 501234567', () => {
      const result = validatePhone('AE', '+971 501234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+971501234567');
    });

    test('invalid: wrong length', () => {
      const result = validatePhone('AE', '+971 50123456');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('9 digits');
    });
  });

  describe('Singapore (+65, 8 digits)', () => {
    test('valid: +65 91234567', () => {
      const result = validatePhone('SG', '+65 91234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+6591234567');
    });
  });

  describe('Australia (+61, 9 digits, remove leading 0)', () => {
    test('valid: +61 412345678', () => {
      const result = validatePhone('AU', '+61 412345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+61412345678');
    });

    test('valid: +61 0412345678 (leading 0 removed)', () => {
      const result = validatePhone('AU', '+61 0412345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+61412345678');
    });
  });

  describe('Germany (+49, 10-11 digits, remove leading 0)', () => {
    test('valid: +49 3012345678 (10 digits)', () => {
      const result = validatePhone('DE', '+49 3012345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+493012345678');
    });

    test('valid: +49 30123456789 (11 digits)', () => {
      const result = validatePhone('DE', '+49 30123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+4930123456789');
    });

    test('valid: +49 030 1234 5678 (leading 0 removed)', () => {
      const result = validatePhone('DE', '+49 030 1234 5678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+493012345678');
    });
  });

  describe('France (+33, 9 digits, remove leading 0)', () => {
    test('valid: +33 612345678', () => {
      const result = validatePhone('FR', '+33 612345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+33612345678');
    });

    test('valid: +33 0612345678 (leading 0 removed)', () => {
      const result = validatePhone('FR', '+33 0612345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+33612345678');
    });
  });

  describe('validatePhoneByCallingCode', () => {
    test('valid: +1 with calling code', () => {
      const result = validatePhoneByCallingCode('+1', '+1 5551234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
    });

    test('valid: +91 with calling code', () => {
      const result = validatePhoneByCallingCode('+91', '+91 9876543210');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+919876543210');
    });

    test('invalid: missing + in input', () => {
      const result = validatePhoneByCallingCode('+1', '5551234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Include country code');
    });
  });

  describe('Generic/Unknown Country', () => {
    test('valid: generic E.164', () => {
      const result = validatePhone('XX', '+1234567890');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+1234567890');
    });

    test('invalid: too short', () => {
      const result = validatePhone('XX', '+1234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('8 and 15 digits');
    });

    test('invalid: too long', () => {
      const result = validatePhone('XX', '+1234567890123456');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('8 and 15 digits');
    });
  });

  describe('Placeholder functions', () => {
    test('getPhonePlaceholder for US', () => {
      const placeholder = getPhonePlaceholder('US');
      expect(placeholder).toBe('+1 (555) 123-4567');
    });

    test('getPhonePlaceholder for IN', () => {
      const placeholder = getPhonePlaceholder('IN');
      expect(placeholder).toBe('+91 98765 43210');
    });

    test('getPhonePlaceholderByCallingCode for +1', () => {
      const placeholder = getPhonePlaceholderByCallingCode('+1');
      expect(placeholder).toBe('+1 (555) 123-4567');
    });

    test('getPhonePlaceholder for unknown country', () => {
      const placeholder = getPhonePlaceholder('XX');
      expect(placeholder).toBe('+1 (555) 123-4567'); // Default
    });
  });

  describe('Edge Cases', () => {
    test('empty input', () => {
      const result = validatePhone('US', '');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('8 and 15 digits');
    });

    test('only plus sign', () => {
      const result = validatePhone('US', '+');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('8 and 15 digits');
    });

    test('only country code', () => {
      const result = validatePhone('US', '+1');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('8 and 15 digits');
    });

    test('whitespace handling', () => {
      const result = validatePhone('US', '  +1 555 123 4567  ');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
    });

    test('special characters', () => {
      const result = validatePhone('US', '+1 (555) 123-4567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
    });
  });
});


