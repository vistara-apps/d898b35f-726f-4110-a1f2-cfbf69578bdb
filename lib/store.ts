import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  InteractionRecording, 
  AppState, 
  EmergencyContact, 
  NotificationSettings,
  ShareableCardData 
} from './types';
import { detectUserState } from './utils';

interface AppStore extends AppState {
  // User actions
  setUser: (user: User | null) => void;
  updateUserState: (state: string) => void;
  updateUserLanguage: (language: string) => void;
  
  // Recording actions
  addRecording: (recording: InteractionRecording) => void;
  updateRecording: (id: string, updates: Partial<InteractionRecording>) => void;
  deleteRecording: (id: string) => void;
  clearRecordings: () => void;
  
  // App state actions
  setSelectedState: (state: string) => void;
  setSelectedLanguage: (language: string) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  
  // Emergency contacts
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: EmergencyContact) => void;
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => void;
  deleteEmergencyContact: (id: string) => void;
  
  // Notification settings
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  
  // Shareable cards
  shareableCards: ShareableCardData[];
  addShareableCard: (card: ShareableCardData) => void;
  deleteShareableCard: (id: string) => void;
  
  // App preferences
  preferences: {
    autoRecord: boolean;
    defaultRecordingType: 'audio' | 'video';
    enableLocationTracking: boolean;
    enableOfflineMode: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  updatePreferences: (prefs: Partial<AppStore['preferences']>) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      recordings: [],
      selectedState: detectUserState(),
      selectedLanguage: 'en',
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      
      emergencyContacts: [],
      
      notificationSettings: {
        enablePushNotifications: true,
        enableLocationAlerts: true,
        enableRecordingReminders: true,
      },
      
      shareableCards: [],
      
      preferences: {
        autoRecord: false,
        defaultRecordingType: 'audio',
        enableLocationTracking: true,
        enableOfflineMode: true,
        theme: 'system',
      },
      
      // User actions
      setUser: (user) => set({ user }),
      
      updateUserState: (state) => set((prev) => ({
        user: prev.user ? { ...prev.user, state } : null,
        selectedState: state,
      })),
      
      updateUserLanguage: (language) => set((prev) => ({
        user: prev.user ? { ...prev.user, languagePreference: language } : null,
        selectedLanguage: language,
      })),
      
      // Recording actions
      addRecording: (recording) => set((prev) => ({
        recordings: [recording, ...prev.recordings],
      })),
      
      updateRecording: (id, updates) => set((prev) => ({
        recordings: prev.recordings.map((recording) =>
          recording.recordingId === id ? { ...recording, ...updates } : recording
        ),
      })),
      
      deleteRecording: (id) => set((prev) => ({
        recordings: prev.recordings.filter((recording) => recording.recordingId !== id),
      })),
      
      clearRecordings: () => set({ recordings: [] }),
      
      // App state actions
      setSelectedState: (selectedState) => set({ selectedState }),
      setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
      setOnlineStatus: (isOnline) => set({ isOnline }),
      
      // Emergency contacts
      addEmergencyContact: (contact) => set((prev) => ({
        emergencyContacts: [...prev.emergencyContacts, contact],
      })),
      
      updateEmergencyContact: (id, updates) => set((prev) => ({
        emergencyContacts: prev.emergencyContacts.map((contact) =>
          contact.id === id ? { ...contact, ...updates } : contact
        ),
      })),
      
      deleteEmergencyContact: (id) => set((prev) => ({
        emergencyContacts: prev.emergencyContacts.filter((contact) => contact.id !== id),
      })),
      
      // Notification settings
      updateNotificationSettings: (settings) => set((prev) => ({
        notificationSettings: { ...prev.notificationSettings, ...settings },
      })),
      
      // Shareable cards
      addShareableCard: (card) => set((prev) => ({
        shareableCards: [card, ...prev.shareableCards],
      })),
      
      deleteShareableCard: (id) => set((prev) => ({
        shareableCards: prev.shareableCards.filter((card) => card.id !== id),
      })),
      
      // App preferences
      updatePreferences: (prefs) => set((prev) => ({
        preferences: { ...prev.preferences, ...prefs },
      })),
    }),
    {
      name: 'rightscard-storage',
      partialize: (state) => ({
        user: state.user,
        recordings: state.recordings,
        selectedState: state.selectedState,
        selectedLanguage: state.selectedLanguage,
        emergencyContacts: state.emergencyContacts,
        notificationSettings: state.notificationSettings,
        shareableCards: state.shareableCards,
        preferences: state.preferences,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useRecordings = () => useAppStore((state) => state.recordings);
export const useSelectedState = () => useAppStore((state) => state.selectedState);
export const useSelectedLanguage = () => useAppStore((state) => state.selectedLanguage);
export const useEmergencyContacts = () => useAppStore((state) => state.emergencyContacts);
export const useNotificationSettings = () => useAppStore((state) => state.notificationSettings);
export const usePreferences = () => useAppStore((state) => state.preferences);
