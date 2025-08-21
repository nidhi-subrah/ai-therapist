import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Session, MoodCheckin } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch user's sessions
    const sessions = await Session.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    // Fetch user's mood check-ins
    const moodCheckins = await MoodCheckin.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    // Calculate insights
    const totalSessions = sessions.length;
    const totalMessages = sessions.reduce((acc, session) => acc + session.messages.length, 0);
    const averageSessionLength = totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;
    
    // Analyze mood trends
    const recentMoodCheckins = moodCheckins.slice(0, 7); // Last 7 days
    let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
    
    if (recentMoodCheckins.length >= 2) {
      const firstMood = recentMoodCheckins[recentMoodCheckins.length - 1].mood;
      const lastMood = recentMoodCheckins[0].mood;
      const moodDiff = lastMood - firstMood;
      
      if (moodDiff > 1) moodTrend = 'improving';
      else if (moodDiff < -1) moodTrend = 'declining';
    }

    // Extract common themes from recent sessions (simple keyword extraction)
    const commonThemes = extractCommonThemes(sessions);
    
    const insights = {
      totalSessions,
      totalMessages,
      averageSessionLength,
      commonThemes,
      moodTrend,
      lastSession: sessions[0]?.createdAt || null
    };

    return NextResponse.json({
      success: true,
      sessions,
      moodCheckins,
      insights
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

function extractCommonThemes(sessions: any[]): string[] {
  const themes = new Map<string, number>();
  const commonWords = [
    'anxiety', 'stress', 'work', 'family', 'relationship', 'sleep', 'exercise',
    'depression', 'anger', 'fear', 'confidence', 'goals', 'future', 'past',
    'presentation', 'meeting', 'deadline', 'pressure', 'overwhelmed', 'lonely',
    'happy', 'sad', 'excited', 'nervous', 'calm', 'frustrated', 'grateful'
  ];

  sessions.forEach(session => {
    const text = session.messages.map((m: any) => m.content).join(' ').toLowerCase();
    
    commonWords.forEach(word => {
      if (text.includes(word)) {
        themes.set(word, (themes.get(word) || 0) + 1);
      }
    });
  });

  // Return top 6 most common themes
  return Array.from(themes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([theme]) => theme);
}
