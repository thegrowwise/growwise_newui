"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Mail, Phone, User, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { PHONE_PLACEHOLDER } from '@/lib/constants';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export interface ContactFormData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  subject?: string;
  program?: string;
  gradeLevel?: string;
  preferredContact?: string;
  source?: string; // Where the form was submitted from
}

export default function ContactForm({ 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  error, 
  success = false 
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    source: 'chatbot'
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData?.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (success) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-700 mb-4">
            We've received your information and will contact you within 24 hours.
          </p>
          <Button 
            onClick={onCancel}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50">
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Get Personalized Information</h3>
          <p className="text-xs text-gray-600">
            Please provide your contact details.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`mt-1 ${validationErrors.name ? 'border-red-300 focus:border-red-500' : ''}`}
              placeholder="John Doe"
              disabled={isLoading}
            />
            {validationErrors.name && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${validationErrors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="john@example.com"
                disabled={isLoading}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`pl-10 ${validationErrors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder={PHONE_PLACEHOLDER}
                disabled={isLoading}
              />
            </div>
            {validationErrors.phone && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.phone}</p>
            )}
          </div>


          <div className="flex gap-2 pt-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Information
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
