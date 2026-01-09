/**
 * Phone Number Validation Utility
 * 
 * Validates phone numbers where:
 * - User enters ONLY the national number (no "+" and no country code)
 * - Country selector provides the calling code
 * - Final output is in E.164 format: callingCode + nationalDigitsOnly
 */

export interface ValidationResult {
  isValid: boolean;
  e164: string | null;
  nationalNumber: string | null; // Normalized national digits only
  callingCode: string | null;
  errorMessage: string | null;
  warningMessage?: string | null; // For unknown countries
}

export interface CountryRule {
  callingCode: string;
  nationalDigitsLength: number | { min: number; max: number };
  leadingDigitConstraints?: number[]; // Allowed first digits (e.g., [6, 7, 8, 9] for India)
  removeLeadingZero?: boolean; // Remove trunk prefix "0" if present
  example: string; // Example placeholder for UX (national number only)
}

// Country-specific validation rules
const COUNTRY_RULES: Record<string, CountryRule> = {
  // United States & Canada
  US: {
    callingCode: '+1',
    nationalDigitsLength: 10,
    example: '(555) 123-4567'
  },
  CA: {
    callingCode: '+1',
    nationalDigitsLength: 10,
    example: '(555) 123-4567'
  },

  // India
  IN: {
    callingCode: '+91',
    nationalDigitsLength: 10,
    leadingDigitConstraints: [6, 7, 8, 9], // Mobile numbers start with 6-9
    example: '98765 43210'
  },

  // United Kingdom
  GB: {
    callingCode: '+44',
    nationalDigitsLength: 10,
    removeLeadingZero: true, // Remove leading "0" if present (e.g., 07123... -> 7123...)
    example: '7123 456789'
  },

  // United Arab Emirates
  AE: {
    callingCode: '+971',
    nationalDigitsLength: 9,
    example: '50 123 4567'
  },

  // Singapore
  SG: {
    callingCode: '+65',
    nationalDigitsLength: 8,
    example: '9123 4567'
  },

  // Australia
  AU: {
    callingCode: '+61',
    nationalDigitsLength: 9,
    removeLeadingZero: true, // Remove leading "0" if present
    example: '412 345 678'
  },

  // Germany
  DE: {
    callingCode: '+49',
    nationalDigitsLength: { min: 10, max: 11 },
    removeLeadingZero: true, // Remove leading "0" if present
    example: '30 12345678'
  },

  // France
  FR: {
    callingCode: '+33',
    nationalDigitsLength: 9,
    removeLeadingZero: true, // Remove leading "0" if present
    example: '6 12 34 56 78'
  }
};

/**
 * Get country rule by ISO2 code
 */
function getCountryRule(countryIso2: string | null | undefined): CountryRule | null {
  if (!countryIso2) return null;
  return COUNTRY_RULES[countryIso2.toUpperCase()] || null;
}

/**
 * Check if a number matches the length constraint
 */
function matchesLengthConstraint(
  digits: string,
  constraint: number | { min: number; max: number }
): boolean {
  if (typeof constraint === 'number') {
    return digits.length === constraint;
  }
  return digits.length >= constraint.min && digits.length <= constraint.max;
}

/**
 * Check if leading digit matches constraints
 */
function matchesLeadingDigitConstraint(
  digits: string,
  constraints?: number[]
): boolean {
  if (!constraints || constraints.length === 0) {
    return true; // No constraint means any digit is allowed
  }
  
  if (digits.length === 0) {
    return false;
  }
  
  const firstDigit = parseInt(digits[0], 10);
  return constraints.includes(firstDigit);
}

/**
 * Check if input contains a "+" or starts with a calling code
 * Returns true if input should be rejected
 */
function containsCountryCode(rawInput: string, callingCode: string): boolean {
  const trimmed = rawInput.trim();
  
  // Reject if contains "+"
  if (trimmed.includes('+')) {
    return true;
  }
  
  // Extract digits only
  const digitsOnly = trimmed.replace(/\D/g, '');
  const callingCodeDigits = callingCode.substring(1); // Remove "+" from calling code
  
  // Reject if starts with calling code digits
  if (digitsOnly.startsWith(callingCodeDigits)) {
    return true;
  }
  
  return false;
}

/**
 * Normalize national number input:
 * - Trim
 * - Reject if contains "+"
 * - Convert to digits-only
 * - Remove ONE leading "0" for trunk-prefix countries
 */
function normalizeNationalInput(
  rawInput: string,
  removeLeadingZero: boolean
): { normalized: string; error: string | null } {
  const trimmed = rawInput.trim();
  
  // Reject if contains "+"
  if (trimmed.includes('+')) {
    return {
      normalized: '',
      error: 'Do not include country code. Select it from the dropdown.'
    };
  }
  
  // Convert to digits-only
  const digitsOnly = trimmed.replace(/\D/g, '');
  
  // Reject if no digits after normalization
  if (digitsOnly.length === 0) {
    return {
      normalized: '',
      error: 'Please enter a phone number'
    };
  }
  
  // Remove ONE leading "0" for trunk-prefix countries
  let normalized = digitsOnly;
  if (removeLeadingZero && normalized.length > 0 && normalized[0] === '0') {
    normalized = normalized.substring(1);
  }
  
  return {
    normalized,
    error: null
  };
}

/**
 * Validate phone number with country-specific rules
 * 
 * @param countryIso2 - ISO2 country code (e.g., "US", "IN", "GB") - REQUIRED
 * @param rawNationalInput - Raw user input (national number only, may contain spaces, dashes, parentheses)
 * @returns ValidationResult with isValid, e164, nationalNumber, callingCode, errorMessage, warningMessage
 */
export function validatePhone(
  countryIso2: string | null | undefined,
  rawNationalInput: string
): ValidationResult {
  // Step 1: Require country selection
  if (!countryIso2) {
    return {
      isValid: false,
      e164: null,
      nationalNumber: null,
      callingCode: null,
      errorMessage: 'Please select a country',
      warningMessage: null
    };
  }
  
  // Step 2: Get country rule
  const rule = getCountryRule(countryIso2);
  
  // Step 3: If country not recognized, return error (or fallback with warning)
  if (!rule) {
    // Fallback: try to validate with generic E.164 rules
    const trimmed = rawNationalInput.trim();
    
    // Reject if contains "+"
    if (trimmed.includes('+')) {
      return {
        isValid: false,
        e164: null,
        nationalNumber: null,
        callingCode: null,
        errorMessage: 'Do not include country code. Select it from the dropdown.',
        warningMessage: null
      };
    }
    
    // Convert to digits-only
    const digitsOnly = trimmed.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) {
      return {
        isValid: false,
        e164: null,
        nationalNumber: null,
        callingCode: null,
        errorMessage: 'Please enter a phone number',
        warningMessage: null
      };
    }
    
    // For unknown country, we can't build E.164 without a calling code
    return {
      isValid: false,
      e164: null,
      nationalNumber: digitsOnly,
      callingCode: null,
      errorMessage: 'Country not supported. Please select a supported country.',
      warningMessage: 'Country-specific format not applied.'
    };
  }
  
  // Step 4: Check if user included country code (reject if so)
  if (containsCountryCode(rawNationalInput, rule.callingCode)) {
    return {
      isValid: false,
      e164: null,
      nationalNumber: null,
      callingCode: rule.callingCode,
      errorMessage: 'Do not include country code. Select it from the dropdown.',
      warningMessage: null
    };
  }
  
  // Step 5: Normalize national input
  const { normalized: nationalDigits, error: normalizeError } = normalizeNationalInput(
    rawNationalInput,
    rule.removeLeadingZero || false
  );
  
  if (normalizeError) {
    return {
      isValid: false,
      e164: null,
      nationalNumber: null,
      callingCode: rule.callingCode,
      errorMessage: normalizeError,
      warningMessage: null
    };
  }
  
  // Step 6: Validate national number length
  if (!matchesLengthConstraint(nationalDigits, rule.nationalDigitsLength)) {
    const expectedLength = typeof rule.nationalDigitsLength === 'number'
      ? `${rule.nationalDigitsLength} digits`
      : `${rule.nationalDigitsLength.min}-${rule.nationalDigitsLength.max} digits`;
    
    return {
      isValid: false,
      e164: null,
      nationalNumber: nationalDigits,
      callingCode: rule.callingCode,
      errorMessage: `Phone number must have ${expectedLength}`,
      warningMessage: null
    };
  }
  
  // Step 7: Validate leading digit constraints (if any)
  if (!matchesLeadingDigitConstraint(nationalDigits, rule.leadingDigitConstraints)) {
    const allowedDigits = rule.leadingDigitConstraints?.join(', ') || '';
    return {
      isValid: false,
      e164: null,
      nationalNumber: nationalDigits,
      callingCode: rule.callingCode,
      errorMessage: `Phone number must start with ${allowedDigits}`,
      warningMessage: null
    };
  }
  
  // Step 8: Build E.164 format
  const e164 = `${rule.callingCode}${nationalDigits}`;
  
  // Step 9: Final E.164 format validation (safety check)
  if (!/^\+\d{8,15}$/.test(e164)) {
    return {
      isValid: false,
      e164: null,
      nationalNumber: nationalDigits,
      callingCode: rule.callingCode,
      errorMessage: 'Invalid phone number format',
      warningMessage: null
    };
  }
  
  // Step 10: Success
  return {
    isValid: true,
    e164,
    nationalNumber: nationalDigits,
    callingCode: rule.callingCode,
    errorMessage: null,
    warningMessage: null
  };
}

/**
 * Get example placeholder for a country (national number only)
 */
export function getPhonePlaceholder(countryIso2: string | null | undefined): string {
  const rule = getCountryRule(countryIso2);
  return rule?.example || '(555) 123-4567';
}

/**
 * Get calling code for a country
 */
export function getCallingCode(countryIso2: string | null | undefined): string | null {
  const rule = getCountryRule(countryIso2);
  return rule?.callingCode || null;
}
