'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { 
  Car, 
  MessageSquare, 
  Home, 
  Handcuffs, 
  Users, 
  AlertTriangle,
  ChevronRight,
  Info
} from 'lucide-react';
import { INTERACTION_TYPES } from '@/lib/constants';

interface InteractionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (interactionType: string) => void;
  selectedLanguage?: string;
}

const INTERACTION_CONFIG = {
  [INTERACTION_TYPES.TRAFFIC_STOP]: {
    icon: Car,
    title: 'Traffic Stop',
    titleEs: 'Parada de Tráfico',
    description: 'Pulled over by police while driving',
    descriptionEs: 'Detenido por la policía mientras conduces',
    color: 'bg-blue-500',
    urgency: 'high'
  },
  [INTERACTION_TYPES.QUESTIONING]: {
    icon: MessageSquare,
    title: 'Police Questioning',
    titleEs: 'Interrogatorio Policial',
    description: 'Being questioned by law enforcement',
    descriptionEs: 'Siendo interrogado por las autoridades',
    color: 'bg-yellow-500',
    urgency: 'medium'
  },
  [INTERACTION_TYPES.HOME_SEARCH]: {
    icon: Home,
    title: 'Home Search',
    titleEs: 'Registro Domiciliario',
    description: 'Police searching your home or property',
    descriptionEs: 'Policía registrando tu hogar o propiedad',
    color: 'bg-red-500',
    urgency: 'high'
  },
  [INTERACTION_TYPES.ARREST]: {
    icon: Handcuffs,
    title: 'Arrest',
    titleEs: 'Arresto',
    description: 'Being arrested or detained',
    descriptionEs: 'Siendo arrestado o detenido',
    color: 'bg-red-600',
    urgency: 'critical'
  },
  [INTERACTION_TYPES.PROTEST]: {
    icon: Users,
    title: 'Protest/Assembly',
    titleEs: 'Protesta/Asamblea',
    description: 'At a protest or public assembly',
    descriptionEs: 'En una protesta o asamblea pública',
    color: 'bg-purple-500',
    urgency: 'medium'
  },
  [INTERACTION_TYPES.OTHER]: {
    icon: AlertTriangle,
    title: 'Other Interaction',
    titleEs: 'Otra Interacción',
    description: 'Other police interaction',
    descriptionEs: 'Otra interacción policial',
    color: 'bg-gray-500',
    urgency: 'low'
  }
};

export function InteractionSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedLanguage = 'en' 
}: InteractionSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const isSpanish = selectedLanguage === 'es';

  const handleSelect = (type: string) => {
    setSelectedType(type);
    setShowDetails(true);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType);
      onClose();
      setSelectedType(null);
      setShowDetails(false);
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedType(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getUrgencyText = (urgency: string) => {
    if (isSpanish) {
      switch (urgency) {
        case 'critical': return 'Crítico';
        case 'high': return 'Alto';
        case 'medium': return 'Medio';
        case 'low': return 'Bajo';
        default: return 'Desconocido';
      }
    }
    
    switch (urgency) {
      case 'critical': return 'Critical';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isSpanish ? 'Seleccionar Tipo de Interacción' : 'Select Interaction Type'}
      size="lg"
    >
      {!showDetails ? (
        <div className="space-y-4">
          <p className="text-white text-opacity-70 text-sm mb-6">
            {isSpanish 
              ? 'Selecciona el tipo de interacción policial que estás experimentando para obtener orientación específica.'
              : 'Select the type of police interaction you\'re experiencing to get specific guidance.'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(INTERACTION_CONFIG).map(([type, config]) => {
              const IconComponent = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => handleSelect(type)}
                  className="glass-card p-4 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${config.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">
                          {isSpanish ? config.titleEs : config.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium ${getUrgencyColor(config.urgency)}`}>
                            {getUrgencyText(config.urgency)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white text-opacity-40 group-hover:text-opacity-70 transition-all" />
                        </div>
                      </div>
                      
                      <p className="text-white text-opacity-60 text-sm">
                        {isSpanish ? config.descriptionEs : config.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-500 bg-opacity-10 rounded-lg border border-blue-500 border-opacity-20">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-300 text-sm font-medium mb-1">
                  {isSpanish ? 'Recordatorio Importante' : 'Important Reminder'}
                </p>
                <p className="text-blue-200 text-xs leading-relaxed">
                  {isSpanish 
                    ? 'Esta información es para orientación general. Siempre consulta con un abogado calificado para asesoramiento legal específico.'
                    : 'This information is for general guidance. Always consult with a qualified attorney for specific legal advice.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <InteractionDetails
          type={selectedType!}
          config={INTERACTION_CONFIG[selectedType!]}
          isSpanish={isSpanish}
          onConfirm={handleConfirm}
          onBack={handleBack}
        />
      )}
    </Modal>
  );
}

function InteractionDetails({
  type,
  config,
  isSpanish,
  onConfirm,
  onBack
}: {
  type: string;
  config: any;
  isSpanish: boolean;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const IconComponent = config.icon;

  const getQuickTips = (type: string, isSpanish: boolean): string[] => {
    if (isSpanish) {
      switch (type) {
        case INTERACTION_TYPES.TRAFFIC_STOP:
          return [
            'Mantén las manos visibles en el volante',
            'Permanece en el vehículo a menos que se te ordene salir',
            'Proporciona licencia, registro y seguro cuando se solicite',
            'Puedes permanecer en silencio más allá de la identificación'
          ];
        case INTERACTION_TYPES.QUESTIONING:
          return [
            'Pregunta si eres libre de irte',
            'Puedes negarte a responder preguntas',
            'Solicita un abogado si eres arrestado',
            'No consientas a registros'
          ];
        case INTERACTION_TYPES.HOME_SEARCH:
          return [
            'Pide ver la orden judicial',
            'No consientas a registros sin orden',
            'Observa pero no interfiera',
            'Solicita una copia de la orden'
          ];
        case INTERACTION_TYPES.ARREST:
          return [
            'No resistas el arresto',
            'Solicita un abogado inmediatamente',
            'Permanece en silencio',
            'Recuerda detalles para después'
          ];
        case INTERACTION_TYPES.PROTEST:
          return [
            'Conoce tus derechos de asamblea',
            'Mantente en áreas públicas',
            'No bloquees el tráfico',
            'Sigue las órdenes legales de dispersión'
          ];
        default:
          return [
            'Mantén la calma y sé respetuoso',
            'Conoce tus derechos constitucionales',
            'Documenta la interacción si es posible',
            'Busca asesoramiento legal si es necesario'
          ];
      }
    }

    switch (type) {
      case INTERACTION_TYPES.TRAFFIC_STOP:
        return [
          'Keep hands visible on steering wheel',
          'Stay in vehicle unless ordered out',
          'Provide license, registration, and insurance when asked',
          'You can remain silent beyond identification'
        ];
      case INTERACTION_TYPES.QUESTIONING:
        return [
          'Ask if you are free to leave',
          'You can refuse to answer questions',
          'Request a lawyer if arrested',
          'Don\'t consent to searches'
        ];
      case INTERACTION_TYPES.HOME_SEARCH:
        return [
          'Ask to see the warrant',
          'Don\'t consent to warrantless searches',
          'Observe but don\'t interfere',
          'Request a copy of the warrant'
        ];
      case INTERACTION_TYPES.ARREST:
        return [
          'Don\'t resist arrest',
          'Request a lawyer immediately',
          'Remain silent',
          'Remember details for later'
        ];
      case INTERACTION_TYPES.PROTEST:
        return [
          'Know your assembly rights',
          'Stay in public areas',
          'Don\'t block traffic',
          'Follow lawful dispersal orders'
        ];
      default:
        return [
          'Stay calm and respectful',
          'Know your constitutional rights',
          'Document the interaction if possible',
          'Seek legal advice if needed'
        ];
    }
  };

  const quickTips = getQuickTips(type, isSpanish);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-lg ${config.color} bg-opacity-20`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl font-semibold">
            {isSpanish ? config.titleEs : config.title}
          </h2>
          <p className="text-white text-opacity-70 text-sm">
            {isSpanish ? config.descriptionEs : config.description}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-3">
          {isSpanish ? 'Consejos Rápidos' : 'Quick Tips'}
        </h3>
        <div className="space-y-2">
          {quickTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-white text-opacity-80 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-300 text-sm font-medium mb-1">
              {isSpanish ? 'Recuerda' : 'Remember'}
            </p>
            <p className="text-yellow-200 text-xs leading-relaxed">
              {isSpanish 
                ? 'Cada situación es única. Esta orientación es general y no reemplaza el asesoramiento legal profesional.'
                : 'Every situation is unique. This guidance is general and doesn\'t replace professional legal advice.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button onClick={onConfirm} className="flex-1">
          {isSpanish ? 'Continuar con este Tipo' : 'Continue with This Type'}
        </Button>
        <Button variant="secondary" onClick={onBack}>
          {isSpanish ? 'Atrás' : 'Back'}
        </Button>
      </div>
    </div>
  );
}
