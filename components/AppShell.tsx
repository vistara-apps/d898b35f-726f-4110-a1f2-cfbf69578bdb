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
      <header className="relative z-10 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">RightsCard</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-200">Home</a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-200">Explore</a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-200">About</a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-200">Rights Command</a>
            </nav>

            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200">
                <User className="w-5 h-5 text-white" />
              </button>
              <button className="md:hidden p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200">
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 bg-black bg-opacity-20 backdrop-blur-sm border-t border-white border-opacity-10">
        <div className="max-w-lg mx-auto px-4 py-6">
          <p className="text-center text-sm text-white text-opacity-70">
            RightsCard is a community resource and does not constitute legal advice. 
            Always consult with a qualified attorney for specific legal situations.
          </p>
        </div>
      </footer>
    </div>
  );
}
