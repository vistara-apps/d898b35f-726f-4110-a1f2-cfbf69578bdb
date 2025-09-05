import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InteractionRecording, User, RightsCard } from './types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Language and location
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  
  // Recordings
  recordings: InteractionRecording[];
  addRecording: (recording: InteractionRecording) => void;
  removeRecording: (recordingId: string) => void;
  updateRecording: (recordingId: string, updates: Partial<InteractionRecording>) => void;
  
  // UI state
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  recordingType: 'audio' | 'video' | null;
  setRecordingType: (type: 'audio' | 'video' | null) => void;
  
  // Modals
  showRightsModal: boolean;
  setShowRightsModal: (show: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  
  // Rights cards cache
  rightsCards: Record<string, RightsCard>;
  setRightsCard: (key: string, card: RightsCard) => void;
  
  // App settings
  settings: {
    autoSave: boolean;
    cloudSync: boolean;
    notifications: boolean;
    darkMode: boolean;
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Language and location
      language: 'en',
      setLanguage: (language) => set({ language }),
      selectedState: 'General',
      setSelectedState: (selectedState) => set({ selectedState }),
      
      // Recordings
      recordings: [],
      addRecording: (recording) => 
        set((state) => ({ recordings: [recording, ...state.recordings] })),
      removeRecording: (recordingId) =>
        set((state) => ({ 
          recordings: state.recordings.filter(r => r.recordingId !== recordingId) 
        })),
      updateRecording: (recordingId, updates) =>
        set((state) => ({
          recordings: state.recordings.map(r => 
            r.recordingId === recordingId ? { ...r, ...updates } : r
          )
        })),
      
      // UI state
      isRecording: false,
      setIsRecording: (isRecording) => set({ isRecording }),
      recordingType: null,
      setRecordingType: (recordingType) => set({ recordingType }),
      
      // Modals
      showRightsModal: false,
      setShowRightsModal: (showRightsModal) => set({ showRightsModal }),
      showSettingsModal: false,
      setShowSettingsModal: (showSettingsModal) => set({ showSettingsModal }),
      
      // Rights cards cache
      rightsCards: {},
      setRightsCard: (key, card) =>
        set((state) => ({ rightsCards: { ...state.rightsCards, [key]: card } })),
      
      // App settings
      settings: {
        autoSave: true,
        cloudSync: false,
        notifications: true,
        darkMode: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        })),
    }),
    {
      name: 'rightscard-storage',
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        selectedState: state.selectedState,
        recordings: state.recordings,
        rightsCards: state.rightsCards,
        settings: state.settings,
      }),
    }
  )
);
