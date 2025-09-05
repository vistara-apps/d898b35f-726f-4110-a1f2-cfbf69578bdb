'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, MapPin, Save, Bell, Moon, Cloud, HardDrive } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { useAppStore } from '@/lib/store';
import { US_STATES } from '@/lib/constants';
import toast from 'react-hot-toast';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { t, i18n } = useTranslation();
  const {
    language,
    setLanguage,
    selectedState,
    setSelectedState,
    settings,
    updateSettings,
  } = useAppStore();

  const [localSettings, setLocalSettings] = useState(settings);
  const [localLanguage, setLocalLanguage] = useState(language);
  const [localState, setLocalState] = useState(selectedState);

  const handleSave = () => {
    // Update language
    if (localLanguage !== language) {
      setLanguage(localLanguage);
      i18n.changeLanguage(localLanguage);
    }

    // Update state
    if (localState !== selectedState) {
      setSelectedState(localState);
    }

    // Update settings
    updateSettings(localSettings);

    toast.success(t('settingsSaved'));
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setLocalLanguage(language);
    setLocalState(selectedState);
  };

  const toggleSetting = (key: keyof typeof localSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings')}
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* Language Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-medium">{t('language')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLocalLanguage('en')}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                localLanguage === 'en'
                  ? 'border-blue-400 bg-blue-400 bg-opacity-20 text-white'
                  : 'border-white border-opacity-20 text-white text-opacity-70 hover:text-opacity-100'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLocalLanguage('es')}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                localLanguage === 'es'
                  ? 'border-blue-400 bg-blue-400 bg-opacity-20 text-white'
                  : 'border-white border-opacity-20 text-white text-opacity-70 hover:text-opacity-100'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* State Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-medium">{t('state')}</h3>
          </div>
          <select
            value={localState}
            onChange={(e) => setLocalState(e.target.value)}
            className="w-full p-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white focus:outline-none focus:border-blue-400 focus:bg-opacity-20"
          >
            <option value="General" className="bg-gray-800 text-white">General (All States)</option>
            {US_STATES.map(state => (
              <option key={state} value={state} className="bg-gray-800 text-white">
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* App Settings */}
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <span>App Settings</span>
          </h3>
          
          <div className="space-y-3">
            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HardDrive className="w-4 h-4 text-white text-opacity-70" />
                <span className="text-white text-opacity-90">{t('autoSave')}</span>
              </div>
              <button
                onClick={() => toggleSetting('autoSave')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Cloud Sync */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cloud className="w-4 h-4 text-white text-opacity-70" />
                <span className="text-white text-opacity-90">{t('cloudSync')}</span>
              </div>
              <button
                onClick={() => toggleSetting('cloudSync')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.cloudSync ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.cloudSync ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-white text-opacity-70" />
                <span className="text-white text-opacity-90">{t('notifications')}</span>
              </div>
              <button
                onClick={() => toggleSetting('notifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-4 h-4 text-white text-opacity-70" />
                <span className="text-white text-opacity-90">{t('darkMode')}</span>
              </div>
              <button
                onClick={() => toggleSetting('darkMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.darkMode ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-white border-opacity-20">
          <Button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </Modal>
  );
}
