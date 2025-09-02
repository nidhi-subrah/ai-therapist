import Image from "next/image";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden animate-fade-in">
      {/* Professional gradient background using palette */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#BDE4E1] via-[#F1AB86] to-[#98473E] opacity-90" />
      {/* Glassmorphism card */}
      <div className="max-w-3xl mx-auto space-y-10 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mt-16 border border-[#BDE4E1] animate-slide-in">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#4B1111] drop-shadow-lg animate-fade-in">
            Welcome to <span className="bg-gradient-to-r from-[#4A6C6F] via-[#F1AB86] to-[#98473E] bg-clip-text text-transparent">TheraMind</span>
          </h1>
          <p className="text-xl sm:text-2xl text-[#4A6C6F] font-medium animate-fade-in">
            Your AI-powered mental health coach, available 24/7 to support your emotional well-being journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="p-8 rounded-xl bg-gradient-to-br from-[#F9EDCC] to-[#BDE4E1] shadow-lg border border-[#4A6C6F] animate-fade-in">
            <h3 className="text-xl font-semibold mb-2 text-[#4A6C6F]">AI Chat Therapy</h3>
            <p className="text-base text-[#4B1111]">
              Engage in meaningful conversations with our AI therapist for emotional support and guidance.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-gradient-to-br from-[#FFA5D] to-[#F1AB86] shadow-lg border border-[#98473E] animate-fade-in">
            <h3 className="text-xl font-semibold mb-2 text-[#98473E]">Daily Mood Check-ins</h3>
            <p className="text-base text-[#4B1111]">
              Track your emotional patterns and mood changes over time for better self-awareness.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <a href="/history" className="block px-6 py-5 rounded-2xl bg-gradient-to-r from-[#4A6C6F] via-[#F1AB86] to-[#98473E] text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 text-center animate-fade-in">
            History
          </a>
          <a href="/check-in" className="block px-6 py-5 rounded-2xl bg-gradient-to-r from-[#98473E] via-[#BDE4E1] to-[#4A6C6F] text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 text-center animate-fade-in">
            Check-in
          </a>
          <a href="/resources" className="block px-6 py-5 rounded-2xl bg-gradient-to-r from-[#E4572E] via-[#F9EDCC] to-[#875C74] text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 text-center animate-fade-in">
            Resources
          </a>
          <a href="/about" className="block px-6 py-5 rounded-2xl bg-gradient-to-r from-[#361134] via-[#FFA5D] to-[#BDE4E1] text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 text-center animate-fade-in">
            About
          </a>
        </div>

        <div className="mt-10">
          <p className="text-lg text-[#875C74] font-semibold animate-fade-in">
            Start your mental health journey today with TheraMind.
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <a href="#chat" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#E4572E] via-[#F1AB86] to-[#4A6C6F] text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-fade-in">
            Start Chatting Now
          </a>
        </div>
      </div>

      {/* Chat Interface */}
      <div id="chat" className="w-full max-w-4xl mt-16 animate-fade-in">
        <ChatInterface />
      </div>
    </div>
  );
}
