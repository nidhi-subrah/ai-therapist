'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only rendering after client loads
  useEffect(() => {
    setIsClient(true);
    // Set initial message only on client side
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm here to listen and support you. How are you feeling today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render until client is ready to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#BDE4E1] animate-fade-in">
        <div className="bg-gradient-to-r from-[#BDE4E1] via-[#F1AB86] to-[#98473E] text-[#4A6C6F] p-6 rounded-t-3xl flex items-center space-x-4">
          <MessageCircle className="h-8 w-8 text-[#98473E]" />
          <h2 className="text-2xl font-bold tracking-tight">TheraMind Chat</h2>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="text-[#875C74] animate-fade-in">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#BDE4E1] animate-fade-in">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#BDE4E1] via-[#F1AB86] to-[#98473E] text-[#4A6C6F] p-6 rounded-t-3xl flex items-center space-x-4">
        <MessageCircle className="h-8 w-8 text-[#98473E]" />
        <h2 className="text-2xl font-bold tracking-tight">TheraMind Chat</h2>
        <span className="ml-auto text-xs font-medium text-[#875C74]">
          {session?.user?.id ? `Signed in as ${session.user.email}` : 'Anonymous'}
        </span>
      </div>
      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-[#F9EDCC] via-[#BDE4E1] to-[#F1AB86] rounded-b-3xl">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 rounded-full bg-[#4A6C6F] flex items-center justify-center shadow">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#98473E] via-[#F1AB86] to-[#BDE4E1] text-white'
                  : 'bg-white text-[#4A6C6F] border border-[#BDE4E1]'
              } animate-slide-in`}
            >
              <p className="text-base leading-relaxed whitespace-pre-line">{message.content}</p>
              <p className="text-xs opacity-60 mt-2 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 ml-2">
                <div className="w-8 h-8 rounded-full bg-[#98473E] flex items-center justify-center shadow">
                  <span className="text-white font-bold">You</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-[#4A6C6F] px-5 py-3 rounded-2xl shadow-lg border border-[#BDE4E1]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#4A6C6F] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#98473E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#F1AB86] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Input Area */}
      <div className="border-t p-6 bg-white rounded-b-3xl">
        <div className="flex items-end space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none border border-[#BDE4E1] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#4A6C6F] focus:border-transparent bg-[#F9EDCC] placeholder:text-[#875C74]"
            rows={2}
            disabled={isLoading}
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-[#4A6C6F] via-[#F1AB86] to-[#98473E] text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A6C6F] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-[#875C74] mt-3 text-right">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
