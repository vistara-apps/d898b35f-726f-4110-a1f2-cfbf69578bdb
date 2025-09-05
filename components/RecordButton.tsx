'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, Video, Square, Play } from 'lucide-react';
import { RecordingState } from '@/lib/types';
import { formatDuration, generateRecordingId } from '@/lib/utils';

interface RecordButtonProps {
  variant?: 'primary' | 'recording';
  onRecordingComplete?: (recordingData: {
    id: string;
    duration: number;
    type: 'audio' | 'video';
    blob: Blob;
  }) => void;
}

export function RecordButton({ variant = 'primary', onRecordingComplete }: RecordButtonProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    recordingType: 'audio',
  });
  const [duration, setDuration] = useState(0);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async (type: 'audio' | 'video') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'video' ? 'video/webm' : 'audio/webm',
        });

        if (onRecordingComplete) {
          onRecordingComplete({
            id: generateRecordingId(),
            duration,
            type,
            blob,
          });
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      setRecordingState({
        isRecording: true,
        recordingType: type,
        startTime: new Date(),
        mediaStream: stream,
      });

      setDuration(0);
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      setShowTypeSelector(false);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone/camera. Please check permissions.');
    }
  }, [duration, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setRecordingState({
        isRecording: false,
        recordingType: 'audio',
      });
    }
  }, [recordingState.isRecording]);

  if (recordingState.isRecording) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4 bg-red-500 bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-4">
          <div className="recording-pulse w-3 h-3 rounded-full"></div>
          <span className="text-white font-medium">
            Recording {recordingState.recordingType} - {formatDuration(duration)}
          </span>
          {recordingState.recordingType === 'video' ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </div>
        
        <button
          onClick={stopRecording}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Square className="w-6 h-6" />
        </button>
      </div>
    );
  }

  if (showTypeSelector) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => startRecording('audio')}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Mic className="w-5 h-5" />
            <span>Audio</span>
          </button>
          
          <button
            onClick={() => startRecording('video')}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Video className="w-5 h-5" />
            <span>Video</span>
          </button>
        </div>
        
        <button
          onClick={() => setShowTypeSelector(false)}
          className="text-white text-opacity-70 hover:text-opacity-100 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowTypeSelector(true)}
      className={`flex items-center space-x-3 px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
          : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white backdrop-blur-sm'
      }`}
    >
      <Play className="w-5 h-5" />
      <span>Record Interaction</span>
    </button>
  );
}
