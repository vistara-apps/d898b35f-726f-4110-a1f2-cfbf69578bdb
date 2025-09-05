'use client';

import { ReactNode } from 'react';
import { Shield, Menu, User } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="floating-shapes">
        <div className="shape w-16 h-16 bg-blue-400 rounded-lg" style={{ left: '10%', animationDelay: '0s' }} />
        <div className="shape w-12 h-12 bg-purple-400 rounded-full" style={{ left: '80%', animationDelay: '5s' }} />
        <div className="shape w-8 h-8 bg-pink-400 rounded-lg" style={{ left: '60%', animationDelay: '10s' }} />
        <div className="shape w-20 h-20 bg-indigo-400 rounded-full" style={{ left: '30%', animationDelay: '15s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-white" />
          <h1 className="text-xl font-bold text-white">RightsCard</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">Home</a>
          <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">Explore</a>
          <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">About</a>
          <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">Rights Command</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200">
            <User className="w-5 h-5 text-white" />
          </button>
          <button className="md:hidden p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container max-w-lg mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
}
