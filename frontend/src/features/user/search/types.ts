import type { DashboardVideo } from '../dashboard/types';

export type SearchSort = 'RELEVANCE' | 'NEWEST' | 'MOST_VIEWED' | 'HIGHEST_RATED';
export type RatingFilter = 'ALL' | '4' | '3' | '2';
export type DurationFilter = 'ALL' | 'SHORT' | 'MEDIUM' | 'LONG';

export interface SearchFilters {
  category: string;
  rating: RatingFilter;
  duration: DurationFilter;
  sort: SearchSort;
}

export type SearchVideo = DashboardVideo & {
  createdAt?: string | null;
  updatedAt?: string | null;
  trending?: boolean | null;
};
