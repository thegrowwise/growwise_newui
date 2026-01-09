# Phone Number Validation Utility

A robust phone number validation system that supports multiple countries with E.164 format validation and country-specific rules.

## Important: Input Requirements

- **User enters ONLY the national number** (no "+" and no country code)
- **Country selector is REQUIRED** and provides the calling code
- If user includes "+" or starts with a calling code, validation rejects with: "Do not include country code. Select it from the dropdown."
- Final output is in E.164 format: `callingCode + nationalDigitsOnly`

## Features

- ✅ E.164 format validation (8-15 digits, must start with "+")
- ✅ Country-specific validation rules
- ✅ Automatic normalization (handles spaces, dashes, parentheses)
- ✅ Trunk prefix removal (for GB, FR, DE, AU)
- ✅ Leading digit constraints (e.g., India mobile numbers)
- ✅ Rejects input containing "+" or country code
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
import { validatePhone } from '@/lib/phoneValidation';

// User enters ONLY national number, country provides calling code
const result = validatePhone('US', '(555) 123-4567');
if (result.isValid) {
  console.log('E.164 format:', result.e164); // +15551234567
  console.log('National number:', result.nationalNumber); // 5551234567
  console.log('Calling code:', result.callingCode); // +1
  // Store result.e164 in database
} else {
  console.error('Error:', result.errorMessage);
}
```

### In a React Form

```typescript
import { useState } from 'react';
import { validatePhone, getPhonePlaceholder, getCallingCode } from '@/lib/phoneValidation';

function MyForm() {
  const [countryIso2, setCountryIso2] = useState('US');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    const result = validatePhone(countryIso2, phone);
    setError(result.errorMessage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePhone(countryIso2, phone);
    
    if (result.isValid && result.e164) {
      // Store E.164 format
      console.log('Storing:', result.e164);
      // await fetch('/api/submit', {
      //   method: 'POST',
      //   body: JSON.stringify({ phone: result.e164 })
      // });
    } else {
      setError(result.errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={countryIso2} onChange={(e) => setCountryIso2(e.target.value)}>
        <option value="US">United States</option>
        <option value="IN">India</option>
        {/* ... more countries */}
      </select>
      
      <div className="flex">
        <span>{getCallingCode(countryIso2)}</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={handleBlur}
          placeholder={getPhonePlaceholder(countryIso2)}
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
```

## API Reference

### `validatePhone(countryIso2, rawNationalInput)`

Validates a phone number using ISO2 country code. User enters ONLY the national number.

**Parameters:**
- `countryIso2`: ISO2 country code (e.g., "US", "IN", "GB") - **REQUIRED**
- `rawNationalInput`: Raw user input (national number only, may contain spaces, dashes, parentheses)

**Returns:** `ValidationResult`
```typescript
{
  isValid: boolean;
  e164: string | null;           // E.164 format: +[callingCode][nationalDigits]
  nationalNumber: string | null; // Normalized national digits only
  callingCode: string | null;    // Calling code from country selector
  errorMessage: string | null;   // Error message if invalid
  warningMessage?: string | null; // Warning (e.g., unknown country)
}
```

**Behavior:**
- Rejects if input contains "+" anywhere
- Rejects if input starts with calling code digits
- Normalizes input (removes formatting, handles trunk prefix)
- Validates against country-specific rules
- Returns E.164 format when valid

### `getPhonePlaceholder(countryIso2)`

Returns an example placeholder for a country (national number only).

**Returns:** `string` - Example phone number format (national number only)

### `getCallingCode(countryIso2)`

Returns the calling code for a country.

**Returns:** `string | null` - Calling code (e.g., "+1") or null if country not found

## Validation Rules

### Input Requirements
- User MUST enter only the national number
- Input MUST NOT contain "+"
- Input MUST NOT start with calling code digits
- Input may contain formatting (spaces, dashes, parentheses)

### Normalization
1. Trim whitespace
2. Reject if contains "+"
3. Convert to digits-only
4. Remove ONE leading "0" for trunk-prefix countries (GB, FR, DE, AU)

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
- **example**: Example placeholder for UX (national number only)

## Error Messages

- `"Please select a country"` - Country not selected
- `"Do not include country code. Select it from the dropdown."` - Input contains "+" or calling code
- `"Please enter a phone number"` - Empty input after normalization
- `"Phone number must have X digits"` - Length validation failed
- `"Phone number must start with X, Y, Z"` - Leading digit constraint failed
- `"Country not supported. Please select a supported country."` - Unknown country

## Adding New Countries

To add a new country, add an entry to `COUNTRY_RULES` in `phoneValidation.ts`:

```typescript
const COUNTRY_RULES: Record<string, CountryRule> = {
  // ... existing countries
  'JP': {
    callingCode: '+81',
    nationalDigitsLength: 10,
    example: '90-1234-5678' // National number only, no country code
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

## Migration from Previous Version

If you were using the previous version that accepted full phone numbers with "+":

**Before:**
```typescript
validatePhone('US', '+1 (555) 123-4567');
```

**After:**
```typescript
// User enters only national number
validatePhone('US', '(555) 123-4567');
// Returns: { e164: '+15551234567', nationalNumber: '5551234567', ... }
```

## Notes

- Input is normalized automatically (spaces, dashes, parentheses removed)
- If input contains "+" or calling code, validation fails with helpful error message
- Unknown countries return error with warning message
- E.164 format is always returned when valid (ready for database storage)
- Country selection is REQUIRED (countryIso2 cannot be null/undefined)
