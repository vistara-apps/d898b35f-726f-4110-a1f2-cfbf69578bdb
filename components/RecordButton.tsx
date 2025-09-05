'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, Video, Square, Play } from 'lucide-react';
import { RecordingState } from '@/lib/types';
import { formatDuration } from '@/lib/utils';

interface RecordButtonProps {
  variant?: 'primary' | 'recording';
  onRecordingComplete?: (blob: Blob, duration: number, type: 'audio' | 'video') => void;
}

export function RecordButton({ variant = 'primary', onRecordingComplete }: RecordButtonProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    recordingType: null,
    startTime: null,
    mediaRecorder: null,
    stream: null
  });
  
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async (type: 'audio' | 'video') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mediaRecorder = new MediaRecorder(stream);
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });
        
        if (onRecordingComplete) {
          onRecordingComplete(blob, duration, type);
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setRecordingState({
          isRecording: false,
          recordingType: null,
          startTime: null,
          mediaRecorder: null,
          stream: null
        });
        setDuration(0);
      };
      
      mediaRecorder.start();
      
      const startTime = new Date();
      setRecordingState({
        isRecording: true,
        recordingType: type,
        startTime,
        mediaRecorder,
        stream
      });
      
      // Start duration counter
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone/camera. Please check permissions.');
    }
  }, [duration, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (recordingState.mediaRecorder && recordingState.isRecording) {
      recordingState.mediaRecorder.stop();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [recordingState]);

  if (recordingState.isRecording) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4 glass-card p-4 rounded-full">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full recording-pulse" />
            <span className="text-white font-medium">
              {recordingState.recordingType === 'video' ? 'Recording Video' : 'Recording Audio'}
            </span>
          </div>
          <span className="text-white text-sm font-mono">
            {formatDuration(duration)}
          </span>
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

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={() => startRecording('audio')}
          className="btn-primary flex items-center space-x-2"
        >
          <Mic className="w-5 h-5" />
          <span>Record Audio</span>
        </button>
        
        <button
          onClick={() => startRecording('video')}
          className="btn-secondary flex items-center space-x-2"
        >
          <Video className="w-5 h-5" />
          <span>Record Video</span>
        </button>
      </div>
      
      <p className="text-white text-opacity-70 text-sm text-center max-w-xs">
        Tap to start recording your interaction. Recording will be saved locally and can be shared.
      </p>
    </div>
  );
}
