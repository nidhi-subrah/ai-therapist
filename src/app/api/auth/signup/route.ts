import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { hashPassword } from '@/lib/password';
import { sendWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signUpSchema.parse(body);

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password);
    
    const user = await User.create({
      email: validatedData.email.toLowerCase(),
      name: validatedData.name,
      hashedPassword,
    });

    // Send welcome email (don't wait for it to complete)
    try {
      sendWelcomeEmail(user.email, user.name).catch(err => 
        console.warn('Failed to send welcome email:', err)
      );
    } catch (emailError) {
      console.warn('Email sending failed:', emailError);
    }

    // Return success without sensitive data
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
