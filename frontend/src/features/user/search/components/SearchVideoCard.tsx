import React from 'react';
import { BookmarkPlus, Heart, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { GenreChip } from '../../dashboard/components/GenreChip';
import { formatCompact, formatDuration, resolveMediaUrl } from '../../dashboard/utils';
import type { SearchVideo } from '../types';

interface SearchVideoCardProps {
  video: SearchVideo;
  onWatchlist: (videoId: string) => void;
  onFavorite: (videoId: string) => void;
  isInWatchlist: boolean;
  isFavorite: boolean;
}

export const SearchVideoCard: React.FC<SearchVideoCardProps> = ({
  video,
  onWatchlist,
  onFavorite,
  isInWatchlist,
  isFavorite,
}) => (
  <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.07]">
    <Link to={`/watch/${video.videoId}`} className="relative block aspect-video bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary">
      {video.thumbnailPath ? (
        <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-zinc-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
      <div className="absolute left-3 top-3"><GenreChip genre={video.categories[0]} /></div>
    </Link>

    <div className="space-y-3 p-4">
      <div>
        <Link to={`/watch/${video.videoId}`} className="line-clamp-1 font-semibold text-white hover:text-primary">
          {video.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span>{formatDuration(video.durationSeconds)}</span>
          <span>{formatCompact(video.totalViews)} views</span>
          <span className="inline-flex items-center gap-1 text-amber-400">
            <Star className="h-3 w-3 fill-current" /> {(video.rating || 0).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="flex-1 bg-primary text-white hover:bg-primary/90">
          <Link to={`/watch/${video.videoId}`}>
            <Play className="mr-2 h-3.5 w-3.5 fill-current" /> Watch Now
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
      </div>
    </div>
  </article>
);
