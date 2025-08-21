"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Activity, Heart, Brain } from 'lucide-react';

interface ProgressData {
  chartData: Array<{
    date: string;
    day: string;
    mood: number | null;
    stress: number | null;
    hasData: boolean;
  }>;
  statistics: {
    totalCheckins: number;
    averageMood: number;
    averageStress: number;
    moodTrend: 'improving' | 'stable' | 'declining';
    stressTrend: 'improving' | 'stable' | 'declining';
    daysTracked: number;
  };
}

export default function ProgressPage() {
  const { data: session } = useSession();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProgressData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchProgressData = async () => {
    try {
      const response = await fetch('/api/progress');
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      
      const data = await response.json();
      console.log('Progress API response:', data);
      
      if (data.success) {
        setProgressData(data.progress);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="text-center py-8">Loading your progress data...</div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to view your progress.</p>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No progress data available yet. Start tracking your mood!</p>
        </div>
      </div>
    );
  }

  const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#4A6C6F';
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#98473E';

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress</h1>
          <p className="text-muted-foreground">Track mood and stress trends over time.</p>
        </div>
        <Button 
          onClick={fetchProgressData}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.statistics.totalCheckins}</div>
            <p className="text-xs text-muted-foreground">Mood & stress entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.statistics.averageMood}/10</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getTrendColor(progressData.statistics.moodTrend)} capitalize`}>
                {progressData.statistics.moodTrend}
              </Badge>
              {getTrendIcon(progressData.statistics.moodTrend)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Stress</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.statistics.averageStress}/10</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getTrendColor(progressData.statistics.stressTrend)} capitalize`}>
                {progressData.statistics.stressTrend}
              </Badge>
              {getTrendIcon(progressData.statistics.stressTrend)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Tracked</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.statistics.daysTracked}</div>
            <p className="text-xs text-muted-foreground">Consistent tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood & Stress Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mood & Stress Trends</CardTitle>
          <CardDescription>Your emotional journey over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value: any, name: string) => [value, name === 'mood' ? 'Mood' : 'Stress']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke={primary.trim()} 
                  strokeWidth={2} 
                  dot={{ fill: primary.trim(), strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  stroke={accent.trim()} 
                  strokeWidth={2} 
                  dot={{ fill: accent.trim(), strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>Your mood and stress patterns this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData.chartData.slice(-7)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value: any, name: string) => [value, name === 'mood' ? 'Mood' : 'Stress']}
                />
                <Bar dataKey="mood" fill={primary.trim()} opacity={0.8} />
                <Bar dataKey="stress" fill={accent.trim()} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
