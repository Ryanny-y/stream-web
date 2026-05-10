import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { resolveMediaUrl } from '../../dashboard/utils';
import { PlayerControls } from './PlayerControls';

interface VideoPlayerProps {
  filePath: string | null;
  posterPath: string | null;
  resumeSeconds: number;
  onTimeUpdate: (seconds: number, duration: number) => void;
  onPlaybackError: () => void;
}

export const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  filePath,
  posterPath,
  resumeSeconds,
  onTimeUpdate,
  onPlaybackError,
}, ref) => {
  const localRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [error, setError] = React.useState(false);

  React.useImperativeHandle(ref, () => localRef.current as HTMLVideoElement);

  const setVideoRef = (node: HTMLVideoElement | null) => {
    localRef.current = node;
  };

  const seekToResume = () => {
    const video = localRef.current;
    if (!video || !resumeSeconds || video.duration <= resumeSeconds) return;
    video.currentTime = resumeSeconds;
    setCurrentTime(resumeSeconds);
  };

  const playPause = () => {
    const video = localRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setError(true));
    } else {
      video.pause();
    }
  };

  const seek = (value: number) => {
    const video = localRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const changeVolume = (value: number) => {
    const video = localRef.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    const video = localRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changeSpeed = (value: number) => {
    const video = localRef.current;
    if (!video) return;
    video.playbackRate = value;
    setSpeed(value);
  };

  const fullscreen = () => {
    localRef.current?.parentElement?.requestFullscreen?.();
  };

  if (!filePath) {
    return (
      <div className="aspect-video rounded-2xl border border-white/10 bg-zinc-900 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="mb-3 h-10 w-10 text-amber-400" />
        <h2 className="text-xl font-bold text-white">Video unavailable</h2>
        <p className="mt-1 text-sm text-gray-400">No playable file is attached to this video.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
      <video
        ref={setVideoRef}
        className="aspect-video w-full bg-black"
        src={resolveMediaUrl(filePath)}
        poster={resolveMediaUrl(posterPath)}
        playsInline
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
          seekToResume();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setCurrentTime(video.currentTime);
          setDuration(video.duration || 0);
          onTimeUpdate(video.currentTime, video.duration || 0);
        }}
        onError={() => {
          setError(true);
          onPlaybackError();
        }}
      />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center">
          <AlertTriangle className="mb-3 h-10 w-10 text-rose-400" />
          <h2 className="text-xl font-bold text-white">Playback error</h2>
          <p className="mt-1 text-sm text-gray-400">The video could not be played.</p>
          <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={() => setError(false)}>
            <RotateCcw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      )}
      <PlayerControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        speed={speed}
        onPlayPause={playPause}
        onSeek={seek}
        onVolumeChange={changeVolume}
        onMute={toggleMute}
        onSpeedChange={changeSpeed}
        onFullscreen={fullscreen}
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
