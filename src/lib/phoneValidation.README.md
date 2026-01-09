# Phone Number Validation Utility

A robust phone number validation system that supports multiple countries with E.164 format validation and country-specific rules.

## Features

- ✅ E.164 format validation (8-15 digits, must start with "+")
- ✅ Country-specific validation rules
- ✅ Automatic normalization (handles spaces, dashes, parentheses)
- ✅ Trunk prefix removal (for GB, FR, DE, AU)
- ✅ Leading digit constraints (e.g., India mobile numbers)
- ✅ Support for both ISO2 country codes and calling codes
- ✅ Returns structured validation results with E.164 format

## Supported Countries

- **US, CA**: +1, 10 digits
- **IN**: +91, 10 digits, first digit 6-9
- **GB**: +44, 10 digits, removes leading 0
- **AE**: +971, 9 digits
- **SG**: +65, 8 digits
- **AU**: +61, 9 digits, removes leading 0
- **DE**: +49, 10-11 digits, removes leading 0
- **FR**: +33, 9 digits, removes leading 0

## Quick Start

### Basic Usage

```typescript
import { validatePhone, validatePhoneByCallingCode } from '@/lib/phoneValidation';

// Using ISO2 country code
const result = validatePhone('US', '+1 (555) 123-4567');
if (result.isValid) {
  console.log('E.164 format:', result.e164); // +15551234567
  // Store result.e164 in database
} else {
  console.error('Error:', result.errorMessage);
}

// Using calling code directly
const result2 = validatePhoneByCallingCode('+1', '+1 5551234567');
```

### In a React Form

```typescript
import { useState } from 'react';
import { validatePhoneByCallingCode } from '@/lib/phoneValidation';
import CountryCodeSelector from '@/components/CountryCodeSelector';

function MyForm() {
  const [dialCode, setDialCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    const result = validatePhoneByCallingCode(dialCode, phone);
    setError(result.errorMessage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePhoneByCallingCode(dialCode, phone);
    
    if (result.isValid && result.e164) {
      // Store E.164 format
      console.log('Storing:', result.e164);
    } else {
      setError(result.errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CountryCodeSelector value={dialCode} onChange={setDialCode} />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={handleBlur}
      />
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
```

## API Reference

### `validatePhone(countryIso2, rawInput)`

Validates a phone number using ISO2 country code.

**Parameters:**
- `countryIso2`: ISO2 country code (e.g., "US", "IN", "GB") or null/undefined
- `rawInput`: Raw user input (may contain spaces, dashes, parentheses)

**Returns:** `ValidationResult`
```typescript
{
  isValid: boolean;
  e164: string | null;  // E.164 format if valid
  errorMessage: string | null;  // Error message if invalid
}
```

### `validatePhoneByCallingCode(callingCode, rawInput)`

Validates a phone number using calling code directly.

**Parameters:**
- `callingCode`: Calling code (e.g., "+1", "+91", "+44") or null/undefined
- `rawInput`: Raw user input

**Returns:** `ValidationResult`

### `getPhonePlaceholder(countryIso2)`

Returns an example placeholder for a country.

**Returns:** `string` - Example phone number format

### `getPhonePlaceholderByCallingCode(callingCode)`

Returns an example placeholder by calling code.

**Returns:** `string` - Example phone number format

## Validation Rules

### E.164 Format Requirements
- Must start with "+"
- Must contain only digits after "+"
- Total digits (excluding "+") must be 8-15

### Country-Specific Rules

Each country has:
- **callingCode**: The country's calling code (e.g., "+1")
- **nationalDigitsLength**: Exact or range of digits after calling code
- **leadingDigitConstraints**: Optional allowed first digits
- **removeLeadingZero**: Whether to remove trunk prefix "0"
- **example**: Example placeholder for UX

## Adding New Countries

To add a new country, add an entry to `COUNTRY_RULES` in `phoneValidation.ts`:

```typescript
const COUNTRY_RULES: Record<string, CountryRule> = {
  // ... existing countries
  'JP': {
    callingCode: '+81',
    nationalDigitsLength: 10,
    example: '+81 90-1234-5678'
  }
};
```

## Testing

See `phoneValidation.test.ts` for unit tests and `phoneValidation.test-cases.md` for comprehensive test cases.

Run tests:
```bash
npm test phoneValidation.test.ts
```

## Files

- `phoneValidation.ts` - Main validation logic
- `phoneValidation.example.tsx` - Usage examples
- `phoneValidation.test.ts` - Unit tests
- `phoneValidation.test-cases.md` - Comprehensive test cases
- `phoneValidation.README.md` - This file

## Notes

- Input is normalized automatically (spaces, dashes, parentheses removed)
- If input doesn't start with "+", validation fails with helpful error message
- Unknown countries fall back to generic E.164 validation (8-15 digits)
- E.164 format is always returned when valid (ready for database storage)


