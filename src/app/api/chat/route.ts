import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Hugging Face API key not configured. Please add HUGGINGFACE_API_KEY to .env.local.',
        },
        { status: 500 }
      );
    }

    // Connect once per lambda cold start
    await dbConnect();

    // Compose a gentle, trauma‑informed prompt
    const system = `You are a compassionate AI therapist. Be supportive, empathetic, and validation‑forward. 
Keep boundaries: do not give medical advice or crisis instructions. Suggest professional help when appropriate.`;

    let aiResponse = '';
    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: `${system}\n\nUser: ${message}\nTherapist:`,
        parameters: {
          max_new_tokens: 180,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.1,
          return_full_text: false,
        },
      });
      aiResponse = (response as any).generated_text?.trim() || '';
    } catch (inferenceErr) {
      // Graceful fallback when the model is loading/rate-limited
      aiResponse =
        "I'm here with you. Thank you for sharing that. It sounds like this has been heavy to carry. " +
        'What part feels most present right now? If you’re in immediate danger, please reach out to local emergency services.';
    }

    if (!aiResponse) {
      aiResponse =
        "I'm listening. Can you tell me a little more about what you’re feeling in this moment?";
    }

    // Save a lightweight session record when a user id is provided
    if (userId) {
      try {
        const session = new (Session as any)({
          userId,
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse },
          ],
        });
        await session.save();
      } catch {
        // Don’t fail the request if persistence fails
      }
    }

    return NextResponse.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
