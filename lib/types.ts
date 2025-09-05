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
  };
  script: {
    [language: string]: string[];
  };
  language: string;
}

export interface RecordingState {
  isRecording: boolean;
  recordingType: 'audio' | 'video';
  startTime?: Date;
  mediaStream?: MediaStream;
}

export interface AIGeneratedCard {
  title: string;
  summary: string;
  keyPoints: string[];
  shareableText: string;
}
