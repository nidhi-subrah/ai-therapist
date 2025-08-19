import { requireAuth } from '@/lib/auth-helpers';

export default async function ChatPage() {
  const session = await requireAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Chat Therapy</h1>
        <p className="text-muted-foreground">
          Start a conversation with your AI therapist. This is a safe space to discuss your thoughts and feelings.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <p className="text-center text-muted-foreground">
          Chat functionality coming soon! Welcome, {session.user?.name || session.user?.email}.
        </p>
      </div>
    </div>
  );
}
