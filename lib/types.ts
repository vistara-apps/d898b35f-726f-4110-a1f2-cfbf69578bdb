export interface User {
  userId: string;
  walletAddress?: string;
  languagePreference: string;
  state: string;
  createdAt: Date;
}

export interface InteractionRecording {
  recordingId: string;
  userId: string;
  timestamp: Date;
  duration: number;
  filePath: string;
  interactionType: 'traffic_stop' | 'questioning' | 'home_search' | 'other';
  location?: string;
  aiSummary?: string;
  createdAt: Date;
  ipfsHash?: string;
  isUploaded?: boolean;
}

export interface RightsCard {
  cardId: string;
  state: string;
  interactionType: string;
  title: string;
  content: {
    dos: string[];
    donts: string[];
    keyRights: string[];
    emergencyContacts?: string[];
    legalResources?: string[];
  };
  script: {
    phrases: string[];
    responses: string[];
    emergencyPhrases?: string[];
  };
  language: string;
}

export interface RecordingState {
  isRecording: boolean;
  recordingType: 'audio' | 'video' | null;
  startTime: Date | null;
  mediaRecorder: MediaRecorder | null;
  stream: MediaStream | null;
  duration: number;
}

export interface AIGeneratedCard {
  summary: string;
  keyPoints: string[];
  shareableText: string;
  timestamp: Date;
  interactionType?: string;
  state?: string;
}

export interface AppState {
  user: User | null;
  recordings: InteractionRecording[];
  selectedState: string;
  selectedLanguage: string;
  isOnline: boolean;
}

export interface NotificationSettings {
  enablePushNotifications: boolean;
  enableLocationAlerts: boolean;
  enableRecordingReminders: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isLawyer: boolean;
}

export interface LegalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'contact' | 'organization';
  state?: string;
}

export interface ShareableCardData {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  timestamp: Date;
  interactionType: string;
  state: string;
  language: string;
  ipfsHash?: string;
}
