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
    <nav className="relative z-20 border-b bg-white/60 backdrop-blur-lg supports-[backdrop-filter]:bg-white/40 shadow-lg">
      {/* Gradient bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-indigo-400 to-pink-400" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-200">
              TheraMind
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-base font-medium">
              <Link href="/history" className="text-indigo-700 hover:text-teal-600 transition-colors">History</Link>
              <Link href="/check-in" className="text-indigo-700 hover:text-teal-600 transition-colors">Check-in</Link>
              <Link href="/resources" className="text-indigo-700 hover:text-teal-600 transition-colors">Resources</Link>
              <Link href="/about" className="text-indigo-700 hover:text-teal-600 transition-colors">About</Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 bg-white/80 rounded-full px-4 py-2 shadow">
                  <User className="h-5 w-5 text-teal-500" />
                  <span className="text-base font-semibold text-indigo-900">{currentUser.name}</span>
                  {anonymousUser && (
                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-teal-400 to-indigo-400 text-white">
                      Anonymous
                    </Badge>
                  )}
                </div>
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="bg-gradient-to-r from-teal-400 to-indigo-400 text-white font-bold border-none shadow hover:scale-105 transition-transform duration-200">
                    Settings
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="hover:bg-pink-100">
                  <LogOut className="h-5 w-5 text-pink-500" />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="outline" size="sm" className="bg-gradient-to-r from-teal-400 to-indigo-400 text-white font-bold border-none shadow hover:scale-105 transition-transform duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-pink-400 to-indigo-400 text-white font-bold border-none shadow hover:scale-105 transition-transform duration-200">
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
