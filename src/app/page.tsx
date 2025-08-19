import Link from 'next/link';
import { getSession } from '@/lib/auth-helpers';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await getSession();

  if (session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Welcome back, {session.user.name || session.user.email}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Continue your mental health journey with AI Therapist.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Link href="/chat">
              <div className="p-6 border rounded-lg bg-card hover:bg-card/80 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold mb-2">Start Chat Session</h3>
                <p className="text-sm text-muted-foreground">
                  Begin a new conversation with your AI therapist.
                </p>
              </div>
            </Link>
            
            <Link href="/check-in">
              <div className="p-6 border rounded-lg bg-card hover:bg-card/80 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold mb-2">Daily Mood Check-in</h3>
                <p className="text-sm text-muted-foreground">
                  Track today&apos;s emotional state and stress levels.
                </p>
              </div>
            </Link>
            
            <Link href="/progress">
              <div className="p-6 border rounded-lg bg-card hover:bg-card/80 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold mb-2">View Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See your mental health journey over time.
                </p>
              </div>
            </Link>
            
            <Link href="/settings">
              <div className="p-6 border rounded-lg bg-card hover:bg-card/80 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account and preferences.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Welcome to AI Therapist
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI-powered mental health coach and therapist, available 24/7 to support your emotional well-being journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">AI Chat Therapy</h3>
            <p className="text-sm text-muted-foreground">
              Engage in meaningful conversations with our AI therapist for emotional support and guidance.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Daily Mood Check-ins</h3>
            <p className="text-sm text-muted-foreground">
              Track your emotional patterns and mood changes over time for better self-awareness.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your mental health journey with detailed insights and progress reports.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-8">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/signin">
            <Button variant="outline" size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
