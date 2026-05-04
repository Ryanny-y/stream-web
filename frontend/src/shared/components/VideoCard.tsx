// Placement: shared/components — used in 3+ features (landing, browse, user dashboard, admin)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Star, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { VideoSummary } from '@/shared/types/api';

interface VideoCardProps {
  video: VideoSummary;
  /** Whether to show the Add to Watchlist button (not visible on public pages without auth) */
  showWatchlist?: boolean;
  className?: string;
}

/** Formats seconds into "Xh Ym" or "Xm" */
const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const VideoCard = ({ video, showWatchlist = false, className }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
        'bg-card border border-border',
        'hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:z-10',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {!imgError ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback gradient when image fails
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <Play className="text-muted-foreground w-10 h-10" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Link
            to={`/videos/${video.id}`}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch
          </Link>
          {showWatchlist && (
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              aria-label="Add to watchlist"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3" />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground truncate">{video.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{video.genre}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3 h-3 fill-yellow-400" />
            <span className="text-xs font-medium">{video.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
