import React from 'react';
import { BookmarkPlus, Heart, Play, RotateCcw, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import type { HistoryVideo } from '../types';
import { GenreChip } from '../../dashboard/components/GenreChip';
import { ProgressBar } from '../../dashboard/components/ProgressBar';
import { formatDate, formatDuration, resolveMediaUrl } from '../../dashboard/utils';

interface HistoryVideoCardProps {
  video: HistoryVideo;
  onRemove: (videoId: string) => void;
  onWatchlist: (videoId: string) => void;
  onFavorite: (videoId: string) => void;
  isInWatchlist: boolean;
  isFavorite: boolean;
}

export const HistoryVideoCard: React.FC<HistoryVideoCardProps> = ({
  video,
  onRemove,
  onWatchlist,
  onFavorite,
  isInWatchlist,
  isFavorite,
}) => (
  <article className="group grid gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-all hover:border-primary/40 hover:bg-white/[0.07] md:grid-cols-[260px_1fr]">
    <Link to={`/watch/${video.videoId}`} className="relative aspect-video overflow-hidden rounded-lg bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary">
      {video.thumbnailPath ? (
        <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-zinc-900" />
      )}
      <div className="absolute left-3 top-3"><GenreChip genre={video.categories[0]} /></div>
    </Link>

    <div className="flex min-w-0 flex-col justify-between gap-4 p-1">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Link to={`/watch/${video.videoId}`} className="line-clamp-1 text-lg font-bold text-white hover:text-primary">
              {video.title}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span>{formatDuration(video.durationSeconds)}</span>
              <span>Watched {formatDate(video.lastWatchedAt)}</span>
              <span className="inline-flex items-center gap-1 text-amber-400">
                <Star className="h-3 w-3 fill-current" /> {(video.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>
          <div className="text-sm font-semibold text-primary">{Math.round(video.progressPercentage || 0)}%</div>
        </div>

        <ProgressBar value={video.progressPercentage || 0} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
          <Link to={`/watch/${video.videoId}`}>
            <Play className="mr-2 h-3.5 w-3.5 fill-current" /> Resume
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Link to={`/watch/${video.videoId}?restart=1`}>
            <RotateCcw className="mr-2 h-3.5 w-3.5" /> Rewatch
          </Link>
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className={`h-9 w-9 border-white/10 ${
            isInWatchlist ? 'bg-primary/15 text-primary hover:bg-primary/20' : 'bg-white/5 text-gray-300 hover:text-white'
          }`}
          onClick={() => onWatchlist(video.videoId)}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          aria-pressed={isInWatchlist}
        >
          <BookmarkPlus className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className={`h-9 w-9 border-white/10 ${
            isFavorite ? 'bg-primary/15 text-primary hover:bg-primary/20' : 'bg-white/5 text-gray-300 hover:text-white'
          }`}
          onClick={() => onFavorite(video.videoId)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 border-white/10 bg-white/5 text-rose-300 hover:text-rose-200"
          onClick={() => onRemove(video.videoId)}
          aria-label="Remove from history"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </article>
);
