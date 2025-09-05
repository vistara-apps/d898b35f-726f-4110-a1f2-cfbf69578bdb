'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Download, Share2, Trash2, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { InteractionRecording } from '@/lib/types';
import { formatDuration, formatTimestamp, formatFileSize, shareContent } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface RecordingViewerProps {
  recording: InteractionRecording | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecordingViewer({ recording, isOpen, onClose }: RecordingViewerProps) {
  const { t } = useTranslation();
  const { removeRecording } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null);

  useEffect(() => {
    if (!recording || !mediaRef.current) return;

    const media = mediaRef.current;
    
    const handleLoadedMetadata = () => {
      setDuration(media.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(media.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('ended', handleEnded);

    return () => {
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('ended', handleEnded);
    };
  }, [recording]);

  const togglePlayPause = () => {
    if (!mediaRef.current) return;

    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mediaRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    mediaRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mediaRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    mediaRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!mediaRef.current) return;
    
    if (isMuted) {
      mediaRef.current.volume = volume;
      setIsMuted(false);
    } else {
      mediaRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (!mediaRef.current) return;
    
    mediaRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skipTime = (seconds: number) => {
    if (!mediaRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    mediaRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDownload = () => {
    if (!recording) return;
    
    const link = document.createElement('a');
    link.href = recording.filePath;
    link.download = `recording-${recording.timestamp.toISOString().split('T')[0]}.${recording.filePath.includes('video') ? 'mp4' : 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started');
  };

  const handleShare = async () => {
    if (!recording) return;
    
    const shareData = {
      title: 'RightsCard Recording',
      text: `${recording.interactionType.replace('_', ' ')} interaction recorded on ${formatTimestamp(recording.timestamp)}${recording.aiSummary ? `\n\nSummary: ${recording.aiSummary}` : ''}`,
      url: window.location.href
    };
    
    const success = await shareContent(shareData);
    if (success) {
      toast.success('Recording shared successfully');
    } else {
      toast.error('Failed to share recording');
    }
  };

  const handleDelete = () => {
    if (!recording) return;
    
    if (confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      removeRecording(recording.recordingId);
      toast.success('Recording deleted');
      onClose();
    }
  };

  if (!recording) return null;

  const isVideo = recording.filePath.includes('video') || recording.filePath.includes('mp4');
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recording Details"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Recording Info */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white capitalize">
              {recording.interactionType.replace('_', ' ')} Recording
            </h3>
            <span className="text-sm text-white text-opacity-70">
              {formatTimestamp(recording.timestamp)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white text-opacity-70">Duration:</span>
              <span className="text-white ml-2">{formatDuration(recording.duration)}</span>
            </div>
            <div>
              <span className="text-white text-opacity-70">Location:</span>
              <span className="text-white ml-2">{recording.location || 'Not available'}</span>
            </div>
          </div>
          
          {recording.aiSummary && (
            <div className="mt-3 pt-3 border-t border-white border-opacity-20">
              <p className="text-white text-opacity-90 text-sm leading-relaxed">
                {recording.aiSummary}
              </p>
            </div>
          )}
        </div>

        {/* Media Player */}
        <div className="glass-card p-4">
          <div className="space-y-4">
            {/* Media Element */}
            {isVideo ? (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={recording.filePath}
                className="w-full rounded-lg"
                controls={false}
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <div className="text-center">
                  <Volume2 className="w-12 h-12 text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Audio Recording</p>
                </div>
              </div>
            )}
            
            <audio
              ref={!isVideo ? mediaRef as React.RefObject<HTMLAudioElement> : undefined}
              src={!isVideo ? recording.filePath : undefined}
              className="hidden"
            />

            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, rgba(255,255,255,0.2) ${progressPercentage}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white text-opacity-70">
                <span>{formatDuration(Math.floor(currentTime))}</span>
                <span>{formatDuration(Math.floor(duration))}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => skipTime(-10)}
                  className="p-2"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  onClick={togglePlayPause}
                  className="p-3"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => skipTime(10)}
                  className="p-2"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white text-opacity-70 hover:text-opacity-100"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                className="bg-white bg-opacity-10 text-white text-xs rounded px-2 py-1 border border-white border-opacity-20"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleDownload}
            variant="secondary"
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
          
          <Button
            onClick={handleShare}
            variant="secondary"
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
          
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
