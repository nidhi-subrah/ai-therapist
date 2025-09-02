import Image from "next/image";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-200 via-indigo-100 to-pink-200 opacity-80" />
      {/* Glassmorphism card */}
      <div className="max-w-3xl mx-auto space-y-10 bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mt-16 border border-white/30">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-indigo-900 drop-shadow-lg animate-in fade-in duration-700">
            Welcome to <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">AI Therapist</span>
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-700 font-medium animate-in fade-in duration-1000">
            Your AI-powered mental health coach, available 24/7 to support your emotional well-being journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="p-8 rounded-xl bg-gradient-to-br from-white/80 to-teal-100 shadow-lg border border-teal-200">
            <h3 className="text-xl font-semibold mb-2 text-teal-700">AI Chat Therapy</h3>
            <p className="text-base text-teal-900">
              Engage in meaningful conversations with our AI therapist for emotional support and guidance.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-gradient-to-br from-white/80 to-indigo-100 shadow-lg border border-indigo-200">
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">Daily Mood Check-ins</h3>
            <p className="text-base text-indigo-900">
              Track your emotional patterns and mood changes over time for better self-awareness.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-lg text-indigo-800 font-semibold animate-in fade-in duration-1000">
            Start your mental health journey today with our AI therapist.
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <a href="#chat" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-teal-400 via-indigo-400 to-pink-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200">
            Start Chatting Now
          </a>
        </div>
      </div>

      {/* Chat Interface */}
      <div id="chat" className="w-full max-w-4xl mt-16 animate-in fade-in duration-1000">
        <ChatInterface />
      </div>
    </div>
  );
}
