import React from 'react';
import {
  Captions,
  Maximize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  speed: number;
  onPlayPause: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onMute: () => void;
  onSpeedChange: (value: number) => void;
  onFullscreen: () => void;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return hours
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    : `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  speed,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMute,
  onSpeedChange,
  onFullscreen,
}) => {
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 opacity-100 transition-opacity">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(event) => onSeek(Number(event.target.value))}
        className="w-full accent-primary"
        aria-label="Seek video"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button type="button" size="icon" variant="ghost" onClick={onPlayPause} className="text-white hover:bg-white/10">
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          </Button>
          <span className="min-w-[92px] text-xs text-gray-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <Button type="button" size="icon" variant="ghost" onClick={onMute} className="text-white hover:bg-white/10">
            <VolumeIcon className="h-5 w-5" />
          </Button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="w-20 accent-primary"
            aria-label="Volume"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="icon" variant="ghost" className="text-white hover:bg-white/10" aria-label="Captions">
            <Captions className="h-5 w-5" />
          </Button>
          <select
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="h-9 rounded-md border border-white/10 bg-black/60 px-2 text-sm text-white"
            aria-label="Playback speed"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
              <option key={value} value={value}>{value}x</option>
            ))}
          </select>
          <Button type="button" size="icon" variant="ghost" onClick={onFullscreen} className="text-white hover:bg-white/10">
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
