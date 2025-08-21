import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { MoodCheckin } from '@/models';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

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

    // Get the last 30 days of data
    const thirtyDaysAgo = subDays(new Date(), 30);
    
    const moodCheckins = await MoodCheckin.find({
      userId: session.user.id,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    // Group data by day and calculate averages
    const dailyData = new Map<string, { mood: number[]; stress: number[]; count: number }>();
    
    // Initialize last 30 days with empty data
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      dailyData.set(date, { mood: [], stress: [], count: 0 });
    }

    // Fill in actual data
    moodCheckins.forEach(checkin => {
      const date = format(checkin.createdAt, 'yyyy-MM-dd');
      if (dailyData.has(date)) {
        dailyData.get(date)!.mood.push(checkin.mood);
        dailyData.get(date)!.stress.push(checkin.stress);
        dailyData.get(date)!.count++;
      }
    });

    // Convert to chart format with averages
    const chartData = Array.from(dailyData.entries()).map(([date, data]) => {
      const dayName = format(new Date(date), 'EEE');
      const avgMood = data.mood.length > 0 ? 
        Math.round(data.mood.reduce((a, b) => a + b, 0) / data.mood.length * 10) / 10 : null;
      const avgStress = data.stress.length > 0 ? 
        Math.round(data.stress.reduce((a, b) => a + b, 0) / data.stress.length * 10) / 10 : null;
      
      return {
        date,
        day: dayName,
        mood: avgMood,
        stress: avgStress,
        hasData: data.count > 0
      };
    });

    // Calculate overall statistics
    const totalCheckins = moodCheckins.length;
    const averageMood = totalCheckins > 0 ? 
      Math.round(moodCheckins.reduce((acc, c) => acc + c.mood, 0) / totalCheckins * 10) / 10 : 0;
    const averageStress = totalCheckins > 0 ? 
      Math.round(moodCheckins.reduce((acc, c) => acc + c.stress, 0) / totalCheckins * 10) / 10 : 0;
    
    // Mood trend analysis
    let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (moodCheckins.length >= 7) {
      const recentMood = moodCheckins.slice(-7).reduce((acc, c) => acc + c.mood, 0) / 7;
      const olderMood = moodCheckins.slice(0, 7).reduce((acc, c) => acc + c.mood, 0) / 7;
      const diff = recentMood - olderMood;
      
      if (diff > 0.5) moodTrend = 'improving';
      else if (diff < -0.5) moodTrend = 'declining';
    }

    // Stress trend analysis
    let stressTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (moodCheckins.length >= 7) {
      const recentStress = moodCheckins.slice(-7).reduce((acc, c) => acc + c.stress, 0) / 7;
      const olderStress = moodCheckins.slice(0, 7).reduce((acc, c) => acc + c.stress, 0) / 7;
      const diff = olderStress - recentStress; // Lower stress is better
      
      if (diff > 0.5) stressTrend = 'improving';
      else if (diff < -0.5) stressTrend = 'declining';
    }

    const progress = {
      chartData,
      statistics: {
        totalCheckins,
        averageMood,
        averageStress,
        moodTrend,
        stressTrend,
        daysTracked: moodCheckins.length > 0 ? 
          Math.ceil((new Date().getTime() - moodCheckins[moodCheckins[0].createdAt].getTime()) / (1000 * 60 * 60 * 24)) : 0
      }
    };

    return NextResponse.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
