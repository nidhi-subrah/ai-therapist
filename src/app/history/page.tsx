'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageCircle, TrendingUp, Heart, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface Conversation {
  id: string;
  startedAt: string;
  endedAt?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  summary?: string;
  crisisFlag: boolean;
  moodTrend?: 'improving' | 'stable' | 'declining';
}

interface ProgressInsights {
  totalSessions: number;
  totalMessages: number;
  averageSessionLength: number;
  commonThemes: string[];
  moodTrend: 'improving' | 'stable' | 'declining';
  lastSession: string;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [insights, setInsights] = useState<ProgressInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversationHistory();
    }
  }, [session]);

  const fetchConversationHistory = async () => {
    try {
      // This would fetch from your API endpoint
      // For now, using mock data to demonstrate
      const mockConversations: Conversation[] = [
        {
          id: '1',
          startedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          endedAt: new Date(Date.now() - 86400000 + 1800000).toISOString(), // 30 min later
          messages: [
            { role: 'user', content: 'I am feeling anxious about my upcoming presentation' },
            { role: 'assistant', content: 'It sounds like you are feeling quite anxious about your presentation. That is completely understandable; public speaking can be nerve-wracking for almost everyone. Can you tell me a little more about what specifically is making you anxious?' },
            { role: 'user', content: 'I think it is the pressure to perform well and not disappoint my boss' },
            { role: 'assistant', content: 'That makes perfect sense. The pressure to perform well and meet your boss expectations can definitely be a major source of anxiety. It sounds like you care deeply about doing a good job and that admirable.' }
          ],
          summary: 'Discussed presentation anxiety and work pressure',
          crisisFlag: false,
          moodTrend: 'improving'
        },
        {
          id: '2',
          startedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          endedAt: new Date(Date.now() - 172800000 + 2400000).toISOString(), // 40 min later
          messages: [
            { role: 'user', content: 'I have been feeling overwhelmed with work lately' },
            { role: 'assistant', content: 'I can see you have been dealing with anxiety and stress. It sounds like this has been building up. What specific aspect feels most overwhelming right now?' }
          ],
          summary: 'Discussed work stress and feeling overwhelmed',
          crisisFlag: false,
          moodTrend: 'stable'
        }
      ];

      setConversations(mockConversations);
      
      // Calculate insights
      const totalMessages = mockConversations.reduce((acc, conv) => acc + conv.messages.length, 0);
      const totalSessions = mockConversations.length;
      const averageSessionLength = totalSessions > 0 ? totalMessages / totalSessions : 0;
      
      const commonThemes = ['anxiety', 'work stress', 'presentations', 'pressure'];
      const moodTrend = mockConversations[0]?.moodTrend || 'stable';
      const lastSession = mockConversations[0]?.startedAt || '';

      setInsights({
        totalSessions,
        totalMessages,
        averageSessionLength: Math.round(averageSessionLength),
        commonThemes,
        moodTrend,
        lastSession
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch conversation history:', error);
      setLoading(false);
    }
  };

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4" />;
      case 'declining': return <Activity className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your therapy history...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Therapy Journey</h1>
        <p className="text-gray-600">Track your progress and reflect on your conversations</p>
      </div>

      {/* Progress Insights */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Therapy conversations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.totalMessages}</div>
              <p className="text-xs text-muted-foreground">Words exchanged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Length</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.averageSessionLength}</div>
              <p className="text-xs text-muted-foreground">Messages per session</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
              {getMoodTrendIcon(insights.moodTrend)}
            </CardHeader>
            <CardContent>
              <Badge className={`${getMoodTrendColor(insights.moodTrend)} capitalize`}>
                {insights.moodTrend}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Overall progress</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Common Themes */}
      {insights && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Themes</CardTitle>
            <CardDescription>Topics you've been working on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.commonThemes.map((theme, index) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {theme}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Recent Sessions</h2>
        
        {conversations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No therapy sessions yet. Start your first conversation!</p>
            </CardContent>
          </Card>
        ) : (
          conversations.map((conversation) => (
            <Card key={conversation.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedConversation(conversation)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Session on {format(new Date(conversation.startedAt), 'MMM dd, yyyy')}
                    </CardTitle>
                    <CardDescription>
                      {conversation.messages.length} messages • 
                      {conversation.endedAt ? 
                        ` ${Math.round((new Date(conversation.endedAt).getTime() - new Date(conversation.startedAt).getTime()) / 60000)} minutes` : 
                        ' Ongoing'
                      }
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {conversation.crisisFlag && (
                      <Badge variant="destructive">Crisis</Badge>
                    )}
                    <Badge className={`${getMoodTrendColor(conversation.moodTrend || 'stable')} capitalize`}>
                      {conversation.moodTrend || 'stable'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {conversation.summary && (
                  <p className="text-gray-600 mb-3">{conversation.summary}</p>
                )}
                <div className="text-sm text-gray-500">
                  <p>Started: {format(new Date(conversation.startedAt), 'h:mm a')}</p>
                  {conversation.endedAt && (
                    <p>Ended: {format(new Date(conversation.endedAt), 'h:mm a')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Session on {format(new Date(selectedConversation.startedAt), 'MMM dd, yyyy')}
                </h3>
                <Button variant="outline" onClick={() => setSelectedConversation(null)}>
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                {selectedConversation.messages.map((message, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    message.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
                  }`}>
                    <div className="font-medium text-sm mb-1">
                      {message.role === 'user' ? 'You' : 'AI Therapist'}
                    </div>
                    <div className="text-gray-700">{message.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
