import type { DashboardVideo } from '../dashboard/types';

export interface WatchlistItem {
  video: DashboardVideo;
  addedAt: string;
}

export type WatchlistSort = 'RECENTLY_ADDED' | 'OLDEST_ADDED' | 'HIGHEST_RATED' | 'MOST_VIEWED';
