/**
 * Phone Number Validation Utility
 * 
 * Validates phone numbers according to E.164 format with country-specific rules.
 * Supports normalization of user input (spaces, dashes, parentheses) and
 * returns structured validation results.
 */

export interface ValidationResult {
  isValid: boolean;
  e164: string | null;
  errorMessage: string | null;
}

export interface CountryRule {
  callingCode: string;
  nationalDigitsLength: number | { min: number; max: number };
  leadingDigitConstraints?: number[]; // Allowed first digits (e.g., [6, 7, 8, 9] for India)
  removeLeadingZero?: boolean; // Remove trunk prefix "0" if present
  example: string; // Example placeholder for UX
}

// Country-specific validation rules
const COUNTRY_RULES: Record<string, CountryRule> = {
  // United States & Canada
  US: {
    callingCode: '+1',
    nationalDigitsLength: 10,
    example: '+1 (555) 123-4567'
  },
  CA: {
    callingCode: '+1',
    nationalDigitsLength: 10,
    example: '+1 (555) 123-4567'
  },

  // India
  IN: {
    callingCode: '+91',
    nationalDigitsLength: 10,
    leadingDigitConstraints: [6, 7, 8, 9], // Mobile numbers start with 6-9
    example: '+91 98765 43210'
  },

  // United Kingdom
  GB: {
    callingCode: '+44',
    nationalDigitsLength: 10,
    removeLeadingZero: true, // Remove leading "0" if present (e.g., 07123... -> 7123...)
    example: '+44 7123 456789'
  },

  // United Arab Emirates
  AE: {
    callingCode: '+971',
    nationalDigitsLength: 9,
    example: '+971 50 123 4567'
  },

  // Singapore
  SG: {
    callingCode: '+65',
    nationalDigitsLength: 8,
    example: '+65 9123 4567'
  },

  // Australia
  AU: {
    callingCode: '+61',
    nationalDigitsLength: 9,
    removeLeadingZero: true, // Remove leading "0" if present
    example: '+61 412 345 678'
  },

  // Germany
  DE: {
    callingCode: '+49',
    nationalDigitsLength: { min: 10, max: 11 },
    removeLeadingZero: true, // Remove leading "0" if present
    example: '+49 30 12345678'
  },

  // France
  FR: {
    callingCode: '+33',
    nationalDigitsLength: 9,
    removeLeadingZero: true, // Remove leading "0" if present
    example: '+33 6 12 34 56 78'
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
 * Get country rule by calling code
 */
function getCountryRuleByCallingCode(callingCode: string | null | undefined): CountryRule | null {
  if (!callingCode) return null;
  
  // Normalize calling code (ensure it starts with +)
  const normalized = callingCode.startsWith('+') ? callingCode : `+${callingCode}`;
  
  // Find country by calling code
  for (const [iso2, rule] of Object.entries(COUNTRY_RULES)) {
    if (rule.callingCode === normalized) {
      return rule;
    }
  }
  
  return null;
}

/**
 * Normalize phone input: strip all non-digits except leading "+"
 */
function normalizeInput(rawInput: string): { normalized: string; hasPlus: boolean } {
  const trimmed = rawInput.trim();
  
  // Check if input starts with "+"
  const hasPlus = trimmed.startsWith('+');
  
  // Extract all digits
  const digits = trimmed.replace(/\D/g, '');
  
  // If there was a leading "+", preserve it
  const normalized = hasPlus ? `+${digits}` : digits;
  
  return { normalized, hasPlus };
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
 * Remove leading zero (trunk prefix) if present
 */
function removeTrunkPrefix(digits: string): string {
  if (digits.length > 0 && digits[0] === '0') {
    return digits.substring(1);
  }
  return digits;
}

/**
 * Validate phone number with country-specific rules
 * 
 * @param countryIso2 - ISO2 country code (e.g., "US", "IN", "GB")
 * @param rawInput - Raw user input (may contain spaces, dashes, parentheses)
 * @returns ValidationResult with isValid, e164, and errorMessage
 */
export function validatePhone(
  countryIso2: string | null | undefined,
  rawInput: string
): ValidationResult {
  // Step 1: Normalize input
  const { normalized, hasPlus } = normalizeInput(rawInput);
  
  // Step 2: Check if input has "+" (required for E.164)
  if (!hasPlus && normalized.length > 0) {
    return {
      isValid: false,
      e164: null,
      errorMessage: 'Include country code, e.g., +1XXXXXXXXXX'
    };
  }
  
  // Step 3: Extract digits after "+"
  const digitsAfterPlus = normalized.startsWith('+') 
    ? normalized.substring(1) 
    : normalized;
  
  // Step 4: Basic E.164 validation (8-15 digits total)
  if (digitsAfterPlus.length < 8 || digitsAfterPlus.length > 15) {
    return {
      isValid: false,
      e164: null,
      errorMessage: 'Phone number must be between 8 and 15 digits'
    };
  }
  
  // Step 5: Get country rule
  const rule = getCountryRule(countryIso2);
  
  // If no country rule found, do generic E.164 validation only
  if (!rule) {
    // Generic E.164 format check
    if (!/^\+\d{8,15}$/.test(normalized)) {
      return {
        isValid: false,
        e164: null,
        errorMessage: 'Invalid phone number format'
      };
    }
    
    return {
      isValid: true,
      e164: normalized,
      errorMessage: null
    };
  }
  
  // Step 6: Extract national number (remove calling code if present)
  let nationalDigits = digitsAfterPlus;
  const callingCodeDigits = rule.callingCode.substring(1); // Remove "+" from calling code
  
  // Check if calling code is already in the input
  if (nationalDigits.startsWith(callingCodeDigits)) {
    // Remove calling code from input
    nationalDigits = nationalDigits.substring(callingCodeDigits.length);
  }
  
  // Step 7: Remove trunk prefix if needed (e.g., GB, FR, DE, AU)
  if (rule.removeLeadingZero) {
    nationalDigits = removeTrunkPrefix(nationalDigits);
  }
  
  // Step 8: Validate national number length
  if (!matchesLengthConstraint(nationalDigits, rule.nationalDigitsLength)) {
    const expectedLength = typeof rule.nationalDigitsLength === 'number'
      ? `${rule.nationalDigitsLength} digits`
      : `${rule.nationalDigitsLength.min}-${rule.nationalDigitsLength.max} digits`;
    
    return {
      isValid: false,
      e164: null,
      errorMessage: `Phone number must have ${expectedLength} after country code`
    };
  }
  
  // Step 9: Validate leading digit constraints (if any)
  if (!matchesLeadingDigitConstraint(nationalDigits, rule.leadingDigitConstraints)) {
    const allowedDigits = rule.leadingDigitConstraints?.join(', ') || '';
    return {
      isValid: false,
      e164: null,
      errorMessage: `Phone number must start with ${allowedDigits}`
    };
  }
  
  // Step 10: Build E.164 format
  const e164 = `${rule.callingCode}${nationalDigits}`;
  
  // Step 11: Final E.164 format validation
  if (!/^\+\d{8,15}$/.test(e164)) {
    return {
      isValid: false,
      e164: null,
      errorMessage: 'Invalid phone number format'
    };
  }
  
  return {
    isValid: true,
    e164,
    errorMessage: null
  };
}

/**
 * Validate phone number using calling code directly
 * 
 * @param callingCode - Calling code (e.g., "+1", "+91", "+44")
 * @param rawInput - Raw user input (may contain spaces, dashes, parentheses)
 * @returns ValidationResult with isValid, e164, and errorMessage
 */
export function validatePhoneByCallingCode(
  callingCode: string | null | undefined,
  rawInput: string
): ValidationResult {
  // Find country by calling code
  const rule = getCountryRuleByCallingCode(callingCode);
  
  if (!rule) {
    // Fallback to generic validation
    const { normalized, hasPlus } = normalizeInput(rawInput);
    
    if (!hasPlus && normalized.length > 0) {
      return {
        isValid: false,
        e164: null,
        errorMessage: 'Include country code, e.g., +1XXXXXXXXXX'
      };
    }
    
    const digitsAfterPlus = normalized.startsWith('+') 
      ? normalized.substring(1) 
      : normalized;
    
    if (digitsAfterPlus.length < 8 || digitsAfterPlus.length > 15) {
      return {
        isValid: false,
        e164: null,
        errorMessage: 'Phone number must be between 8 and 15 digits'
      };
    }
    
    const e164 = normalized.startsWith('+') ? normalized : `+${normalized}`;
    
    return {
      isValid: /^\+\d{8,15}$/.test(e164),
      e164: /^\+\d{8,15}$/.test(e164) ? e164 : null,
      errorMessage: /^\+\d{8,15}$/.test(e164) ? null : 'Invalid phone number format'
    };
  }
  
  // Use the rule's calling code (normalized)
  const normalizedCallingCode = rule.callingCode;
  
  // Normalize input
  const { normalized, hasPlus } = normalizeInput(rawInput);
  
  if (!hasPlus && normalized.length > 0) {
    return {
      isValid: false,
      e164: null,
      errorMessage: 'Include country code, e.g., +1XXXXXXXXXX'
    };
  }
  
  let digitsAfterPlus = normalized.startsWith('+') 
    ? normalized.substring(1) 
    : normalized;
  
  const callingCodeDigits = normalizedCallingCode.substring(1); // Remove "+" from calling code
  
  // Remove calling code if present in input
  if (digitsAfterPlus.startsWith(callingCodeDigits)) {
    digitsAfterPlus = digitsAfterPlus.substring(callingCodeDigits.length);
  }
  
  // Remove trunk prefix if needed
  if (rule.removeLeadingZero) {
    digitsAfterPlus = removeTrunkPrefix(digitsAfterPlus);
  }
  
  // Validate length
  if (!matchesLengthConstraint(digitsAfterPlus, rule.nationalDigitsLength)) {
    const expectedLength = typeof rule.nationalDigitsLength === 'number'
      ? `${rule.nationalDigitsLength} digits`
      : `${rule.nationalDigitsLength.min}-${rule.nationalDigitsLength.max} digits`;
    
    return {
      isValid: false,
      e164: null,
      errorMessage: `Phone number must have ${expectedLength} after country code`
    };
  }
  
  // Validate leading digit
  if (!matchesLeadingDigitConstraint(digitsAfterPlus, rule.leadingDigitConstraints)) {
    const allowedDigits = rule.leadingDigitConstraints?.join(', ') || '';
    return {
      isValid: false,
      e164: null,
      errorMessage: `Phone number must start with ${allowedDigits}`
    };
  }
  
  // Build E.164
  const e164 = `${normalizedCallingCode}${digitsAfterPlus}`;
  
  if (!/^\+\d{8,15}$/.test(e164)) {
    return {
      isValid: false,
      e164: null,
      errorMessage: 'Invalid phone number format'
    };
  }
  
  return {
    isValid: true,
    e164,
    errorMessage: null
  };
}

/**
 * Get example placeholder for a country
 */
export function getPhonePlaceholder(countryIso2: string | null | undefined): string {
  const rule = getCountryRule(countryIso2);
  return rule?.example || '+1 (555) 123-4567';
}

/**
 * Get example placeholder by calling code
 */
export function getPhonePlaceholderByCallingCode(callingCode: string | null | undefined): string {
  const rule = getCountryRuleByCallingCode(callingCode);
  return rule?.example || '+1 (555) 123-4567';
}

/**
 * Extract calling code from dial code string (e.g., "+1" -> "+1")
 */
export function extractCallingCodeFromDialCode(dialCode: string): string {
  return dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
}

