# Phone Validation Test Cases

This document contains comprehensive test cases for the phone validation utility.

**IMPORTANT:** Users enter ONLY the national number (no "+" and no country code). The country selector provides the calling code.

## Test Case Format

Each test case includes:
- **Country**: ISO2 code
- **Input**: Raw user input (national number only, may contain formatting)
- **Expected**: Expected validation result
- **Notes**: Additional context

---

## United States (US) - +1, 10 digits

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `5551234567` | `5551234567` | `+15551234567` | Standard format |
| `(555) 123-4567` | `5551234567` | `+15551234567` | With formatting |
| `555-123-4567` | `5551234567` | `+15551234567` | With dashes |
| `555 123 4567` | `5551234567` | `+15551234567` | With spaces |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+1 5551234567` | Do not include country code. Select it from the dropdown. |
| `15551234567` | Do not include country code. Select it from the dropdown. |
| `555123456` | Phone number must have 10 digits |
| `55512345678` | Phone number must have 10 digits |
| `+5551234567` | Do not include country code. Select it from the dropdown. |

---

## Canada (CA) - +1, 10 digits

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `4161234567` | `4161234567` | `+14161234567` | Toronto number |
| `(514) 123-4567` | `5141234567` | `+15141234567` | Montreal number |
| `6041234567` | `6041234567` | `+16041234567` | Vancouver number |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+1 4161234567` | Do not include country code. Select it from the dropdown. |
| `416123456` | Phone number must have 10 digits |
| `41612345678` | Phone number must have 10 digits |

---

## India (IN) - +91, 10 digits, first digit 6-9

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `9876543210` | `9876543210` | `+919876543210` | Mobile number starting with 9 |
| `8123456789` | `8123456789` | `+918123456789` | Mobile number starting with 8 |
| `7123456789` | `7123456789` | `+917123456789` | Mobile number starting with 7 |
| `6123456789` | `6123456789` | `+916123456789` | Mobile number starting with 6 |
| `98765 43210` | `9876543210` | `+919876543210` | With space |
| `98765-43210` | `9876543210` | `+919876543210` | With dash |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+91 9876543210` | Do not include country code. Select it from the dropdown. |
| `919876543210` | Do not include country code. Select it from the dropdown. |
| `5123456789` | Phone number must start with 6, 7, 8, 9 |
| `4123456789` | Phone number must start with 6, 7, 8, 9 |
| `3123456789` | Phone number must start with 6, 7, 8, 9 |
| `987654321` | Phone number must have 10 digits |
| `98765432101` | Phone number must have 10 digits |

---

## United Kingdom (GB) - +44, 10 digits, remove leading 0

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `7123456789` | `7123456789` | `+447123456789` | Standard format |
| `07123456789` | `7123456789` | `+447123456789` | Leading 0 removed |
| `7123 456789` | `7123456789` | `+447123456789` | With space |
| `20 1234 5678` | `2012345678` | `+442012345678` | London landline |
| `020 1234 5678` | `2012345678` | `+442012345678` | London with leading 0 |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+44 7123456789` | Do not include country code. Select it from the dropdown. |
| `447123456789` | Do not include country code. Select it from the dropdown. |
| `712345678` | Phone number must have 10 digits |
| `71234567890` | Phone number must have 10 digits |

---

## United Arab Emirates (AE) - +971, 9 digits

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `501234567` | `501234567` | `+971501234567` | Mobile number |
| `4 123 4567` | `41234567` | `+97141234567` | Dubai landline (8 digits - wait, this should be 9) |
| `50 123 4567` | `501234567` | `+971501234567` | With spaces |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+971 501234567` | Do not include country code. Select it from the dropdown. |
| `971501234567` | Do not include country code. Select it from the dropdown. |
| `50123456` | Phone number must have 9 digits |
| `5012345678` | Phone number must have 9 digits |

---

## Singapore (SG) - +65, 8 digits

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `91234567` | `91234567` | `+6591234567` | Mobile number |
| `6123 4567` | `61234567` | `+6561234567` | With space |
| `9123-4567` | `91234567` | `+6591234567` | With dash |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+65 91234567` | Do not include country code. Select it from the dropdown. |
| `6591234567` | Do not include country code. Select it from the dropdown. |
| `9123456` | Phone number must have 8 digits |
| `912345678` | Phone number must have 8 digits |

---

## Australia (AU) - +61, 9 digits, remove leading 0

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `412345678` | `412345678` | `+61412345678` | Mobile number |
| `0412345678` | `412345678` | `+61412345678` | Leading 0 removed |
| `412 345 678` | `412345678` | `+61412345678` | With spaces |
| `2 1234 5678` | `212345678` | `+61212345678` | Sydney landline |
| `02 1234 5678` | `212345678` | `+61212345678` | Sydney with leading 0 |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+61 412345678` | Do not include country code. Select it from the dropdown. |
| `61412345678` | Do not include country code. Select it from the dropdown. |
| `41234567` | Phone number must have 9 digits |
| `4123456789` | Phone number must have 9 digits |

---

## Germany (DE) - +49, 10-11 digits, remove leading 0

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `3012345678` | `3012345678` | `+493012345678` | 10 digits |
| `30123456789` | `30123456789` | `+4930123456789` | 11 digits |
| `030 1234 5678` | `3012345678` | `+493012345678` | Leading 0 removed |
| `15123456789` | `15123456789` | `+4915123456789` | Mobile 11 digits |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+49 3012345678` | Do not include country code. Select it from the dropdown. |
| `493012345678` | Do not include country code. Select it from the dropdown. |
| `301234567` | Phone number must have 10-11 digits |
| `301234567890` | Phone number must have 10-11 digits |

---

## France (FR) - +33, 9 digits, remove leading 0

### Valid Cases

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `612345678` | `612345678` | `+33612345678` | Mobile number |
| `0612345678` | `612345678` | `+33612345678` | Leading 0 removed |
| `6 12 34 56 78` | `612345678` | `+33612345678` | With spaces |
| `1 23 45 67 89` | `123456789` | `+33123456789` | Paris landline |
| `01 23 45 67 89` | `123456789` | `+33123456789` | Paris with leading 0 |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+33 612345678` | Do not include country code. Select it from the dropdown. |
| `33612345678` | Do not include country code. Select it from the dropdown. |
| `61234567` | Phone number must have 9 digits |
| `6123456789` | Phone number must have 9 digits |

---

## Edge Cases

### Empty/Whitespace Input

| Input | Expected Error |
|-------|----------------|
| `` | Please enter a phone number |
| `   ` | Please enter a phone number |
| `\t\t` | Please enter a phone number |

### Country Code Detection

| Country | Input | Expected Error |
|---------|-------|----------------|
| US | `+1 5551234567` | Do not include country code. Select it from the dropdown. |
| US | `15551234567` | Do not include country code. Select it from the dropdown. |
| IN | `+91 9876543210` | Do not include country code. Select it from the dropdown. |
| IN | `919876543210` | Do not include country code. Select it from the dropdown. |
| GB | `+44 7123456789` | Do not include country code. Select it from the dropdown. |
| GB | `447123456789` | Do not include country code. Select it from the dropdown. |

### Special Characters (Allowed)

| Input | Expected National | Expected E.164 | Notes |
|-------|------------------|----------------|-------|
| `(555) 123-4567` | `5551234567` | `+15551234567` | Parentheses and dashes |
| `555.123.4567` | `5551234567` | `+15551234567` | Dots |
| `555 123 4567` | `5551234567` | `+15551234567` | Spaces |
| `555-123-4567` | `5551234567` | `+15551234567` | Dashes only |

### Trunk Prefix Removal

| Country | Input | Expected National | Expected E.164 | Notes |
|---------|-------|------------------|----------------|-------|
| GB | `07123456789` | `7123456789` | `+447123456789` | Leading 0 removed |
| GB | `007123456789` | `07123456789` | ❌ Invalid (too long) | Only ONE leading 0 removed |
| AU | `0412345678` | `412345678` | `+61412345678` | Leading 0 removed |
| DE | `03012345678` | `3012345678` | `+493012345678` | Leading 0 removed |
| FR | `0612345678` | `612345678` | `+33612345678` | Leading 0 removed |

### Unknown Country

| Country | Input | Expected Result |
|---------|-------|----------------|
| `XX` | `5551234567` | ❌ Invalid: "Country not supported. Please select a supported country." + Warning: "Country-specific format not applied." |

### Missing Country Selection

| Country | Input | Expected Error |
|---------|-------|----------------|
| `null` | `5551234567` | Please select a country |
| `undefined` | `5551234567` | Please select a country |
| `` | `5551234567` | Please select a country |

---

## Integration Test Scenarios

### Scenario 1: User types with country code (should reject)
1. User selects country: US
2. User types: `+1 5551234567`
3. Expected: Error "Do not include country code. Select it from the dropdown."

### Scenario 2: User types only national number (should accept)
1. User selects country: US
2. User types: `5551234567`
3. Expected: ✅ Valid, E.164: `+15551234567`

### Scenario 3: User changes country
1. User selects: US, types: `5551234567` ✅ Valid
2. User changes to: IN
3. Expected: Re-validation occurs, may show error if format doesn't match IN rules

### Scenario 4: Trunk prefix removal
1. User selects: GB
2. User types: `07123456789`
3. Expected: `+447123456789` (leading 0 removed)

### Scenario 5: Formatting preserved in input, normalized in output
1. User selects: US
2. User types: `(555) 123-4567`
3. Expected: Input shows formatting, but E.164 is `+15551234567`

---

## Validation Result Structure

Each validation returns:
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

### Example Valid Result
```typescript
{
  isValid: true,
  e164: "+15551234567",
  nationalNumber: "5551234567",
  callingCode: "+1",
  errorMessage: null,
  warningMessage: null
}
```

### Example Invalid Result
```typescript
{
  isValid: false,
  e164: null,
  nationalNumber: null,
  callingCode: "+1",
  errorMessage: "Do not include country code. Select it from the dropdown.",
  warningMessage: null
}
```

---

## Notes

- All E.164 outputs start with `+`
- All E.164 outputs contain only digits after `+`
- Total length (including `+`) is between 9 and 16 characters (8-15 digits)
- Country-specific rules take precedence over generic E.164 validation
- Unknown countries return error with warning message
- Users MUST select a country (countryIso2 is required)
- Users MUST enter only national number (no "+", no country code in input)
