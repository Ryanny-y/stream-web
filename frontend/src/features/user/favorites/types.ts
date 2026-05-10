import type { DashboardVideo } from '../dashboard/types';

export interface FavoriteItem {
  video: DashboardVideo;
  addedAt: string;
}

export type FavoriteSort = 'RECENTLY_ADDED' | 'OLDEST_ADDED' | 'HIGHEST_RATED' | 'MOST_VIEWED';
