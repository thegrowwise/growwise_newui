# Phone Validation Test Cases

This document contains comprehensive test cases for the phone validation utility.

## Test Case Format

Each test case includes:
- **Country**: ISO2 code
- **Input**: Raw user input
- **Expected**: Expected validation result
- **Notes**: Additional context

---

## United States (US) - +1, 10 digits

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+1 5551234567` | `+15551234567` | Standard format |
| `+1 (555) 123-4567` | `+15551234567` | With formatting |
| `+15551234567` | `+15551234567` | No spaces |
| `1 555 123 4567` | `+15551234567` | Missing +, but will be rejected (needs +) |
| `555-123-4567` | ❌ Invalid | Missing country code |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+1 555123456` | Phone number must have 10 digits after country code |
| `+1 55512345678` | Phone number must have 10 digits after country code |
| `5551234567` | Include country code, e.g., +1XXXXXXXXXX |
| `+1 abc1234567` | Invalid phone number format |

---

## Canada (CA) - +1, 10 digits

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+1 4161234567` | `+14161234567` | Toronto number |
| `+1 (514) 123-4567` | `+15141234567` | Montreal number |
| `+1 6041234567` | `+16041234567` | Vancouver number |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+1 416123456` | Phone number must have 10 digits after country code |
| `+1 41612345678` | Phone number must have 10 digits after country code |

---

## India (IN) - +91, 10 digits, first digit 6-9

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+91 9876543210` | `+919876543210` | Mobile number starting with 9 |
| `+91 8123456789` | `+918123456789` | Mobile number starting with 8 |
| `+91 7123456789` | `+917123456789` | Mobile number starting with 7 |
| `+91 6123456789` | `+916123456789` | Mobile number starting with 6 |
| `+91-98765-43210` | `+919876543210` | With dashes |
| `+91 (987) 654-3210` | `+919876543210` | With parentheses |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+91 5123456789` | Phone number must start with 6, 7, 8, 9 |
| `+91 4123456789` | Phone number must start with 6, 7, 8, 9 |
| `+91 3123456789` | Phone number must start with 6, 7, 8, 9 |
| `+91 987654321` | Phone number must have 10 digits after country code |
| `+91 98765432101` | Phone number must have 10 digits after country code |
| `9876543210` | Include country code, e.g., +1XXXXXXXXXX |

---

## United Kingdom (GB) - +44, 10 digits, remove leading 0

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+44 7123456789` | `+447123456789` | Standard format |
| `+44 07123456789` | `+447123456789` | Leading 0 removed |
| `+44 (0) 7123 456789` | `+447123456789` | With (0) prefix |
| `+44 20 1234 5678` | `+442012345678` | London landline |
| `+44 020 1234 5678` | `+442012345678` | London with leading 0 |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+44 712345678` | Phone number must have 10 digits after country code |
| `+44 71234567890` | Phone number must have 10 digits after country code |
| `07123456789` | Include country code, e.g., +1XXXXXXXXXX |

---

## United Arab Emirates (AE) - +971, 9 digits

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+971 501234567` | `+971501234567` | Mobile number |
| `+971 4 123 4567` | `+97141234567` | Dubai landline |
| `+971-50-123-4567` | `+971501234567` | With dashes |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+971 50123456` | Phone number must have 9 digits after country code |
| `+971 5012345678` | Phone number must have 9 digits after country code |
| `501234567` | Include country code, e.g., +1XXXXXXXXXX |

---

## Singapore (SG) - +65, 8 digits

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+65 91234567` | `+6591234567` | Mobile number |
| `+65 6123 4567` | `+6561234567` | With space |
| `+65-9123-4567` | `+6591234567` | With dashes |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+65 9123456` | Phone number must have 8 digits after country code |
| `+65 912345678` | Phone number must have 8 digits after country code |
| `91234567` | Include country code, e.g., +1XXXXXXXXXX |

---

## Australia (AU) - +61, 9 digits, remove leading 0

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+61 412345678` | `+61412345678` | Mobile number |
| `+61 0412345678` | `+61412345678` | Leading 0 removed |
| `+61 (0) 412 345 678` | `+61412345678` | With (0) prefix |
| `+61 2 1234 5678` | `+61212345678` | Sydney landline |
| `+61 02 1234 5678` | `+61212345678` | Sydney with leading 0 |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+61 41234567` | Phone number must have 9 digits after country code |
| `+61 4123456789` | Phone number must have 9 digits after country code |
| `0412345678` | Include country code, e.g., +1XXXXXXXXXX |

---

## Germany (DE) - +49, 10-11 digits, remove leading 0

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+49 3012345678` | `+493012345678` | 10 digits |
| `+49 30123456789` | `+4930123456789` | 11 digits |
| `+49 030 1234 5678` | `+493012345678` | Leading 0 removed |
| `+49 (0) 30 1234 5678` | `+493012345678` | With (0) prefix |
| `+49 15123456789` | `+4915123456789` | Mobile 11 digits |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+49 301234567` | Phone number must have 10-11 digits after country code |
| `+49 301234567890` | Phone number must have 10-11 digits after country code |
| `030 1234 5678` | Include country code, e.g., +1XXXXXXXXXX |

---

## France (FR) - +33, 9 digits, remove leading 0

### Valid Cases

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+33 612345678` | `+33612345678` | Mobile number |
| `+33 0612345678` | `+33612345678` | Leading 0 removed |
| `+33 (0) 6 12 34 56 78` | `+33612345678` | With (0) prefix |
| `+33 1 23 45 67 89` | `+33123456789` | Paris landline |
| `+33 01 23 45 67 89` | `+33123456789` | Paris with leading 0 |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+33 61234567` | Phone number must have 9 digits after country code |
| `+33 6123456789` | Phone number must have 9 digits after country code |
| `0612345678` | Include country code, e.g., +1XXXXXXXXXX |

---

## Generic/Unknown Country Cases

### Valid Cases (Generic E.164)

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+1234567890` | `+1234567890` | 10 digits |
| `+123456789012345` | `+123456789012345` | 15 digits (max) |

### Invalid Cases

| Input | Expected Error |
|-------|----------------|
| `+1234567` | Phone number must be between 8 and 15 digits |
| `+1234567890123456` | Phone number must be between 8 and 15 digits |
| `1234567890` | Include country code, e.g., +1XXXXXXXXXX |
| `+abc1234567` | Invalid phone number format |

---

## Edge Cases

### Special Characters

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `+1 (555) 123-4567` | `+15551234567` | Parentheses and dashes |
| `+1 555.123.4567` | `+15551234567` | Dots |
| `+1 555 123 4567` | `+15551234567` | Spaces |
| `+1-555-123-4567` | `+15551234567` | Dashes only |

### Whitespace

| Input | Expected E.164 | Notes |
|-------|----------------|-------|
| `  +1 555 123 4567  ` | `+15551234567` | Leading/trailing spaces |
| `+1\t555\t123\t4567` | `+15551234567` | Tabs |

### Empty/Null

| Input | Expected Result |
|-------|----------------|
| `` | ❌ Invalid - Phone number must be between 8 and 15 digits |
| `+` | ❌ Invalid - Phone number must be between 8 and 15 digits |
| `+1` | ❌ Invalid - Phone number must be between 8 and 15 digits |

---

## Integration Test Scenarios

### Scenario 1: User types without country code
1. User selects country: US
2. User types: `5551234567`
3. Expected: Error "Include country code, e.g., +1XXXXXXXXXX"

### Scenario 2: User changes country
1. User selects: US, types: `+1 5551234567` ✅ Valid
2. User changes to: IN
3. Expected: Re-validation should occur, may show error if format doesn't match IN rules

### Scenario 3: User types with country code already
1. User selects: US
2. User types: `+1 5551234567`
3. Expected: `+15551234567` (country code not duplicated)

### Scenario 4: Trunk prefix removal
1. User selects: GB
2. User types: `+44 07123456789`
3. Expected: `+447123456789` (leading 0 removed)

---

## Performance Test Cases

- Input with 1000+ characters: Should handle gracefully
- Rapid country switching: Should re-validate quickly
- Large number of simultaneous validations: Should not cause memory issues

---

## Notes

- All E.164 outputs should start with `+`
- All E.164 outputs should contain only digits after `+`
- Total length (including `+`) should be between 9 and 16 characters (8-15 digits)
- Country-specific rules take precedence over generic E.164 validation
- Unknown countries fall back to generic E.164 validation (8-15 digits)

