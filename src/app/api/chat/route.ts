import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Session } from '@/models';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

function buildConversation(conversation: ChatMessage[] = [], latestUser: string) {
  // Take more context (last 20 messages) for better learning
  const trimmed = conversation
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }));
  
  return trimmed;
}

export async function POST(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const { message, conversation } = (await request.json()) as {
      message: string;
      conversation?: ChatMessage[];
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Google AI API Key exists:', !!process.env.GOOGLE_AI_API_KEY);
    console.log('Conversation length:', conversation?.length || 0);

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Google AI API key not configured. Please add GOOGLE_AI_API_KEY to .env.local.',
        },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a compassionate, professional AI therapist. Your role is to:

1. **Listen and Validate**: Acknowledge feelings and experiences without judgment
2. **Ask Insightful Questions**: Help users explore their thoughts and feelings deeper
3. **Provide Support**: Offer gentle guidance and coping strategies
4. **Maintain Boundaries**: Never give medical advice or crisis instructions
5. **Build on Context**: Remember previous conversation and build meaningful dialogue
6. **Be Human**: Respond naturally, not robotically - show genuine care

IMPORTANT: If someone mentions self-harm, suicide, or immediate crisis, respond with:
"I'm very concerned about what you're sharing. Your safety is the most important thing right now. Please call the National Suicide Prevention Lifeline at 988 or 911 immediately. You're not alone, and help is available."

Keep responses conversational, supportive, and focused on the user's emotional well-being.`;

    // Build conversation history for Google AI
    const conversationHistory = buildConversation(conversation, message);
    const messages: any[] = [
      { role: 'user', content: `${systemPrompt}\n\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\nUser: ${message}` }
    ];

    console.log('Sending to Google AI with conversation history');

    let aiResponse = '';

    try {
      console.log('Calling Google AI API...');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(messages[0].content);
      aiResponse = result.response.text().trim();
      
      console.log('Google AI success, response length:', aiResponse.length);
      console.log('Response preview:', aiResponse.substring(0, 100) + '...');
      
    } catch (error) {
      console.error('Google AI API failed:', error);
      
      // Smart fallback based on conversation context
      const userMessages = conversation?.filter(m => m.role === 'user') || [];
      const recentTopics = userMessages.slice(-3).map(m => m.content.toLowerCase());
      
      if (recentTopics.some(topic => topic.includes('anxious') || topic.includes('stress'))) {
        aiResponse = "I can see you've been dealing with anxiety and stress. It sounds like this has been building up. What specific aspect feels most overwhelming right now? Sometimes breaking it down helps us see it more clearly.";
      } else if (recentTopics.some(topic => topic.includes('work') || topic.includes('job'))) {
        aiResponse = "Work stress can really take a toll. You've mentioned this a few times now. What would it look like to set some boundaries or take small steps toward feeling more in control?";
      } else if (recentTopics.some(topic => topic.includes('relationship') || topic.includes('friend'))) {
        aiResponse = "Relationships can be complex and challenging. I'm hearing that this is really affecting you. What feels most important to address first? Sometimes starting with one small thing can make a big difference.";
      } else if (recentTopics.some(topic => topic.includes('presentation') || topic.includes('speaking'))) {
        aiResponse = "Presentations can be really nerve-wracking. I can hear how much this is affecting you. What specifically about the presentation feels most challenging? Sometimes understanding the root of our anxiety helps us address it.";
      } else {
        aiResponse = "I'm here with you, and I can see this has been weighing on you. Based on what you've shared, what feels most present or urgent right now? I want to make sure we're focusing on what matters most to you.";
      }
    }

    console.log('Final response length:', aiResponse.length);

    // Save or update the conversation session if user is authenticated
    if (userId) {
      try {
        await dbConnect();
        
        // Check if there's an active session from the last 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        let activeSession = await Session.findOne({
          userId,
          updatedAt: { $gte: thirtyMinutesAgo },
          'messages.role': 'assistant' // Make sure it has at least one AI response
        }).sort({ updatedAt: -1 });

        if (activeSession) {
          // Add new messages to existing session
          activeSession.messages.push(
            { role: 'user', content: message, timestamp: new Date() },
            { role: 'assistant', content: aiResponse, timestamp: new Date() }
          );
          activeSession.updatedAt = new Date();
          await activeSession.save();
          console.log('Updated existing chat session for user:', userId);
        } else {
          // Create new session
          const newSession = new Session({
            userId,
            messages: [
              { role: 'user', content: message, timestamp: new Date() },
              { role: 'assistant', content: aiResponse, timestamp: new Date() },
            ],
          });
          await newSession.save();
          console.log('Created new chat session for user:', userId);
        }
      } catch (persistErr) {
        console.error('Failed to save chat session:', persistErr);
      }
    } else {
      console.log('No user ID found, skipping session save');
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
