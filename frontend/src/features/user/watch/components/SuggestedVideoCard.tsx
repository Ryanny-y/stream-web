import React from 'react';
import { Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import type { DashboardVideo } from '../../dashboard/types';
import { formatDuration, resolveMediaUrl } from '../../dashboard/utils';
import { GenreChip } from '../../dashboard/components/GenreChip';

export const SuggestedVideoCard: React.FC<{ video: DashboardVideo }> = ({ video }) => (
  <article className="group flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08]">
    <Link to={`/watch/${video.videoId}`} className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
      {video.thumbnailPath && (
        <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
      )}
      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
        {formatDuration(video.durationSeconds)}
      </div>
    </Link>
    <div className="min-w-0 flex-1 space-y-2">
      <GenreChip genre={video.categories[0]} />
      <h3 className="line-clamp-2 font-semibold text-white">{video.title}</h3>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1 text-amber-400">
          <Star className="h-3 w-3 fill-current" /> {(video.rating || 0).toFixed(1)}
        </span>
      </div>
      <Button asChild size="sm" className="h-8 bg-primary hover:bg-primary/90 text-white">
        <Link to={`/watch/${video.videoId}`}>
          <Play className="mr-2 h-3.5 w-3.5 fill-current" /> Watch
        </Link>
      </Button>
    </div>
  </article>
);
