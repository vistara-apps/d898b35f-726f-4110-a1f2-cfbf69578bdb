import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App Title and Navigation
      appTitle: 'RightsCard',
      tagline: 'Your Pocket Legal Defense',
      
      // Main Actions
      viewRightsCard: 'View Rights Card',
      shareSummary: 'Share Summary',
      recordInteraction: 'Record Interaction',
      
      // Rights Card Content
      trafficStopRights: 'Traffic Stop Rights',
      questioningRights: 'Questioning Rights',
      homeSearchRights: 'Home Search Rights',
      
      // Tabs
      dosAndDonts: "Do's and Don'ts",
      yourRights: 'Your Rights',
      scripts: 'Helpful Phrases',
      
      // Do's
      dos: 'Do',
      keepHandsVisible: 'Keep your hands visible',
      remainCalm: 'Remain calm and polite',
      provideDocuments: 'Provide license, registration, and insurance when asked',
      canRemainSilent: 'You can remain silent beyond basic identification',
      
      // Don'ts
      donts: "Don't",
      dontReachWithoutAnnouncing: "Don't reach for anything without announcing it",
      dontArgue: "Don't argue or resist",
      dontConsentToSearches: "Don't consent to searches without a warrant",
      dontLie: "Don't lie or provide false information",
      
      // Rights
      rightToRemainSilent: 'Right to remain silent',
      rightToRefuseSearch: 'Right to refuse consent to search',
      rightToAskIfFree: "Right to ask if you're free to leave",
      rightToRecord: 'Right to record the interaction',
      
      // Scripts/Phrases
      exerciseRightToSilence: 'I am exercising my right to remain silent',
      doNotConsent: 'I do not consent to any searches',
      amIFreeToLeave: 'Am I free to leave?',
      wantAttorney: 'I would like to speak to an attorney',
      understandOfficer: 'I understand, officer',
      complyingWithOrders: 'I am complying with your lawful orders',
      recordingForSafety: 'I am recording this interaction for my safety',
      
      // Recording
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      audioRecording: 'Audio Recording',
      videoRecording: 'Video Recording',
      recordingInProgress: 'Recording in progress...',
      recordingSaved: 'Recording saved successfully!',
      recordingError: 'Error saving recording. Please try again.',
      
      // Recent Recordings
      recentRecordings: 'Recent Recordings',
      noRecordings: 'No recordings yet',
      view: 'View',
      delete: 'Delete',
      
      // Modals
      close: 'Close',
      share: 'Share',
      generating: 'Generating...',
      shareableSummary: 'Shareable Summary',
      keyPoints: 'Key Points:',
      
      // Settings
      settings: 'Settings',
      language: 'Language',
      state: 'State',
      autoSave: 'Auto Save',
      cloudSync: 'Cloud Sync',
      notifications: 'Notifications',
      darkMode: 'Dark Mode',
      
      // Footer
      legalDisclaimer: 'RightsCard provides general legal information and should not replace professional legal advice. Always consult with a qualified attorney for specific legal matters.',
      
      // Errors
      errorGeneratingCard: 'Error generating shareable card. Please try again.',
      errorLoadingRights: 'Error loading rights information.',
      
      // Success Messages
      cardCopiedToClipboard: 'Card content copied to clipboard!',
      settingsSaved: 'Settings saved successfully!',
    }
  },
  es: {
    translation: {
      // App Title and Navigation
      appTitle: 'TarjetaDerechos',
      tagline: 'Tu Defensa Legal de Bolsillo',
      
      // Main Actions
      viewRightsCard: 'Ver Tarjeta de Derechos',
      shareSummary: 'Compartir Resumen',
      recordInteraction: 'Grabar Interacción',
      
      // Rights Card Content
      trafficStopRights: 'Derechos en Paradas de Tráfico',
      questioningRights: 'Derechos Durante Interrogatorio',
      homeSearchRights: 'Derechos en Registro Domiciliario',
      
      // Tabs
      dosAndDonts: 'Qué Hacer y No Hacer',
      yourRights: 'Tus Derechos',
      scripts: 'Frases Útiles',
      
      // Do's
      dos: 'Hacer',
      keepHandsVisible: 'Mantén las manos visibles',
      remainCalm: 'Mantente calmado y cortés',
      provideDocuments: 'Proporciona licencia, registro y seguro cuando te lo pidan',
      canRemainSilent: 'Puedes permanecer en silencio más allá de la identificación básica',
      
      // Don'ts
      donts: 'No Hacer',
      dontReachWithoutAnnouncing: 'No alcances nada sin anunciarlo',
      dontArgue: 'No discutas ni resistas',
      dontConsentToSearches: 'No consientas registros sin una orden judicial',
      dontLie: 'No mientas ni proporciones información falsa',
      
      // Rights
      rightToRemainSilent: 'Derecho a permanecer en silencio',
      rightToRefuseSearch: 'Derecho a rechazar consentimiento para registro',
      rightToAskIfFree: 'Derecho a preguntar si eres libre de irte',
      rightToRecord: 'Derecho a grabar la interacción',
      
      // Scripts/Phrases
      exerciseRightToSilence: 'Estoy ejerciendo mi derecho a permanecer en silencio',
      doNotConsent: 'No consiento ningún registro',
      amIFreeToLeave: '¿Soy libre de irme?',
      wantAttorney: 'Me gustaría hablar con un abogado',
      understandOfficer: 'Entiendo, oficial',
      complyingWithOrders: 'Estoy cumpliendo con sus órdenes legales',
      recordingForSafety: 'Estoy grabando esta interacción por mi seguridad',
      
      // Recording
      startRecording: 'Iniciar Grabación',
      stopRecording: 'Detener Grabación',
      audioRecording: 'Grabación de Audio',
      videoRecording: 'Grabación de Video',
      recordingInProgress: 'Grabación en progreso...',
      recordingSaved: '¡Grabación guardada exitosamente!',
      recordingError: 'Error al guardar la grabación. Inténtalo de nuevo.',
      
      // Recent Recordings
      recentRecordings: 'Grabaciones Recientes',
      noRecordings: 'Aún no hay grabaciones',
      view: 'Ver',
      delete: 'Eliminar',
      
      // Modals
      close: 'Cerrar',
      share: 'Compartir',
      generating: 'Generando...',
      shareableSummary: 'Resumen Compartible',
      keyPoints: 'Puntos Clave:',
      
      // Settings
      settings: 'Configuración',
      language: 'Idioma',
      state: 'Estado',
      autoSave: 'Guardado Automático',
      cloudSync: 'Sincronización en la Nube',
      notifications: 'Notificaciones',
      darkMode: 'Modo Oscuro',
      
      // Footer
      legalDisclaimer: 'TarjetaDerechos proporciona información legal general y no debe reemplazar el consejo legal profesional. Siempre consulta con un abogado calificado para asuntos legales específicos.',
      
      // Errors
      errorGeneratingCard: 'Error al generar tarjeta compartible. Inténtalo de nuevo.',
      errorLoadingRights: 'Error al cargar información de derechos.',
      
      // Success Messages
      cardCopiedToClipboard: '¡Contenido de la tarjeta copiado al portapapeles!',
      settingsSaved: '¡Configuración guardada exitosamente!',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
