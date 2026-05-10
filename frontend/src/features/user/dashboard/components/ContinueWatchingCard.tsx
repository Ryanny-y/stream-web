import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import type { DashboardVideo } from '../types';
import { formatDuration, resolveMediaUrl } from '../utils';
import { GenreChip } from './GenreChip';
import { ProgressBar } from './ProgressBar';

export const ContinueWatchingCard: React.FC<{ video: DashboardVideo }> = ({ video }) => (
  <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:-translate-y-1 hover:border-primary/40">
    <Link to={`/watch/${video.videoId}`} className="relative block aspect-video bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary">
      {video.thumbnailPath ? (
        <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-zinc-900" />
      )}
      <div className="absolute left-3 top-3"><GenreChip genre={video.categories[0]} /></div>
    </Link>
    <div className="space-y-3 p-4">
      <div>
        <Link to={`/watch/${video.videoId}`} className="line-clamp-1 font-semibold text-white hover:text-primary focus:outline-none focus:text-primary">
          {video.title}
        </Link>
        <p className="mt-1 text-xs text-gray-400">{formatDuration(video.durationSeconds)}</p>
      </div>
      <ProgressBar value={video.progressPercentage || 0} />
      <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">
        <Link to={`/watch/${video.videoId}`}>
          <Play className="mr-2 h-3.5 w-3.5 fill-current" /> Resume
        </Link>
      </Button>
    </div>
  </article>
);
