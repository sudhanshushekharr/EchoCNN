"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { Badge } from "~/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw,
  Download
} from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  fileName: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onSeek?: (time: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

const AudioPlayer = ({ 
  audioUrl, 
  fileName, 
  onTimeUpdate, 
  onSeek,
  onPlayStateChange,
  className = "" 
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioInfo, setAudioInfo] = useState<{
    format?: string;
    bitrate?: number;
    sampleRate?: number;
  }>({});

  // Format time in MM:SS format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
       void audioRef.current.play();
      }
    }
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (audioRef.current && newTime !== undefined) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      onSeek?.(newTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (newVolume !== undefined) {
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      onSeek?.(newTime);
      // Force immediate update
      onTimeUpdate?.(newTime, duration);
    }
  };

  // Download audio file
  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      // Try to extract audio info
      setAudioInfo({
        format: fileName.split('.').pop()?.toUpperCase(),
        // sampleRate: audio.sampleRate || undefined, // Remove this line
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate, fileName, onPlayStateChange]);

  // Use setInterval for more frequent updates when playing
  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;

    const intervalId = setInterval(() => {
      if (audioRef.current && isPlaying) {
        const audio = audioRef.current;
        const newTime = audio.currentTime;
        setCurrentTime(newTime);
        onTimeUpdate?.(newTime, audio.duration);
      }
    }, 50); // Update every 50ms for smooth progress

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, onTimeUpdate]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Audio Player</span>
          <Badge variant="secondary" className="text-xs">
            {audioInfo.format ?? 'WAV'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio element (hidden) */}
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        {/* File info */}
        <div className="text-sm text-stone-600">
          <p className="font-medium">{fileName}</p>
          {audioInfo.sampleRate && (
            <p className="text-xs">{audioInfo.sampleRate}Hz</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-stone-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => skip(-10)}
              title="Skip backward 10s"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={togglePlayPause}
              className="w-12 h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => skip(10)}
              title="Skip forward 10s"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAudio}
              title="Download audio file"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer; 