'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogOut } from 'lucide-react';

interface AnonymousUser {
  id: string;
  name: string;
  isAnonymous: boolean;
}

export function Navbar() {
  const { data: session } = useSession();
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('anonymousUser');
    if (stored) {
      setAnonymousUser(JSON.parse(stored));
    }
  }, []);

  const currentUser = session?.user || anonymousUser;

  const handleSignOut = async () => {
    if (session) {
      await signOut({ callbackUrl: '/signin' });
    } else {
      localStorage.removeItem('anonymousUser');
      window.location.href = '/signin';
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
              AI Therapist
            </Link>
            {currentUser && (
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <Link href="/history" className="text-foreground/80 hover:text-primary">History</Link>
                <Link href="/check-in" className="text-foreground/80 hover:text-primary">Check-in</Link>
                <Link href="/progress" className="text-foreground/80 hover:text-primary">Progress</Link>
                <Link href="/resources" className="text-foreground/80 hover:text-primary">Resources</Link>
                <Link href="/about" className="text-foreground/80 hover:text-primary">About</Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  {anonymousUser && (
                    <Badge variant="secondary" className="text-xs">
                      Anonymous
                    </Badge>
                  )}
                </div>
                
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                </Link>
                
                <Button onClick={handleSignOut} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
