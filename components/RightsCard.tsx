'use client';

import { useState } from 'react';
import { Check, X, Info, Share2 } from 'lucide-react';
import { RightsCard as RightsCardType } from '@/lib/types';

interface RightsCardProps {
  card: RightsCardType;
  variant?: 'interactive' | 'static';
  onShare?: () => void;
}

export function RightsCard({ card, variant = 'interactive', onShare }: RightsCardProps) {
  const [activeTab, setActiveTab] = useState<'dos' | 'donts' | 'rights'>('dos');

  const tabs = [
    { id: 'dos' as const, label: "Do's and Don'ts", icon: Check },
    { id: 'rights' as const, label: 'Your Rights', icon: Info }
  ];

  return (
    <div className="glass-card p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{card.title}</h3>
        {variant === 'interactive' && onShare && (
          <button
            onClick={onShare}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-white bg-opacity-10 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white bg-opacity-20 text-white'
                : 'text-white text-opacity-70 hover:text-opacity-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {activeTab === 'dos' && (
          <div className="space-y-4">
            <div>
              <h4 className="flex items-center space-x-2 text-green-300 font-medium mb-2">
                <Check className="w-4 h-4" />
                <span>Do</span>
              </h4>
              <ul className="space-y-2">
                {card.content.dos.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-white text-opacity-90">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="flex items-center space-x-2 text-red-300 font-medium mb-2">
                <X className="w-4 h-4" />
                <span>Don't</span>
              </h4>
              <ul className="space-y-2">
                {card.content.donts.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-white text-opacity-90">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'rights' && (
          <div>
            <h4 className="flex items-center space-x-2 text-blue-300 font-medium mb-3">
              <Info className="w-4 h-4" />
              <span>Your Legal Rights</span>
            </h4>
            <ul className="space-y-2">
              {card.content.keyRights.map((right, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-white text-opacity-90">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{right}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Scripts Section */}
      {variant === 'interactive' && (
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <h4 className="text-sm font-medium text-white text-opacity-80 mb-2">Helpful Phrases:</h4>
          <div className="flex flex-wrap gap-2">
            {card.script.phrases.slice(0, 2).map((phrase, index) => (
              <span
                key={index}
                className="text-xs bg-white bg-opacity-10 text-white px-2 py-1 rounded-full"
              >
                "{phrase}"
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
