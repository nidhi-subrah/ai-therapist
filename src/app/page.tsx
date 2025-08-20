import Image from "next/image";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Welcome to AI Therapist
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI-powered mental health coach and therapist, available 24/7 to support your emotional well-being journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">AI Chat Therapy</h3>
            <p className="text-sm text-muted-foreground">
              Engage in meaningful conversations with our AI therapist for emotional support and guidance.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Daily Mood Check-ins</h3>
            <p className="text-sm text-muted-foreground">
              Track your emotional patterns and mood changes over time for better self-awareness.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your mental health journey with detailed insights and progress reports.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Start your mental health journey today with our AI therapist.
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-full max-w-4xl mt-12">
        <ChatInterface />
      </div>
    </div>
  );
}
