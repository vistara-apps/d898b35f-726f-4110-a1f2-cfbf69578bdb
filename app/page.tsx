'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { RightsCard } from '@/components/RightsCard';
import { RecordButton } from '@/components/RecordButton';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Settings } from '@/components/Settings';
import { InteractionSelector } from '@/components/InteractionSelector';
import { 
  Share2, 
  FileText, 
  Info, 
  Settings as SettingsIcon,
  MapPin,
  Globe,
  Shield,
  Download,
  Play,
  Pause,
  AlertTriangle
} from 'lucide-react';
import { DEFAULT_RIGHTS_CARDS, SPANISH_RIGHTS_CARDS, STATE_NAMES } from '@/lib/constants';
import { generateRightsSummary, generateShareableCard } from '@/lib/ai';
import { formatTimestamp, getLocationString, generateId, formatDurationHuman, shareContent } from '@/lib/utils';
import { InteractionRecording, AIGeneratedCard } from '@/lib/types';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { 
  useAppStore, 
  useSelectedState, 
  useSelectedLanguage, 
  useRecordings,
  usePreferences 
} from '@/lib/store';
import { analyticsService, notificationService } from '@/lib/services';
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [showRightsModal, setShowRightsModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInteractionSelector, setShowInteractionSelector] = useState(false);
  const [selectedInteractionType, setSelectedInteractionType] = useState('traffic_stop');
  const [aiCard, setAiCard] = useState<AIGeneratedCard | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  const { setFrameReady } = useMiniKit();
  
  // Store hooks
  const selectedState = useSelectedState();
  const selectedLanguage = useSelectedLanguage();
  const recordings = useRecordings();
  const preferences = usePreferences();
  const { addRecording, setOnlineStatus } = useAppStore();

  useEffect(() => {
    setFrameReady();
    
    // Track app opened
    analyticsService.track('app_opened');
    
    // Set up online/offline detection
    const handleOnline = () => {
      setIsOnline(true);
      setOnlineStatus(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setOnlineStatus(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Request notification permission
    notificationService.requestPermission();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setFrameReady, setOnlineStatus]);

  const handleRecordingComplete = async (blob: Blob, duration: number, type: 'audio' | 'video') => {
    try {
      // Create a local URL for the recording
      const url = URL.createObjectURL(blob);
      const location = preferences.enableLocationTracking ? await getLocationString() : 'Location disabled';
      
      const recording: InteractionRecording = {
        recordingId: generateId(),
        userId: 'current-user', // In a real app, this would come from auth
        timestamp: new Date(),
        duration,
        filePath: url,
        interactionType: selectedInteractionType as any,
        location,
        createdAt: new Date(),
        isUploaded: false
      };

      // Generate AI summary
      try {
        const summary = await generateRightsSummary(
          recording.interactionType,
          duration,
          location,
          selectedLanguage
        );
        recording.aiSummary = summary;
      } catch (error) {
        console.error('Failed to generate AI summary:', error);
        recording.aiSummary = selectedLanguage === 'es' 
          ? 'Resumen no disponible' 
          : 'Summary unavailable';
      }
      
      // Add to recordings list
      addRecording(recording);
      
      // Track recording completion
      analyticsService.track('recording_completed', { 
        type, 
        duration, 
        interactionType: selectedInteractionType 
      });
      
      // Show success message
      toast.success(
        selectedLanguage === 'es' 
          ? `Grabación de ${type === 'video' ? 'video' : 'audio'} guardada exitosamente!`
          : `${type === 'video' ? 'Video' : 'Audio'} recording saved successfully!`
      );
      
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error(
        selectedLanguage === 'es' 
          ? 'Error al guardar la grabación. Inténtalo de nuevo.'
          : 'Error saving recording. Please try again.'
      );
    }
  };

  const handleShareRights = async () => {
    setIsGeneratingCard(true);
    try {
      const cards = selectedLanguage === 'es' ? SPANISH_RIGHTS_CARDS : DEFAULT_RIGHTS_CARDS;
      const card = cards[selectedInteractionType as keyof typeof cards] || cards.traffic_stop;
      
      const shareableText = await generateShareableCard(
        selectedInteractionType,
        selectedLanguage === 'es' ? 'Conoce tus derechos durante las interacciones policiales' : 'Know your rights during police interactions',
        card.content.keyRights,
        selectedLanguage,
        selectedState
      );
      
      const generatedCard: AIGeneratedCard = {
        summary: shareableText,
        keyPoints: card.content.keyRights,
        shareableText,
        timestamp: new Date(),
        interactionType: selectedInteractionType,
        state: selectedState
      };
      
      setAiCard(generatedCard);
      setShowSummaryModal(true);
      
      // Track card generation
      analyticsService.track('card_shared', { 
        interactionType: selectedInteractionType,
        state: selectedState,
        language: selectedLanguage
      });
      
    } catch (error) {
      console.error('Error generating shareable card:', error);
      toast.error(
        selectedLanguage === 'es' 
          ? 'Error al generar la tarjeta compartible. Inténtalo de nuevo.'
          : 'Error generating shareable card. Please try again.'
      );
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleShareCard = async () => {
    if (aiCard) {
      try {
        await shareContent({
          title: 'RightsCard - Know Your Rights',
          text: aiCard.shareableText,
          url: window.location.href
        });
        
        toast.success(
          selectedLanguage === 'es' 
            ? 'Contenido compartido exitosamente!'
            : 'Content shared successfully!'
        );
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error(
          selectedLanguage === 'es' 
            ? 'Error al compartir. Contenido copiado al portapapeles.'
            : 'Error sharing. Content copied to clipboard.'
        );
      }
    }
  };

  const handleInteractionSelect = (interactionType: string) => {
    setSelectedInteractionType(interactionType);
    analyticsService.track('rights_card_viewed', { interactionType });
  };

  // Get current rights card
  const cards = selectedLanguage === 'es' ? SPANISH_RIGHTS_CARDS : DEFAULT_RIGHTS_CARDS;
  const currentRightsCard = cards[selectedInteractionType as keyof typeof cards] || cards.traffic_stop;

  return (
    <AppShell>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      <div className="space-y-8">
        {/* Header with Settings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-white text-opacity-60" />
              <span className="text-white text-opacity-80 text-sm">
                {STATE_NAMES[selectedState]} ({selectedState})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-white text-opacity-60" />
              <span className="text-white text-opacity-80 text-sm">
                {selectedLanguage === 'es' ? 'Español' : 'English'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isOnline && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">
                  {selectedLanguage === 'es' ? 'Sin conexión' : 'Offline'}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-white text-opacity-60 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {selectedLanguage === 'es' ? (
              <>
                Tu Defensa<br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Legal Portátil
                </span>
              </>
            ) : (
              <>
                Your Pocket<br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Legal Defense
                </span>
              </>
            )}
          </h1>
          
          <p className="text-white text-opacity-80 max-w-md mx-auto leading-relaxed">
            {selectedLanguage === 'es' 
              ? 'Accede a derechos legales específicos del estado para tus interacciones. Sabe qué hacer y qué no hacer en momentos críticos.'
              : 'Access state-specific legal rights for your interactions. Know what to do and what not to do in critical moments.'
            }
          </p>
        </section>

        {/* Interaction Type Selector */}
        <section className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">
              {selectedLanguage === 'es' ? 'Tipo de Interacción' : 'Interaction Type'}
            </h2>
            <button
              onClick={() => setShowInteractionSelector(true)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {selectedLanguage === 'es' ? 'Cambiar' : 'Change'}
            </button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-5 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-white font-medium capitalize">
              {currentRightsCard.title}
            </span>
          </div>
        </section>

        {/* Main Action Buttons */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowRightsModal(true)}
              className="flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>
                {selectedLanguage === 'es' ? 'Ver Tarjeta de Derechos' : 'View Rights Card'}
              </span>
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleShareRights}
              disabled={isGeneratingCard}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>
                {isGeneratingCard 
                  ? (selectedLanguage === 'es' ? 'Generando...' : 'Generating...') 
                  : (selectedLanguage === 'es' ? 'Compartir Resumen' : 'Share Summary')
                }
              </span>
            </Button>
          </div>
        </section>

        {/* Recording Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {selectedLanguage === 'es' ? 'Grabar Interacción' : 'Record Interaction'}
            </h2>
            <p className="text-white text-opacity-70 text-sm">
              {selectedLanguage === 'es' 
                ? 'Documenta tu interacción para tu seguridad y protección legal'
                : 'Document your interaction for your safety and legal protection'
              }
            </p>
          </div>
          
          <RecordButton 
            onRecordingComplete={handleRecordingComplete}
            defaultType={preferences.defaultRecordingType}
            language={selectedLanguage}
          />
        </section>

        {/* Recent Recordings */}
        {recordings.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              {selectedLanguage === 'es' ? 'Grabaciones Recientes' : 'Recent Recordings'}
            </h3>
            <div className="space-y-3">
              {recordings.slice(0, 3).map((recording) => (
                <div key={recording.recordingId} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-white font-medium capitalize">
                          {recording.interactionType.replace('_', ' ')}
                        </p>
                        {!recording.isUploaded && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Local only" />
                        )}
                      </div>
                      <p className="text-white text-opacity-70 text-sm">
                        {formatTimestamp(recording.timestamp)} • {formatDurationHuman(recording.duration)}
                      </p>
                      {recording.location && recording.location !== 'Location disabled' && (
                        <p className="text-white text-opacity-50 text-xs mt-1">
                          📍 {recording.location}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {recording.aiSummary && (
                    <div className="mt-3 p-3 bg-blue-500 bg-opacity-10 rounded-lg">
                      <p className="text-blue-200 text-sm line-clamp-2">
                        {recording.aiSummary}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {recordings.length > 3 && (
                <div className="text-center">
                  <Button variant="secondary" size="sm">
                    {selectedLanguage === 'es' 
                      ? `Ver todas (${recordings.length})`
                      : `View all (${recordings.length})`
                    }
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer Info */}
        <section className="text-center py-8">
          <p className="text-white text-opacity-60 text-xs max-w-sm mx-auto">
            {selectedLanguage === 'es' 
              ? 'RightsCard proporciona información legal general y no debe reemplazar el asesoramiento legal profesional. Siempre consulta con un abogado calificado para asuntos legales específicos.'
              : 'RightsCard provides general legal information and should not replace professional legal advice. Always consult with a qualified attorney for specific legal matters.'
            }
          </p>
        </section>
      </div>

      {/* Rights Card Modal */}
      <Modal
        isOpen={showRightsModal}
        onClose={() => setShowRightsModal(false)}
        title={selectedLanguage === 'es' ? 'Derechos Legales del Estado' : 'State Legal Rights'}
      >
        <RightsCard
          card={{
            cardId: `${selectedInteractionType}-${selectedState}`,
            state: selectedState,
            interactionType: selectedInteractionType,
            language: selectedLanguage,
            ...currentRightsCard
          }}
          variant="interactive"
          onShare={handleShareRights}
        />
      </Modal>

      {/* AI Summary Modal */}
      <Modal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        title={selectedLanguage === 'es' ? 'Resumen Compartible' : 'Shareable Summary'}
      >
        {aiCard && (
          <div className="space-y-4">
            <div className="glass-card p-4 bg-white bg-opacity-5">
              <p className="text-white text-sm leading-relaxed">
                {aiCard.summary}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">
                {selectedLanguage === 'es' ? 'Puntos Clave:' : 'Key Points:'}
              </h4>
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
                {selectedLanguage === 'es' ? 'Compartir' : 'Share'}
              </Button>
              <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
                {selectedLanguage === 'es' ? 'Cerrar' : 'Close'}
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

      {/* Interaction Selector Modal */}
      <InteractionSelector
        isOpen={showInteractionSelector}
        onClose={() => setShowInteractionSelector(false)}
        onSelect={handleInteractionSelect}
        selectedLanguage={selectedLanguage}
      />
    </AppShell>
  );
}
