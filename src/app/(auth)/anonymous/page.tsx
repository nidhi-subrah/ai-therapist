'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function AnonymousPage() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    setIsLoading(true);
    
    // Create anonymous session
    const anonymousUser = {
      id: `anon_${Date.now()}`,
      name: nickname || 'Anonymous User',
      isAnonymous: true,
      createdAt: new Date().toISOString()
    };
    
    // Store in localStorage for session persistence
    localStorage.setItem('anonymousUser', JSON.stringify(anonymousUser));
    
    // Redirect to history page
    router.push('/history');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Anonymous Access</CardTitle>
            <CardDescription className="text-center">
              Start your therapy journey privately without creating an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="How would you like to be addressed?"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                This helps personalize your experience but is completely optional
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Anonymous Mode Benefits:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• No personal information required</li>
                <li>• Session data stored locally on your device</li>
                <li>• Complete privacy - no data sent to servers</li>
                <li>• Can upgrade to full account anytime</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Important Note:</h4>
              <p className="text-xs text-yellow-700">
                Your conversations will only be saved on this device. Clear your browser data will delete your history.
              </p>
            </div>
            
            <Button 
              onClick={handleContinue}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Starting...' : 'Start Anonymous Session'}
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Want to save your progress across devices?
              </p>
              <div className="space-x-4">
                <Link href="/signup" className="text-sm font-medium text-primary hover:text-primary/80">
                  Create Account
                </Link>
                <span className="text-gray-400">•</span>
                <Link href="/signin" className="text-sm font-medium text-primary hover:text-primary/80">
                  Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
