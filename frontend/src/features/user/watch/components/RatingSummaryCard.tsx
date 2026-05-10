import React from 'react';
import { Star } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { RatingSummary } from '../types';
import { RatingStars } from './RatingStars';

interface RatingSummaryCardProps {
  summary: RatingSummary | null;
  isLoading: boolean;
  isSubmitting: boolean;
  onRate: (rating: number) => void;
}

export const RatingSummaryCard: React.FC<RatingSummaryCardProps> = ({
  summary,
  isLoading,
  isSubmitting,
  onRate,
}) => {
  if (isLoading) {
    return <Skeleton className="h-40 rounded-2xl bg-white/5" />;
  }

  const average = summary?.averageRating || 0;
  const count = summary?.totalRatings || 0;
  const userRating = summary?.userRating || 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{average.toFixed(1)}</span>
            <span className="pb-1 text-sm text-gray-400">/ 5</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{count} reviewer{count === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="space-y-2 md:text-right">
          <p className="text-sm font-medium text-white">Your rating</p>
          <RatingStars value={userRating} onChange={onRate} disabled={isSubmitting} size="lg" />
          <p className="text-xs text-gray-500">
            {userRating ? `You rated this ${userRating} out of 5.` : 'Select a star to rate this video.'}
          </p>
        </div>
      </div>
    </section>
  );
};
