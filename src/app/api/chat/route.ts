import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';

// Initialize Hugging Face client (completely free!)
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if Hugging Face API key is configured
    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Hugging Face API key not configured. Please add your API key to .env.local file.' 
        },
        { status: 500 }
      );
    }

    // Connect to database
    await dbConnect();

    // Create AI response using Hugging Face (free!)
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium', // Free, good conversational model
      inputs: `You are a compassionate AI therapist. Provide supportive, empathetic responses while maintaining professional boundaries. Focus on active listening, validation, and gentle guidance. Never give medical advice or replace professional therapy. Keep responses warm, understanding, and helpful.

User: ${message}
Therapist:`,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false
      }
    });

    const aiResponse = response.generated_text || "I'm here to listen and support you. What's on your mind?";

    // Save session to database if userId is provided
    if (userId) {
      const session = new Session({
        userId,
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: aiResponse }
        ]
      });
      await session.save();
    }

    return NextResponse.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle Hugging Face API errors specifically
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid Hugging Face API key. Please check your configuration.' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
