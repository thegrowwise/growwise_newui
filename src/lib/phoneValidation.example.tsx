/**
 * Phone Validation Usage Example
 * 
 * This file demonstrates how to use the phone validation utility
 * in a React form component with country selector.
 * 
 * IMPORTANT: User enters ONLY the national number (no "+" and no country code).
 * The country selector provides the calling code.
 */

import React, { useState } from 'react';
import { validatePhone, getPhonePlaceholder, getCallingCode, ValidationResult } from './phoneValidation';
import CountryCodeSelector from '@/components/CountryCodeSelector';

interface FormData {
  countryCode: string; // ISO2 code like "US", "IN", "GB"
  phone: string; // National number only (no "+", no country code)
}

/**
 * Example: Using country ISO2 code with national number input
 */
export function PhoneFormExample() {
  const [formData, setFormData] = useState<FormData>({
    countryCode: 'US',
    phone: ''
  });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneWarning, setPhoneWarning] = useState<string | null>(null);

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    
    // Clear errors when user starts typing
    if (phoneError) {
      setPhoneError(null);
    }
    if (phoneWarning) {
      setPhoneWarning(null);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData(prev => ({ ...prev, countryCode }));
    
    // Re-validate phone when country changes
    if (formData.phone) {
      const result = validatePhone(countryCode, formData.phone);
      setValidationResult(result);
      setPhoneError(result.errorMessage);
      setPhoneWarning(result.warningMessage || null);
    }
  };

  const handleBlur = () => {
    // Validate on blur
    const result = validatePhone(formData.countryCode, formData.phone);
    setValidationResult(result);
    setPhoneError(result.errorMessage);
    setPhoneWarning(result.warningMessage || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submit
    const result = validatePhone(formData.countryCode, formData.phone);
    setValidationResult(result);
    setPhoneError(result.errorMessage);
    setPhoneWarning(result.warningMessage || null);
    
    if (result.isValid && result.e164) {
      // Store E.164 format in database
      console.log('Storing E.164 format:', result.e164);
      console.log('National number:', result.nationalNumber);
      console.log('Calling code:', result.callingCode);
      
      // Example: Submit form with E.164 format
      // await fetch('/api/submit', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     ...formData,
      //     phone: result.e164, // Store E.164 format
      //     phoneNational: result.nationalNumber, // Optional: store national number too
      //     phoneCallingCode: result.callingCode // Optional: store calling code
      //   })
      // });
    }
  };

  const placeholder = getPhonePlaceholder(formData.countryCode);
  const callingCode = getCallingCode(formData.countryCode);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <select
          id="country"
          value={formData.countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="IN">India</option>
          <option value="GB">United Kingdom</option>
          <option value="AE">United Arab Emirates</option>
          <option value="SG">Singapore</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <div className="flex items-center gap-0 border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          {/* Country Code Display (read-only) */}
          <div className="px-3 py-2 bg-gray-50 border-r border-gray-300 text-sm font-medium text-gray-700">
            {callingCode || '+1'}
          </div>
          
          {/* National Number Input */}
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`flex-1 px-4 py-2 border-0 outline-none ${
              phoneError ? 'text-red-600' : ''
            }`}
            required
          />
        </div>
        
        {/* Error Message */}
        {phoneError && (
          <p className="text-sm text-red-600 mt-1">{phoneError}</p>
        )}
        
        {/* Warning Message */}
        {phoneWarning && !phoneError && (
          <p className="text-sm text-yellow-600 mt-1">{phoneWarning}</p>
        )}
        
        {/* Success Message */}
        {validationResult?.isValid && validationResult.e164 && (
          <p className="text-sm text-green-600 mt-1">
            Valid: {validationResult.e164}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
}

/**
 * Example: Using CountryCodeSelector component (if it provides ISO2 code)
 */
export function PhoneFormWithCountrySelector() {
  const [countryIso2, setCountryIso2] = useState('US');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneWarning, setPhoneWarning] = useState<string | null>(null);

  // Map dial code to ISO2 (you may need to adjust this based on your CountryCodeSelector)
  const dialCodeToIso2: Record<string, string> = {
    '+1': 'US',
    '+91': 'IN',
    '+44': 'GB',
    '+971': 'AE',
    '+65': 'SG',
    '+61': 'AU',
    '+49': 'DE',
    '+33': 'FR'
  };

  const handleDialCodeChange = (dialCode: string) => {
    const iso2 = dialCodeToIso2[dialCode] || 'US';
    setCountryIso2(iso2);
    
    // Re-validate when country changes
    if (phone) {
      const result = validatePhone(iso2, phone);
      setPhoneError(result.errorMessage);
      setPhoneWarning(result.warningMessage || null);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError(null);
    setPhoneWarning(null);
  };

  const handleBlur = () => {
    const result = validatePhone(countryIso2, phone);
    setPhoneError(result.errorMessage);
    setPhoneWarning(result.warningMessage || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePhone(countryIso2, phone);
    
    if (result.isValid && result.e164) {
      // Store E.164 format
      console.log('E.164:', result.e164);
      console.log('National:', result.nationalNumber);
      console.log('Calling Code:', result.callingCode);
      
      // Submit to API
      // await fetch('/api/submit', {
      //   method: 'POST',
      //   body: JSON.stringify({ phone: result.e164 })
      // });
    } else {
      setPhoneError(result.errorMessage);
      setPhoneWarning(result.warningMessage || null);
    }
  };

  const placeholder = getPhonePlaceholder(countryIso2);
  const callingCode = getCallingCode(countryIso2);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone">Phone Number *</label>
        <div className="flex items-center gap-0 border-2 border-gray-300 rounded-lg overflow-hidden">
          {/* Country Code Selector */}
          <CountryCodeSelector
            value={callingCode || '+1'}
            onChange={handleDialCodeChange}
            className="flex-shrink-0"
          />
          <div className="w-px h-10 bg-gray-300"></div>
          
          {/* National Number Input */}
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`flex-1 px-4 py-2 border-0 outline-none ${
              phoneError ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {phoneError && (
          <p className="text-sm text-red-600 mt-1">{phoneError}</p>
        )}
        {phoneWarning && !phoneError && (
          <p className="text-sm text-yellow-600 mt-1">{phoneWarning}</p>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Example: Real-time validation with debouncing
 */
export function PhoneFormWithDebounce() {
  const [countryIso2, setCountryIso2] = useState('US');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneWarning, setPhoneWarning] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Debounced validation
  React.useEffect(() => {
    if (!phone.trim()) {
      setPhoneError(null);
      setPhoneWarning(null);
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      const result = validatePhone(countryIso2, phone);
      setPhoneError(result.errorMessage);
      setPhoneWarning(result.warningMessage || null);
      setIsValidating(false);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timer);
      setIsValidating(false);
    };
  }, [countryIso2, phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePhone(countryIso2, phone);
    
    if (result.isValid && result.e164) {
      // Store E.164
      console.log('E.164:', result.e164);
    } else {
      setPhoneError(result.errorMessage);
      setPhoneWarning(result.warningMessage || null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <select
          value={countryIso2}
          onChange={(e) => setCountryIso2(e.target.value)}
        >
          <option value="US">US</option>
          <option value="IN">IN</option>
          <option value="GB">GB</option>
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={getPhonePlaceholder(countryIso2)}
        />
        {isValidating && <span>Validating...</span>}
        {phoneError && <p className="text-red-600">{phoneError}</p>}
        {phoneWarning && !phoneError && <p className="text-yellow-600">{phoneWarning}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
