import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Therapist",
  description: "Your AI-powered mental health coach and therapist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {/* Top Navigation Bar */}
          <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                    AI Therapist
                  </Link>
                  <div className="hidden md:flex items-center space-x-4 text-sm">
                    <Link href="/chat" className="text-foreground/80 hover:text-primary">Chat</Link>
                    <Link href="/check-in" className="text-foreground/80 hover:text-primary">Check-in</Link>
                    <Link href="/progress" className="text-foreground/80 hover:text-primary">Progress</Link>
                    <Link href="/resources" className="text-foreground/80 hover:text-primary">Resources</Link>
                    <Link href="/about" className="text-foreground/80 hover:text-primary">About</Link>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href="/settings" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Settings</Link>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Main Content */}
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
