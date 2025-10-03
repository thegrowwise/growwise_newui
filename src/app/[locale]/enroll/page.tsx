'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EnrollPage() {
  const [agree, setAgree] = useState(false);
  const [bootcamp, setBootcamp] = useState<string | undefined>(undefined);
  const [course, setCourse] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // For now, just log. Hook up to API later.
    // eslint-disable-next-line no-console
    console.log(Object.fromEntries(formData.entries()));
    alert('Thank you! Your registration has been received.');
    e.currentTarget.reset();
    setAgree(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Register for Professional Courses</h1>
          <p className="text-gray-600 mt-2">Please fill out the form below and we will get back to you shortly.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl border-2 border-white/60 ring-1 ring-white/30 rounded-2xl shadow-[0_20px_60px_rgba(31,57,109,0.15)] p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Your Full Name *</Label>
              <Input id="fullName" name="fullName" placeholder="Your full name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bootcamp">Bootcamps</Label>
              <Select value={bootcamp} onValueChange={setBootcamp}>
                <SelectTrigger id="bootcamp">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="python">Python Programming</SelectItem>
                  <SelectItem value="ml-ai">ML / AI</SelectItem>
                  <SelectItem value="game-dev">Game Development</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="bootcamp" value={bootcamp ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Courses</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Math Courses</SelectItem>
                  <SelectItem value="english">ELA / English Courses</SelectItem>
                  <SelectItem value="writing">Writing Lab</SelectItem>
                  <SelectItem value="sat-act">SAT / ACT Prep</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="course" value={course ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile phone number *</Label>
              <Input id="mobile" name="mobile" type="tel" placeholder="Mobile phone number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">Elementary</SelectItem>
                  <SelectItem value="middle">Middle School</SelectItem>
                  <SelectItem value="high">High School</SelectItem>
                  <SelectItem value="test-prep">Test Prep</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="level" value={level ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" placeholder="City" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="Email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal">Postal code *</Label>
              <Input id="postal" name="postal" placeholder="Postal code" required />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500">
              GrowWise is committed to protecting and respecting your privacy, and we'll only use your personal
              information to provide the products and services you requested from us. From time to time, we would
              like to contact you about our products and services, as well as other content that may be of interest to you.
            </p>
          </div>

          <div className="mt-4 flex items-start gap-2">
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
            <Label htmlFor="agree" className="text-sm text-gray-700">I agree to receive communications from GrowWise.</Label>
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-500">
              By clicking submit below, you consent to allow GrowWise to store and process the personal information submitted above to provide you the content requested.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button type="submit" disabled={!agree} className="w-full md:w-auto bg-[#1F396D] hover:bg-[#29335C] text-white rounded-full px-8 py-6 text-base font-semibold">
              Register for Professional Courses
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


