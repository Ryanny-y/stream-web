import React from 'react';
import { BookmarkPlus, Play, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import type { DashboardVideo } from '../types';
import { formatCompact, formatDuration, resolveMediaUrl } from '../utils';
import { GenreChip } from './GenreChip';

interface VideoCardProps {
  video: DashboardVideo;
  variant?: 'default' | 'watchlist' | 'trending';
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, variant = 'default' }) => {
  const genre = video.categories[0];

  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.07]">
      <Link to={`/watch/${video.videoId}`} className="relative block aspect-video bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary">
        {video.thumbnailPath ? (
          <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3"><GenreChip genre={genre} /></div>
        <Button size="icon" className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-primary text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </Button>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <Link to={`/watch/${video.videoId}`} className="line-clamp-1 font-semibold text-white hover:text-primary focus:outline-none focus:text-primary">
            {video.title}
          </Link>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
            <span>{formatDuration(video.durationSeconds)}</span>
            {variant === 'trending' && <span>{formatCompact(video.totalViews)} views</span>}
            <span className="inline-flex items-center gap-1 text-amber-400">
              <Star className="h-3 w-3 fill-current" /> {(video.rating || 0).toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-white">
            <Link to={`/watch/${video.videoId}`}>
              <Play className="mr-2 h-3.5 w-3.5 fill-current" /> Watch
            </Link>
          </Button>
          <Button size="icon" variant="outline" className="h-9 w-9 border-white/10 bg-white/5 text-gray-300 hover:text-white">
            {variant === 'watchlist' ? <Trash2 className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </article>
  );
};
