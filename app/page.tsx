'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { RightsCard } from '@/components/RightsCard';
import { RecordButton } from '@/components/RecordButton';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Share2, FileText, Info } from 'lucide-react';
import { DEFAULT_RIGHTS_CARDS } from '@/lib/constants';
import { generateRightsSummary, generateShareableCard } from '@/lib/ai';
import { formatTimestamp, getLocationString, generateId } from '@/lib/utils';
import { InteractionRecording, AIGeneratedCard } from '@/lib/types';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function HomePage() {
  const [showRightsModal, setShowRightsModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [recordings, setRecordings] = useState<InteractionRecording[]>([]);
  const [aiCard, setAiCard] = useState<AIGeneratedCard | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleRecordingComplete = async (blob: Blob, duration: number, type: 'audio' | 'video') => {
    try {
      // Create a local URL for the recording
      const url = URL.createObjectURL(blob);
      const location = await getLocationString();
      
      const recording: InteractionRecording = {
        recordingId: generateId(),
        userId: 'current-user', // In a real app, this would come from auth
        timestamp: new Date(),
        duration,
        filePath: url,
        interactionType: 'traffic_stop', // Default, could be selected by user
        location,
        createdAt: new Date()
      };

      // Generate AI summary
      const summary = await generateRightsSummary(
        recording.interactionType,
        duration,
        location
      );
      
      recording.aiSummary = summary;
      
      // Add to recordings list
      setRecordings(prev => [recording, ...prev]);
      
      // Show success message
      alert(`${type === 'video' ? 'Video' : 'Audio'} recording saved successfully!`);
      
    } catch (error) {
      console.error('Error saving recording:', error);
      alert('Error saving recording. Please try again.');
    }
  };

  const handleShareRights = async () => {
    setIsGeneratingCard(true);
    try {
      const card = DEFAULT_RIGHTS_CARDS.traffic_stop;
      const shareableText = await generateShareableCard(
        'traffic_stop',
        'Know your rights during police interactions',
        card.content.keyRights
      );
      
      const generatedCard: AIGeneratedCard = {
        summary: shareableText,
        keyPoints: card.content.keyRights,
        shareableText,
        timestamp: new Date()
      };
      
      setAiCard(generatedCard);
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Error generating shareable card:', error);
      alert('Error generating shareable card. Please try again.');
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleShareCard = () => {
    if (aiCard) {
      if (navigator.share) {
        navigator.share({
          title: 'RightsCard - Know Your Rights',
          text: aiCard.shareableText,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(aiCard.shareableText);
        alert('Card content copied to clipboard!');
      }
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            State and our<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Rights Card
            </span>
          </h1>
          
          <p className="text-white text-opacity-80 max-w-md mx-auto leading-relaxed">
            Access state-specific legal rights for your interactions. 
            Know what to do and what not to do in critical moments that might affect your world.
          </p>
        </section>

        {/* Main Action Buttons */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowRightsModal(true)}
              className="flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>View Rights Card</span>
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleShareRights}
              disabled={isGeneratingCard}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>{isGeneratingCard ? 'Generating...' : 'Share Summary'}</span>
            </Button>
          </div>
        </section>

        {/* Recording Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">Record Interaction</h2>
            <p className="text-white text-opacity-70 text-sm">
              Document your interaction for your safety and legal protection
            </p>
          </div>
          
          <RecordButton onRecordingComplete={handleRecordingComplete} />
        </section>

        {/* Recent Recordings */}
        {recordings.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Recent Recordings</h3>
            <div className="space-y-3">
              {recordings.slice(0, 3).map((recording) => (
                <div key={recording.recordingId} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium capitalize">
                        {recording.interactionType.replace('_', ' ')}
                      </p>
                      <p className="text-white text-opacity-70 text-sm">
                        {formatTimestamp(recording.timestamp)} • {Math.floor(recording.duration / 60)}m {recording.duration % 60}s
                      </p>
                    </div>
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                  </div>
                  {recording.aiSummary && (
                    <p className="text-white text-opacity-80 text-sm mt-2 line-clamp-2">
                      {recording.aiSummary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Info */}
        <section className="text-center py-8">
          <p className="text-white text-opacity-60 text-xs max-w-sm mx-auto">
            RightsCard provides general legal information and should not replace professional legal advice. 
            Always consult with a qualified attorney for specific legal matters.
          </p>
        </section>
      </div>

      {/* Rights Card Modal */}
      <Modal
        isOpen={showRightsModal}
        onClose={() => setShowRightsModal(false)}
        title="State Legal Rights"
      >
        <RightsCard
          card={{
            cardId: 'traffic-stop-default',
            state: 'General',
            interactionType: 'traffic_stop',
            language: 'en',
            ...DEFAULT_RIGHTS_CARDS.traffic_stop
          }}
          variant="interactive"
          onShare={handleShareRights}
        />
      </Modal>

      {/* AI Summary Modal */}
      <Modal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        title="Shareable Summary"
      >
        {aiCard && (
          <div className="space-y-4">
            <div className="glass-card p-4 bg-white bg-opacity-5">
              <p className="text-white text-sm leading-relaxed">
                {aiCard.summary}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Key Points:</h4>
              <ul className="space-y-1">
                {aiCard.keyPoints.map((point, index) => (
                  <li key={index} className="text-white text-opacity-80 text-sm flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <Button onClick={handleShareCard} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
