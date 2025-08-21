'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { z } from 'zod';
import Link from 'next/link';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
});

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSignUp = async (data: Record<string, string>) => {
    try {
      setIsLoading(true);
      setError('');

      const validatedData = signUpSchema.parse(data);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validatedData.email,
          password: validatedData.password,
          name: validatedData.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to create account');
        return;
      }

      // Redirect to sign in page after successful signup
      router.push('/signin?message=Account created successfully! Check your email for a welcome message, then sign in.');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a password (min 6 characters)',
      required: true,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthCard
          title="Sign Up"
          description="Create your AI Therapist account"
          fields={fields}
          submitText="Create Account"
          onSubmit={handleSignUp}
          isLoading={isLoading}
          error={error}
        />
        
        <div className="text-center text-sm text-gray-500">
          <p>📧 You'll receive a welcome email after signing up</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
