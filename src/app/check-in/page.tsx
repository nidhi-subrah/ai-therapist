import { requireAuth } from '@/lib/auth-helpers';

export default async function CheckInPage() {
  const session = await requireAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Daily Mood Check-in</h1>
        <p className="text-muted-foreground">
          Track your daily emotional state and stress levels to monitor your mental health journey.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <p className="text-center text-muted-foreground">
          Mood check-in functionality coming soon! Welcome, {session.user?.name || session.user?.email}.
        </p>
      </div>
    </div>
  );
}
