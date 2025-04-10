import React, { useState, useEffect } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { speakTextWithCache } from '@/utils/localSpeechAPI';

interface AudioPlaybackProps {
  text: string;
  stage: 'memorize' | 'partial' | 'complete';
  className?: string;
  autoPlay?: boolean;
}

const AudioPlayback: React.FC<AudioPlaybackProps> = ({ 
  text, 
  stage, 
  className = '',
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // Select voice based on stage
  const getVoiceForStage = (): 'default' | 'female' | 'male' => {
    switch (stage) {
      case 'memorize':
        return 'default';
      case 'partial':
        return 'female';
      case 'complete':
        return 'male';
      default:
        return 'default';
    }
  };

  const playAudio = async () => {
    if (isPlaying || !text) return;
    
    setIsPlaying(true);
    
    try {
      await speakTextWithCache(text, getVoiceForStage());
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  // Handle automatic playback when component mounts
  useEffect(() => {
    if (autoPlay && text && !hasAutoPlayed) {
      playAudio();
      setHasAutoPlayed(true);
    }
  }, [autoPlay, text, hasAutoPlayed]);

  return (
    <button
      onClick={playAudio}
      disabled={isPlaying || !text}
      className={`rounded-full p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors ${className}`}
      aria-label="Play pronunciation"
      title="Play pronunciation"
    >
      {isPlaying ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Volume2 size={16} />
      )}
    </button>
  );
};

export default AudioPlayback;
