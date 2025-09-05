'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/AppShell';
import { RightsCard } from '@/components/RightsCard';
import { RecordButton } from '@/components/RecordButton';
import { RecordingViewer } from '@/components/RecordingViewer';
import { Settings } from '@/components/Settings';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Share2, FileText, Info, Settings as SettingsIcon, Play } from 'lucide-react';
import { DEFAULT_RIGHTS_CARDS, STATE_SPECIFIC_VARIATIONS } from '@/lib/constants';
import { generateRightsSummary, generateShareableCard } from '@/lib/ai';
import { formatTimestamp, getLocationString, generateId, shareContent } from '@/lib/utils';
import { InteractionRecording, AIGeneratedCard } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import toast, { Toaster } from 'react-hot-toast';
import '@/lib/i18n';

export default function HomePage() {
  const { t } = useTranslation();
  const {
    recordings,
    addRecording,
    showRightsModal,
    setShowRightsModal,
    showSettingsModal,
    setShowSettingsModal,
    selectedState,
    language
  } = useAppStore();
  
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<InteractionRecording | null>(null);
  const [showRecordingViewer, setShowRecordingViewer] = useState(false);
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
      try {
        const summary = await generateRightsSummary(
          recording.interactionType,
          duration,
          location
        );
        recording.aiSummary = summary;
      } catch (error) {
        console.error('Error generating AI summary:', error);
        recording.aiSummary = `${recording.interactionType.replace('_', ' ')} interaction recorded for ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;
      }
      
      // Add to recordings list using store
      addRecording(recording);
      
      // Show success message
      toast.success(t('recordingSaved'));
      
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error(t('recordingError'));
    }
  };

  const handleShareRights = async () => {
    setIsGeneratingCard(true);
    try {
      // Get the appropriate rights card based on selected state
      const baseCard = DEFAULT_RIGHTS_CARDS.traffic_stop;
      const stateVariations = STATE_SPECIFIC_VARIATIONS[selectedState as keyof typeof STATE_SPECIFIC_VARIATIONS];
      
      let cardContent = baseCard.content;
      if (stateVariations?.traffic_stop) {
        cardContent = {
          ...baseCard.content,
          keyRights: [
            ...baseCard.content.keyRights,
            ...(stateVariations.traffic_stop.additionalRights || [])
          ],
          dos: [
            ...baseCard.content.dos,
            ...(stateVariations.traffic_stop.additionalDos || [])
          ]
        };
      }
      
      const shareableText = await generateShareableCard(
        'traffic_stop',
        `Know your rights during police interactions in ${selectedState}`,
        cardContent.keyRights
      );
      
      const generatedCard: AIGeneratedCard = {
        summary: shareableText,
        keyPoints: cardContent.keyRights,
        shareableText,
        timestamp: new Date()
      };
      
      setAiCard(generatedCard);
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Error generating shareable card:', error);
      toast.error(t('errorGeneratingCard'));
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleShareCard = async () => {
    if (aiCard) {
      const success = await shareContent({
        title: `${t('appTitle')} - ${t('tagline')}`,
        text: aiCard.shareableText,
        url: window.location.href
      });
      
      if (success) {
        toast.success('Card shared successfully!');
      } else {
        toast.success(t('cardCopiedToClipboard'));
      }
    }
  };

  const handleViewRecording = (recording: InteractionRecording) => {
    setSelectedRecording(recording);
    setShowRecordingViewer(true);
  };

  return (
    <AppShell>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      <div className="space-y-8">
        {/* Header with Settings */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">{t('appTitle')}</h1>
            {selectedState !== 'General' && (
              <span className="text-sm bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded-full">
                {selectedState}
              </span>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSettingsModal(true)}
            className="p-2"
          >
            <SettingsIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {t('tagline').split(' ').slice(0, 2).join(' ')}<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('tagline').split(' ').slice(2).join(' ')}
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
              <span>{t('viewRightsCard')}</span>
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleShareRights}
              disabled={isGeneratingCard}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>{isGeneratingCard ? t('generating') : t('shareSummary')}</span>
            </Button>
          </div>
        </section>

        {/* Recording Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">{t('recordInteraction')}</h2>
            <p className="text-white text-opacity-70 text-sm">
              Document your interaction for your safety and legal protection
            </p>
          </div>
          
          <RecordButton onRecordingComplete={handleRecordingComplete} />
        </section>

        {/* Recent Recordings */}
        {recordings.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-white">{t('recentRecordings')}</h3>
            <div className="space-y-3">
              {recordings.slice(0, 3).map((recording) => (
                <div key={recording.recordingId} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium capitalize">
                        {recording.interactionType.replace('_', ' ')}
                      </p>
                      <p className="text-white text-opacity-70 text-sm">
                        {formatTimestamp(recording.timestamp)} • {Math.floor(recording.duration / 60)}m {recording.duration % 60}s
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleViewRecording(recording)}
                      className="flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>{t('view')}</span>
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
            {t('legalDisclaimer')}
          </p>
        </section>
      </div>

      {/* Rights Card Modal */}
      <Modal
        isOpen={showRightsModal}
        onClose={() => setShowRightsModal(false)}
        title={`${selectedState} Legal Rights`}
      >
        <RightsCard
          card={{
            cardId: 'traffic-stop-default',
            state: selectedState,
            interactionType: 'traffic_stop',
            language: language,
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
        title={t('shareableSummary')}
      >
        {aiCard && (
          <div className="space-y-4">
            <div className="glass-card p-4 bg-white bg-opacity-5">
              <p className="text-white text-sm leading-relaxed">
                {aiCard.summary}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">{t('keyPoints')}</h4>
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
                {t('share')}
              </Button>
              <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
                {t('close')}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Recording Viewer Modal */}
      <RecordingViewer
        recording={selectedRecording}
        isOpen={showRecordingViewer}
        onClose={() => {
          setShowRecordingViewer(false);
          setSelectedRecording(null);
        }}
      />
    </AppShell>
  );
}
