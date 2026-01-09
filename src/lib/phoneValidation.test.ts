/**
 * Phone Validation Test Suite
 * 
 * Run with: npm test phoneValidation.test.ts
 * or: npx jest phoneValidation.test.ts
 * 
 * IMPORTANT: Tests assume user enters ONLY national number (no "+" and no country code).
 */

import {
  validatePhone,
  getPhonePlaceholder,
  getCallingCode
} from './phoneValidation';

describe('Phone Validation', () => {
  describe('US (+1, 10 digits)', () => {
    test('valid: 5551234567', () => {
      const result = validatePhone('US', '5551234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
      expect(result.nationalNumber).toBe('5551234567');
      expect(result.callingCode).toBe('+1');
      expect(result.errorMessage).toBeNull();
    });

    test('valid: (555) 123-4567', () => {
      const result = validatePhone('US', '(555) 123-4567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
      expect(result.nationalNumber).toBe('5551234567');
    });

    test('valid: 555-123-4567', () => {
      const result = validatePhone('US', '555-123-4567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+15551234567');
    });

    test('invalid: includes country code with +', () => {
      const result = validatePhone('US', '+1 5551234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Do not include country code');
    });

    test('invalid: includes country code without +', () => {
      const result = validatePhone('US', '15551234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Do not include country code');
    });

    test('invalid: too short', () => {
      const result = validatePhone('US', '555123456');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('10 digits');
    });

    test('invalid: too long', () => {
      const result = validatePhone('US', '55512345678');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('10 digits');
    });
  });

  describe('India (+91, 10 digits, first digit 6-9)', () => {
    test('valid: 9876543210', () => {
      const result = validatePhone('IN', '9876543210');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+919876543210');
      expect(result.nationalNumber).toBe('9876543210');
      expect(result.callingCode).toBe('+91');
    });

    test('valid: 8123456789', () => {
      const result = validatePhone('IN', '8123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+918123456789');
    });

    test('valid: 7123456789', () => {
      const result = validatePhone('IN', '7123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+917123456789');
    });

    test('valid: 6123456789', () => {
      const result = validatePhone('IN', '6123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+916123456789');
    });

    test('invalid: includes country code', () => {
      const result = validatePhone('IN', '+91 9876543210');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Do not include country code');
    });

    test('invalid: starts with 5', () => {
      const result = validatePhone('IN', '5123456789');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('start with');
    });

    test('invalid: starts with 4', () => {
      const result = validatePhone('IN', '4123456789');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('start with');
    });
  });

  describe('United Kingdom (+44, 10 digits, remove leading 0)', () => {
    test('valid: 7123456789', () => {
      const result = validatePhone('GB', '7123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+447123456789');
      expect(result.nationalNumber).toBe('7123456789');
    });

    test('valid: 07123456789 (leading 0 removed)', () => {
      const result = validatePhone('GB', '07123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+447123456789');
      expect(result.nationalNumber).toBe('7123456789');
    });

    test('valid: 7123 456789', () => {
      const result = validatePhone('GB', '7123 456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+447123456789');
    });

    test('invalid: includes country code', () => {
      const result = validatePhone('GB', '+44 7123456789');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Do not include country code');
    });
  });

  describe('UAE (+971, 9 digits)', () => {
    test('valid: 501234567', () => {
      const result = validatePhone('AE', '501234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+971501234567');
      expect(result.nationalNumber).toBe('501234567');
    });

    test('invalid: wrong length', () => {
      const result = validatePhone('AE', '50123456');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('9 digits');
    });
  });

  describe('Singapore (+65, 8 digits)', () => {
    test('valid: 91234567', () => {
      const result = validatePhone('SG', '91234567');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+6591234567');
      expect(result.nationalNumber).toBe('91234567');
    });
  });

  describe('Australia (+61, 9 digits, remove leading 0)', () => {
    test('valid: 412345678', () => {
      const result = validatePhone('AU', '412345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+61412345678');
      expect(result.nationalNumber).toBe('412345678');
    });

    test('valid: 0412345678 (leading 0 removed)', () => {
      const result = validatePhone('AU', '0412345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+61412345678');
      expect(result.nationalNumber).toBe('412345678');
    });
  });

  describe('Germany (+49, 10-11 digits, remove leading 0)', () => {
    test('valid: 3012345678 (10 digits)', () => {
      const result = validatePhone('DE', '3012345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+493012345678');
      expect(result.nationalNumber).toBe('3012345678');
    });

    test('valid: 30123456789 (11 digits)', () => {
      const result = validatePhone('DE', '30123456789');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+4930123456789');
      expect(result.nationalNumber).toBe('30123456789');
    });

    test('valid: 030 1234 5678 (leading 0 removed)', () => {
      const result = validatePhone('DE', '030 1234 5678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+493012345678');
      expect(result.nationalNumber).toBe('3012345678');
    });
  });

  describe('France (+33, 9 digits, remove leading 0)', () => {
    test('valid: 612345678', () => {
      const result = validatePhone('FR', '612345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+33612345678');
      expect(result.nationalNumber).toBe('612345678');
    });

    test('valid: 0612345678 (leading 0 removed)', () => {
      const result = validatePhone('FR', '0612345678');
      expect(result.isValid).toBe(true);
      expect(result.e164).toBe('+33612345678');
      expect(result.nationalNumber).toBe('612345678');
    });
  });

  describe('Edge Cases', () => {
    test('empty input', () => {
      const result = validatePhone('US', '');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('enter a phone number');
    });

    test('whitespace only', () => {
      const result = validatePhone('US', '   ');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('enter a phone number');
    });

    test('missing country', () => {
      const result = validatePhone(null, '5551234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('select a country');
    });

    test('unknown country', () => {
      const result = validatePhone('XX', '5551234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('not supported');
      expect(result.warningMessage).toContain('Country-specific format not applied');
    });

    test('input contains + anywhere', () => {
      const result = validatePhone('US', '+5551234567');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Do not include country code');
    });

    test('special characters normalized', () => {
      const result = validatePhone('US', '(555) 123-4567');
      expect(result.isValid).toBe(true);
      expect(result.nationalNumber).toBe('5551234567');
      expect(result.e164).toBe('+15551234567');
    });
  });

  describe('Placeholder functions', () => {
    test('getPhonePlaceholder for US', () => {
      const placeholder = getPhonePlaceholder('US');
      expect(placeholder).toBe('(555) 123-4567');
    });

    test('getPhonePlaceholder for IN', () => {
      const placeholder = getPhonePlaceholder('IN');
      expect(placeholder).toBe('98765 43210');
    });

    test('getPhonePlaceholder for unknown country', () => {
      const placeholder = getPhonePlaceholder('XX');
      expect(placeholder).toBe('(555) 123-4567'); // Default
    });

    test('getCallingCode for US', () => {
      const code = getCallingCode('US');
      expect(code).toBe('+1');
    });

    test('getCallingCode for IN', () => {
      const code = getCallingCode('IN');
      expect(code).toBe('+91');
    });

    test('getCallingCode for unknown country', () => {
      const code = getCallingCode('XX');
      expect(code).toBeNull();
    });
  });

  describe('Validation Result Structure', () => {
    test('valid result has all fields', () => {
      const result = validatePhone('US', '5551234567');
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('e164');
      expect(result).toHaveProperty('nationalNumber');
      expect(result).toHaveProperty('callingCode');
      expect(result).toHaveProperty('errorMessage');
      expect(result).toHaveProperty('warningMessage');
    });

    test('invalid result has null e164 and nationalNumber', () => {
      const result = validatePhone('US', '');
      expect(result.e164).toBeNull();
      expect(result.nationalNumber).toBeNull();
      expect(result.callingCode).toBe('+1');
      expect(result.errorMessage).not.toBeNull();
    });
  });
});
