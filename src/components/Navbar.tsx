'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground hover:text-foreground/80">
              AI Therapist
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : session?.user ? (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {session.user.name || session.user.email}
                  </span>
                  <div className="flex space-x-2">
                    <Link href="/chat">
                      <Button variant="ghost" size="sm">Chat</Button>
                    </Link>
                    <Link href="/check-in">
                      <Button variant="ghost" size="sm">Check-in</Button>
                    </Link>
                    <Link href="/progress">
                      <Button variant="ghost" size="sm">Progress</Button>
                    </Link>
                    <Link href="/settings">
                      <Button variant="ghost" size="sm">Settings</Button>
                    </Link>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
