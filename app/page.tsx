'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';
import { RightsCard } from '@/components/RightsCard';
import { RecordButton } from '@/components/RecordButton';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Share2, FileText, Globe } from 'lucide-react';
import { SAMPLE_RIGHTS_CARDS, INTERACTION_TYPES, US_STATES } from '@/lib/constants';
import { RightsCard as RightsCardType, AIGeneratedCard } from '@/lib/types';
import { generateAISummary } from '@/lib/utils';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [selectedCard, setSelectedCard] = useState<RightsCardType | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<AIGeneratedCard | null>(null);
  const [selectedState, setSelectedState] = useState('CA');
  const [selectedInteraction, setSelectedInteraction] = useState('traffic_stop');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleRecordingComplete = async (recordingData: {
    id: string;
    duration: number;
    type: 'audio' | 'video';
    blob: Blob;
  }) => {
    try {
      // Generate AI summary
      const summary = await generateAISummary(
        selectedInteraction,
        recordingData.duration
      );

      // Generate shareable card
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interactionType: selectedInteraction,
          state: selectedState,
          context: `Recording completed: ${recordingData.type} for ${Math.floor(recordingData.duration / 60)}:${(recordingData.duration % 60).toString().padStart(2, '0')}`
        }),
      });

      if (response.ok) {
        const cardData = await response.json();
        setGeneratedCard({
          ...cardData,
          summary: summary
        });
        setShowSummaryModal(true);
      }
    } catch (error) {
      console.error('Error processing recording:', error);
    }
  };

  const handleShareCard = async (card: RightsCardType) => {
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interactionType: card.interactionType,
          state: card.state,
          context: card.title
        }),
      });

      if (response.ok) {
        const cardData = await response.json();
        setGeneratedCard(cardData);
        setShowSummaryModal(true);
      }
    } catch (error) {
      console.error('Error generating shareable card:', error);
    }
  };

  const shareToSocial = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'RightsCard - Know Your Rights',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Content copied to clipboard!');
    }
  };

  const currentCard = SAMPLE_RIGHTS_CARDS.find(
    card => card.state === selectedState && card.interactionType === selectedInteraction
  ) || SAMPLE_RIGHTS_CARDS[0];

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            State and our<br />
            Rights Card
          </h1>
          <p className="text-white text-opacity-80 text-lg leading-relaxed">
            Access state-specific legal rights for your interactions. 
            Know what to do and what to say when you need it most.
          </p>
        </div>

        {/* State and Interaction Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-white text-sm font-medium mb-2">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {US_STATES.map(state => (
                <option key={state} value={state} className="bg-gray-800 text-white">
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Interaction</label>
            <select
              value={selectedInteraction}
              onChange={(e) => setSelectedInteraction(e.target.value)}
              className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={INTERACTION_TYPES.TRAFFIC_STOP} className="bg-gray-800 text-white">
                Traffic Stop
              </option>
              <option value={INTERACTION_TYPES.QUESTIONING} className="bg-gray-800 text-white">
                Questioning
              </option>
              <option value={INTERACTION_TYPES.HOME_SEARCH} className="bg-gray-800 text-white">
                Home Search
              </option>
              <option value={INTERACTION_TYPES.OTHER} className="bg-gray-800 text-white">
                Other
              </option>
            </select>
          </div>
        </div>

        {/* Rights Card */}
        <div className="mb-8">
          <RightsCard 
            card={currentCard} 
            variant="interactive"
            onShare={handleShareCard}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-center">
            <RecordButton 
              variant="primary"
              onRecordingComplete={handleRecordingComplete}
            />
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowSummaryModal(true)}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Shareable Summary</span>
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setShowLanguageModal(true)}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Language</span>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setSelectedCard(currentCard);
              setShowCardModal(true);
            }}
            className="glass-card p-4 text-center hover:bg-opacity-15 transition-all duration-200"
          >
            <FileText className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white text-sm font-medium">View Full Card</span>
          </button>
          
          <button
            onClick={() => handleShareCard(currentCard)}
            className="glass-card p-4 text-center hover:bg-opacity-15 transition-all duration-200"
          >
            <Share2 className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white text-sm font-medium">Share Rights</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        title="State Legal Rights"
      >
        {selectedCard && (
          <RightsCard card={selectedCard} variant="static" />
        )}
      </Modal>

      <Modal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        title="Summary"
      >
        {generatedCard && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {generatedCard.title}
              </h3>
              <p className="text-white text-opacity-80 text-sm">
                {generatedCard.summary}
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Key Points:</h4>
              <ul className="space-y-1">
                {generatedCard.keyPoints.map((point, index) => (
                  <li key={index} className="text-white text-opacity-80 text-sm">
                    • {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t border-white border-opacity-20">
              <Button
                onClick={() => shareToSocial(generatedCard.shareableText)}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Summary</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title="Select Language"
      >
        <div className="space-y-3">
          <button
            onClick={() => {
              setLanguage('en');
              setShowLanguageModal(false);
            }}
            className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
              language === 'en'
                ? 'bg-blue-500 bg-opacity-30 text-white'
                : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
            }`}
          >
            English
          </button>
          
          <button
            onClick={() => {
              setLanguage('es');
              setShowLanguageModal(false);
            }}
            className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
              language === 'es'
                ? 'bg-blue-500 bg-opacity-30 text-white'
                : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
            }`}
          >
            Español
          </button>
        </div>
      </Modal>
    </AppShell>
  );
}
