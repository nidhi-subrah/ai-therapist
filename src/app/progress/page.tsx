import { requireAuth } from '@/lib/auth-helpers';

export default async function ProgressPage() {
  const session = await requireAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
        <p className="text-muted-foreground">
          View your mental health progress over time with detailed insights and analytics.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <p className="text-center text-muted-foreground">
          Progress tracking functionality coming soon! Welcome, {session.user?.name || session.user?.email}.
        </p>
      </div>
    </div>
  );
}
