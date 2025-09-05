'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Info, Share2, X } from 'lucide-react';
import { RightsCard as RightsCardType } from '@/lib/types';

interface RightsCardProps {
  card: RightsCardType;
  variant?: 'interactive' | 'static';
  onShare?: (card: RightsCardType) => void;
}

export function RightsCard({ card, variant = 'interactive', onShare }: RightsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'dos' | 'donts' | 'scripts'>('dos');

  const handleShare = () => {
    if (onShare) {
      onShare(card);
    }
  };

  return (
    <div className="glass-card p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{card.title}</h3>
        {variant === 'interactive' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200"
            >
              {isExpanded ? <X className="w-4 h-4 text-white" /> : <Info className="w-4 h-4 text-white" />}
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-white bg-opacity-10 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('dos')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'dos'
              ? 'bg-white bg-opacity-20 text-white'
              : 'text-white text-opacity-70 hover:text-opacity-100'
          }`}
        >
          Do's
        </button>
        <button
          onClick={() => setActiveTab('donts')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'donts'
              ? 'bg-white bg-opacity-20 text-white'
              : 'text-white text-opacity-70 hover:text-opacity-100'
          }`}
        >
          Don'ts
        </button>
        <button
          onClick={() => setActiveTab('scripts')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'scripts'
              ? 'bg-white bg-opacity-20 text-white'
              : 'text-white text-opacity-70 hover:text-opacity-100'
          }`}
        >
          Scripts
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'dos' && (
          <div className="space-y-2">
            {card.content.dos.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'donts' && (
          <div className="space-y-2">
            {card.content.donts.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white text-opacity-80">English</h4>
              {card.script.en?.map((phrase, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-3">
                  <span className="text-white text-sm">"{phrase}"</span>
                </div>
              ))}
            </div>
            {card.script.es && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white text-opacity-80">Español</h4>
                {card.script.es.map((phrase, index) => (
                  <div key={index} className="bg-white bg-opacity-10 rounded-lg p-3">
                    <span className="text-white text-sm">"{phrase}"</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <h4 className="text-sm font-medium text-white mb-2">Your Key Rights</h4>
          <div className="space-y-2">
            {card.content.keyRights.map((right, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm text-opacity-90">{right}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
