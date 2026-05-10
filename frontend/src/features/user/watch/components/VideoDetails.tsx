import React from 'react';
import { Flag, Heart, ListPlus, Share2, Star } from 'lucide-react';
import type { DashboardVideo } from '../../dashboard/types';
import { formatCompact, formatDate, formatDuration } from '../../dashboard/utils';
import { GenreChip } from '../../dashboard/components/GenreChip';
import { ActionButton } from './ActionButton';

interface VideoDetailsProps {
  video: DashboardVideo;
  onAddWatchlist: () => void;
  onAddFavorite: () => void;
  onShare: () => void;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({
  video,
  onAddWatchlist,
  onAddFavorite,
  onShare,
}) => (
  <section className="space-y-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl font-black tracking-tight text-white">{video.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
          <span>{formatDuration(video.durationSeconds)}</span>
          <span>{formatCompact(video.totalViews)} views</span>
          <span className="inline-flex items-center gap-1 text-amber-400">
            <Star className="h-4 w-4 fill-current" /> {(video.rating || 0).toFixed(1)}
          </span>
          <span>Uploaded {formatDate(video.addedAt || video.lastWatchedAt)}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionButton icon={ListPlus} label="Watchlist" onClick={onAddWatchlist} />
        <ActionButton icon={Heart} label="Favorite" onClick={onAddFavorite} />
        <ActionButton icon={Share2} label="Share" onClick={onShare} />
        <ActionButton icon={Flag} label="Report" />
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {video.categories.length ? video.categories.map((category) => <GenreChip key={category} genre={category} />) : <GenreChip />}
    </div>

    <p className="max-w-4xl text-sm leading-6 text-gray-300">
      {video.description || 'No description has been added for this video yet.'}
    </p>
  </section>
);
