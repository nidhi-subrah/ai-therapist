import { requireAuth } from '@/lib/auth-helpers';

export default async function SettingsPage() {
  const session = await requireAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <p className="text-center text-muted-foreground">
          Settings functionality coming soon! Welcome, {session.user?.name || session.user?.email}.
        </p>
      </div>
    </div>
  );
}
