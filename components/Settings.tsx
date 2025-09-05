'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { 
  Settings as SettingsIcon, 
  Globe, 
  MapPin, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  Phone,
  Plus,
  Edit,
  X
} from 'lucide-react';
import { 
  useAppStore, 
  useSelectedState, 
  useSelectedLanguage, 
  useNotificationSettings,
  usePreferences,
  useEmergencyContacts
} from '@/lib/store';
import { US_STATES, STATE_NAMES, LANGUAGES } from '@/lib/constants';
import { validatePhoneNumber, formatPhoneNumber } from '@/lib/utils';
import { EmergencyContact } from '@/lib/types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'contacts' | 'about'>('general');
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const selectedState = useSelectedState();
  const selectedLanguage = useSelectedLanguage();
  const notificationSettings = useNotificationSettings();
  const preferences = usePreferences();
  const emergencyContacts = useEmergencyContacts();

  const {
    setSelectedState,
    setSelectedLanguage,
    updateNotificationSettings,
    updatePreferences,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    clearRecordings
  } = useAppStore();

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'contacts', label: 'Emergency', icon: Phone },
    { id: 'about', label: 'About', icon: Globe }
  ] as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="flex h-96">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-white border-opacity-20 pr-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 bg-opacity-20 text-blue-300'
                    : 'text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6">
          {activeTab === 'general' && (
            <GeneralSettings
              selectedState={selectedState}
              selectedLanguage={selectedLanguage}
              preferences={preferences}
              onStateChange={setSelectedState}
              onLanguageChange={setSelectedLanguage}
              onPreferencesChange={updatePreferences}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacySettings
              notificationSettings={notificationSettings}
              preferences={preferences}
              onNotificationSettingsChange={updateNotificationSettings}
              onPreferencesChange={updatePreferences}
              onClearRecordings={clearRecordings}
            />
          )}

          {activeTab === 'contacts' && (
            <EmergencyContactsSettings
              contacts={emergencyContacts}
              onAddContact={() => setShowAddContact(true)}
              onEditContact={setEditingContact}
              onDeleteContact={deleteEmergencyContact}
            />
          )}

          {activeTab === 'about' && <AboutSettings />}
        </div>
      </div>

      {/* Add/Edit Contact Modal */}
      {(showAddContact || editingContact) && (
        <ContactModal
          contact={editingContact}
          onSave={(contact) => {
            if (editingContact) {
              updateEmergencyContact(editingContact.id, contact);
            } else {
              addEmergencyContact({
                ...contact,
                id: crypto.randomUUID()
              });
            }
            setShowAddContact(false);
            setEditingContact(null);
          }}
          onCancel={() => {
            setShowAddContact(false);
            setEditingContact(null);
          }}
        />
      )}
    </Modal>
  );
}

function GeneralSettings({
  selectedState,
  selectedLanguage,
  preferences,
  onStateChange,
  onLanguageChange,
  onPreferencesChange
}: {
  selectedState: string;
  selectedLanguage: string;
  preferences: any;
  onStateChange: (state: string) => void;
  onLanguageChange: (language: string) => void;
  onPreferencesChange: (prefs: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          State/Location
        </label>
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white"
        >
          {US_STATES.map((state) => (
            <option key={state} value={state} className="bg-gray-800">
              {STATE_NAMES[state]} ({state})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          <Globe className="w-4 h-4 inline mr-2" />
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white"
        >
          <option value="en" className="bg-gray-800">English</option>
          <option value="es" className="bg-gray-800">Español</option>
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Recording Preferences
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.autoRecord}
              onChange={(e) => onPreferencesChange({ autoRecord: e.target.checked })}
              className="rounded border-white border-opacity-20"
            />
            <span className="text-white text-sm">Auto-start recording in emergencies</span>
          </label>
          
          <div>
            <span className="text-white text-sm block mb-2">Default recording type:</span>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="recordingType"
                  value="audio"
                  checked={preferences.defaultRecordingType === 'audio'}
                  onChange={(e) => onPreferencesChange({ defaultRecordingType: 'audio' })}
                />
                <span className="text-white text-sm">Audio</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="recordingType"
                  value="video"
                  checked={preferences.defaultRecordingType === 'video'}
                  onChange={(e) => onPreferencesChange({ defaultRecordingType: 'video' })}
                />
                <span className="text-white text-sm">Video</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacySettings({
  notificationSettings,
  preferences,
  onNotificationSettingsChange,
  onPreferencesChange,
  onClearRecordings
}: {
  notificationSettings: any;
  preferences: any;
  onNotificationSettingsChange: (settings: any) => void;
  onPreferencesChange: (prefs: any) => void;
  onClearRecordings: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-3">
          <Bell className="w-4 h-4 inline mr-2" />
          Notifications
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationSettings.enablePushNotifications}
              onChange={(e) => onNotificationSettingsChange({ enablePushNotifications: e.target.checked })}
              className="rounded border-white border-opacity-20"
            />
            <span className="text-white text-sm">Push notifications</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationSettings.enableLocationAlerts}
              onChange={(e) => onNotificationSettingsChange({ enableLocationAlerts: e.target.checked })}
              className="rounded border-white border-opacity-20"
            />
            <span className="text-white text-sm">Location-based alerts</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationSettings.enableRecordingReminders}
              onChange={(e) => onNotificationSettingsChange({ enableRecordingReminders: e.target.checked })}
              className="rounded border-white border-opacity-20"
            />
            <span className="text-white text-sm">Recording reminders</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Privacy Options
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.enableLocationTracking}
              onChange={(e) => onPreferencesChange({ enableLocationTracking: e.target.checked })}
              className="rounded border-white border-opacity-20"
            />
            <span className="text-white text-sm">Enable location tracking</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.enableOfflineMode}
              onChange={(e) => onPreferencesChange({ enableOfflineMode: e.target.checked })}
              className="rounded border-white border-opacity-20"
            />
            <span className="text-white text-sm">Enable offline mode</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Data Management
        </label>
        <Button
          variant="destructive"
          size="sm"
          onClick={onClearRecordings}
          className="flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Recordings</span>
        </Button>
        <p className="text-white text-opacity-60 text-xs mt-2">
          This will permanently delete all local recordings. This action cannot be undone.
        </p>
      </div>
    </div>
  );
}

function EmergencyContactsSettings({
  contacts,
  onAddContact,
  onEditContact,
  onDeleteContact
}: {
  contacts: EmergencyContact[];
  onAddContact: () => void;
  onEditContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Emergency Contacts</h3>
        <Button size="sm" onClick={onAddContact} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-8">
          <Phone className="w-12 h-12 text-white text-opacity-40 mx-auto mb-3" />
          <p className="text-white text-opacity-60 text-sm">No emergency contacts added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="glass-card p-3 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{contact.name}</p>
                <p className="text-white text-opacity-70 text-sm">{contact.phone}</p>
                <p className="text-white text-opacity-50 text-xs">
                  {contact.relationship} {contact.isLawyer && '• Lawyer'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditContact(contact)}
                  className="p-1 text-white text-opacity-60 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteContact(contact.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-medium mb-2">RightsCard</h3>
        <p className="text-white text-opacity-70 text-sm mb-4">
          Your pocket legal defense companion. Know your rights, stay protected.
        </p>
        <p className="text-white text-opacity-50 text-xs">Version 1.0.0</p>
      </div>

      <div>
        <h4 className="text-white text-sm font-medium mb-2">Legal Disclaimer</h4>
        <p className="text-white text-opacity-60 text-xs leading-relaxed">
          RightsCard provides general legal information and should not replace professional legal advice. 
          Always consult with a qualified attorney for specific legal matters. The information provided 
          is for educational purposes only and may not reflect the most current legal developments.
        </p>
      </div>

      <div>
        <h4 className="text-white text-sm font-medium mb-2">Privacy</h4>
        <p className="text-white text-opacity-60 text-xs leading-relaxed">
          Your recordings and personal data are stored locally on your device by default. 
          Optional cloud storage requires explicit consent and uses encrypted, decentralized storage.
        </p>
      </div>

      <div>
        <h4 className="text-white text-sm font-medium mb-2">Support</h4>
        <p className="text-white text-opacity-60 text-xs">
          For support or feedback, visit our website or contact us through the app.
        </p>
      </div>
    </div>
  );
}

function ContactModal({
  contact,
  onSave,
  onCancel
}: {
  contact: EmergencyContact | null;
  onSave: (contact: Omit<EmergencyContact, 'id'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    phone: contact?.phone || '',
    relationship: contact?.relationship || '',
    isLawyer: contact?.isLawyer || false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        phone: formatPhoneNumber(formData.phone)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">
            {contact ? 'Edit Contact' : 'Add Emergency Contact'}
          </h3>
          <button onClick={onCancel} className="text-white text-opacity-60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white"
              placeholder="Contact name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white"
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">Relationship</label>
            <input
              type="text"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white"
              placeholder="e.g., Family, Friend, Colleague"
            />
            {errors.relationship && <p className="text-red-400 text-xs mt-1">{errors.relationship}</p>}
          </div>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.isLawyer}
              onChange={(e) => setFormData({ ...formData, isLawyer: e.target.checked })}
              className="rounded border-white border-opacity-20"
            />
            <span className="text-white text-sm">This person is a lawyer</span>
          </label>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {contact ? 'Update' : 'Add'} Contact
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
