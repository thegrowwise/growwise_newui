'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/;

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailError = emailTouched && email && !EMAIL_RE.test(email.trim())
    ? 'Please enter a valid email address.'
    : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      setEmailTouched(true);
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Incorrect email or password.');
        return;
      }
      // Hard-navigate so the server re-reads the fresh httpOnly cookie
      window.location.href = '/dashboard';
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <input type="text" name="_hp" className="hidden" tabIndex={-1} aria-hidden="true" />

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
          Email address
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          aria-invalid={!!emailError}
          className="h-11"
        />
        {emailError && (
          <p className="text-xs text-red-600" role="alert">{emailError}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <a
            href="https://learn.thegrowwise.com/wp-login.php?action=lostpassword"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#1F396D] hover:text-[#F16112] transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            placeholder="Enter your password"
            maxLength={200}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p
          className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#1F396D] hover:bg-[#162d57] text-white font-bold rounded-xl transition-colors shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}
