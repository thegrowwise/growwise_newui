/**
 * Phone Validation Usage Example
 * 
 * This file demonstrates how to use the phone validation utility
 * in a React form component with country selector.
 */

import React, { useState } from 'react';
import { validatePhone, validatePhoneByCallingCode, getPhonePlaceholder, ValidationResult } from './phoneValidation';
import CountryCodeSelector from '@/components/CountryCodeSelector';

interface FormData {
  countryCode: string; // ISO2 code like "US", "IN", "GB"
  phone: string; // Raw user input
}

/**
 * Example 1: Using country ISO2 code
 */
export function PhoneFormExample1() {
  const [formData, setFormData] = useState<FormData>({
    countryCode: 'US',
    phone: ''
  });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError(null);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData(prev => ({ ...prev, countryCode }));
    // Re-validate phone when country changes
    if (formData.phone) {
      const result = validatePhone(countryCode, formData.phone);
      setValidationResult(result);
      setPhoneError(result.errorMessage);
    }
  };

  const handleBlur = () => {
    // Validate on blur
    const result = validatePhone(formData.countryCode, formData.phone);
    setValidationResult(result);
    setPhoneError(result.errorMessage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submit
    const result = validatePhone(formData.countryCode, formData.phone);
    setValidationResult(result);
    
    if (result.isValid && result.e164) {
      // Store E.164 format in database
      console.log('Valid phone number (E.164):', result.e164);
      
      // Submit form with E.164 format
      // await submitForm({ ...formData, phone: result.e164 });
    } else {
      setPhoneError(result.errorMessage || 'Invalid phone number');
    }
  };

  const placeholder = getPhonePlaceholder(formData.countryCode);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="country">Country</label>
        <select
          id="country"
          value={formData.countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="GB">United Kingdom</option>
          <option value="AE">UAE</option>
          <option value="SG">Singapore</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone">Phone Number *</label>
        <div className="flex items-center gap-0 border-2 border-gray-300 rounded-lg">
          <CountryCodeSelector
            value={formData.countryCode === 'US' ? '+1' : formData.countryCode === 'IN' ? '+91' : '+44'}
            onChange={(dialCode) => {
              // Convert dialCode to ISO2 if needed, or use validatePhoneByCallingCode
              handleCountryChange(formData.countryCode);
            }}
          />
          <div className="w-px h-10 bg-gray-300"></div>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`flex-1 px-4 py-2 border-0 outline-none ${
              phoneError ? 'border-red-500' : ''
            }`}
          />
        </div>
        {phoneError && (
          <p className="text-sm text-red-600 mt-1">{phoneError}</p>
        )}
        {validationResult?.isValid && validationResult.e164 && (
          <p className="text-sm text-green-600 mt-1">
            Valid: {validationResult.e164}
          </p>
        )}
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}

/**
 * Example 2: Using calling code directly (from CountryCodeSelector)
 */
export function PhoneFormExample2() {
  const [dialCode, setDialCode] = useState('+1'); // From CountryCodeSelector
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError(null);
  };

  const handleDialCodeChange = (newDialCode: string) => {
    setDialCode(newDialCode);
    // Re-validate when dial code changes
    if (phone) {
      const result = validatePhoneByCallingCode(newDialCode, phone);
      setPhoneError(result.errorMessage);
    }
  };

  const handleBlur = () => {
    const result = validatePhoneByCallingCode(dialCode, phone);
    setPhoneError(result.errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = validatePhoneByCallingCode(dialCode, phone);
    
    if (result.isValid && result.e164) {
      // Store E.164 format
      console.log('Storing E.164:', result.e164);
      
      // Example: Send to API
      // await fetch('/api/submit', {
      //   method: 'POST',
      //   body: JSON.stringify({ phone: result.e164 })
      // });
    } else {
      setPhoneError(result.errorMessage || 'Invalid phone number');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone">Phone Number *</label>
        <div className="flex items-center gap-0 border-2 border-gray-300 rounded-lg">
          <CountryCodeSelector
            value={dialCode}
            onChange={handleDialCodeChange}
          />
          <div className="w-px h-10 bg-gray-300"></div>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter phone number"
            className={`flex-1 px-4 py-2 border-0 outline-none ${
              phoneError ? 'border-red-500' : ''
            }`}
          />
        </div>
        {phoneError && (
          <p className="text-sm text-red-600 mt-1">{phoneError}</p>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Example 3: Real-time validation with debouncing
 */
export function PhoneFormExample3() {
  const [dialCode, setDialCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Debounced validation
  React.useEffect(() => {
    if (!phone.trim()) {
      setPhoneError(null);
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      const result = validatePhoneByCallingCode(dialCode, phone);
      setPhoneError(result.errorMessage);
      setIsValidating(false);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timer);
      setIsValidating(false);
    };
  }, [dialCode, phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePhoneByCallingCode(dialCode, phone);
    
    if (result.isValid && result.e164) {
      // Store E.164
      console.log('E.164:', result.e164);
    } else {
      setPhoneError(result.errorMessage || 'Invalid phone number');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <CountryCodeSelector
          value={dialCode}
          onChange={setDialCode}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
        {isValidating && <span>Validating...</span>}
        {phoneError && <p className="text-red-600">{phoneError}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}


