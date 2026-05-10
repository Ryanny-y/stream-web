import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { DashboardVideo } from '../types';
import { formatDuration, resolveMediaUrl } from '../utils';
import { GenreChip } from './GenreChip';
import { ProgressBar } from './ProgressBar';

export const ContinueWatchingCard: React.FC<{ video: DashboardVideo }> = ({ video }) => (
  <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:-translate-y-1 hover:border-primary/40">
    <div className="relative aspect-video bg-zinc-900">
      {video.thumbnailPath ? (
        <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-zinc-900" />
      )}
      <div className="absolute left-3 top-3"><GenreChip genre={video.categories[0]} /></div>
    </div>
    <div className="space-y-3 p-4">
      <div>
        <h3 className="line-clamp-1 font-semibold text-white">{video.title}</h3>
        <p className="mt-1 text-xs text-gray-400">{formatDuration(video.durationSeconds)}</p>
      </div>
      <ProgressBar value={video.progressPercentage || 0} />
      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">
        <Play className="mr-2 h-3.5 w-3.5 fill-current" /> Resume
      </Button>
    </div>
  </article>
);
