import { createClient } from '@supabase/supabase-js';
import { InteractionRecording, User, ShareableCardData } from './types';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// IPFS/Pinata service
class IPFSService {
  private apiKey: string | undefined;
  private secretKey: string | undefined;

  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.secretKey = process.env.PINATA_SECRET_API_KEY;
  }

  async uploadFile(file: Blob, filename: string): Promise<string> {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('IPFS service not configured');
    }

    const formData = new FormData();
    formData.append('file', file, filename);

    const metadata = JSON.stringify({
      name: filename,
      keyvalues: {
        app: 'rightscard',
        type: 'recording'
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    const result = await response.json();
    return result.IpfsHash;
  }

  async uploadJSON(data: any, filename: string): Promise<string> {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('IPFS service not configured');
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: filename,
          keyvalues: {
            app: 'rightscard',
            type: 'shareable-card'
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload JSON to IPFS');
    }

    const result = await response.json();
    return result.IpfsHash;
  }

  getIPFSUrl(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
}

export const ipfsService = new IPFSService();

// Database service
class DatabaseService {
  async saveUser(user: User): Promise<User> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUser(userId: string): Promise<User | null> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async saveRecording(recording: InteractionRecording): Promise<InteractionRecording> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('recordings')
      .insert(recording)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserRecordings(userId: string): Promise<InteractionRecording[]> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateRecording(recordingId: string, updates: Partial<InteractionRecording>): Promise<InteractionRecording> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('recordings')
      .update(updates)
      .eq('recordingId', recordingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteRecording(recordingId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { error } = await supabase
      .from('recordings')
      .delete()
      .eq('recordingId', recordingId);

    if (error) throw error;
  }

  async saveShareableCard(card: ShareableCardData): Promise<ShareableCardData> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('shareable_cards')
      .insert(card)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getShareableCards(limit: number = 50): Promise<ShareableCardData[]> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('shareable_cards')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

export const databaseService = new DatabaseService();

// Notification service
class NotificationService {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return;
    }

    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      ...options,
    });
  }

  async scheduleRecordingReminder(delayMinutes: number = 30): Promise<void> {
    setTimeout(() => {
      this.showNotification('Recording Reminder', {
        body: 'Remember to start recording if you\'re in a police interaction',
        tag: 'recording-reminder',
      });
    }, delayMinutes * 60 * 1000);
  }
}

export const notificationService = new NotificationService();

// Location service
class LocationService {
  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      // Using a free geocoding service (you might want to use a more reliable one in production)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      return `${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision || data.countryName || 'Unknown'}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  async getLocationString(): Promise<string> {
    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      return await this.reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('Location service error:', error);
      return 'Location unavailable';
    }
  }
}

export const locationService = new LocationService();

// Analytics service (privacy-focused)
class AnalyticsService {
  private events: Array<{ event: string; timestamp: Date; data?: any }> = [];

  track(event: string, data?: any): void {
    // Only track non-sensitive events for app improvement
    const allowedEvents = [
      'app_opened',
      'rights_card_viewed',
      'recording_started',
      'recording_completed',
      'card_shared',
      'state_changed',
      'language_changed'
    ];

    if (allowedEvents.includes(event)) {
      this.events.push({
        event,
        timestamp: new Date(),
        data: data ? { ...data, sensitive: undefined } : undefined
      });

      // Keep only last 100 events to prevent memory issues
      if (this.events.length > 100) {
        this.events = this.events.slice(-100);
      }
    }
  }

  getEvents(): Array<{ event: string; timestamp: Date; data?: any }> {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

export const analyticsService = new AnalyticsService();
