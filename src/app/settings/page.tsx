'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Download, Trash2, LogOut, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface AnonymousUser {
  id: string;
  name: string;
  isAnonymous: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check for anonymous user
    const stored = localStorage.getItem('anonymousUser');
    if (stored) {
      const user = JSON.parse(stored);
      setAnonymousUser(user);
      setName(user.name);
    }
    
    // Set user data if signed in
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleSignOut = async () => {
    setIsLoading(true);
    
    if (session) {
      // Regular user sign out
      await signOut({ callbackUrl: '/signin' });
    } else {
      // Anonymous user - clear localStorage
      localStorage.removeItem('anonymousUser');
      window.location.href = '/signin';
    }
  };

  const handleExportData = () => {
    // Export user data and conversation history
    const exportData = {
      user: session?.user || anonymousUser,
      exportDate: new Date().toISOString(),
      conversations: [], // Would fetch from database or localStorage
      moodCheckins: [], // Would fetch mood data
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-therapist-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      if (anonymousUser) {
        localStorage.clear();
        window.location.href = '/signin';
      } else {
        // Would call API to delete user account and data
        alert('Account deletion will be implemented. Please contact support for now.');
      }
    }
  };

  const upgradeToAccount = () => {
    // Transfer anonymous data to a real account
    const userData = {
      anonymousData: anonymousUser,
      conversations: [], // Get from localStorage
    };
    
    localStorage.setItem('upgradeData', JSON.stringify(userData));
    window.location.href = '/signup?upgrade=true';
  };

  const currentUser = session?.user || anonymousUser;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9EDCC]">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 border border-[#BDE4E1] mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#875C74] mb-2">Settings</h1>
          <p className="text-[#4A6C6F]">Manage your account and privacy preferences</p>
        </div>
        <div className="grid gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Account Information</CardTitle>
              </div>
              {anonymousUser && (
                <Badge variant="secondary" className="ml-auto">
                  Anonymous
                </Badge>
              )}
              {session && (
                <Badge variant="default" className="ml-auto">
                  Registered
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        disabled={!session}
                      />
                    </div>
                    {session && (
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          type="email"
                        />
                      </div>
                    )}
                  </div>
                  {session && (
                    <Button className="w-full md:w-auto">
                      Save Changes
                    </Button>
                  )}
                  {anonymousUser && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex items-start space-x-3">
                        <UserCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-blue-800">Upgrade to Full Account</h4>
                          <p className="text-sm text-blue-600 mt-1">
                            Create a permanent account to sync across devices and never lose your progress.
                          </p>
                          <Button 
                            onClick={upgradeToAccount}
                            size="sm" 
                            className="mt-3"
                          >
                            Upgrade Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No active session found</p>
                  <Link href="/signin">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Privacy & Data</CardTitle>
              </div>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Export Your Data</h4>
                  <p className="text-sm text-gray-500">
                    Download a copy of all your conversations and mood data
                  </p>
                </div>
                <Button 
                  onClick={handleExportData}
                  variant="outline" 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-red-800">Delete All Data</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button 
                  onClick={handleDeleteData}
                  variant="destructive" 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="w-full flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4" />
                <span>
                  {isLoading 
                    ? 'Signing out...' 
                    : session 
                      ? 'Sign Out' 
                      : 'End Anonymous Session'
                  }
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}