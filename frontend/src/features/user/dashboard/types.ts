export interface DashboardVideo {
  videoId: string;
  title: string;
  description: string | null;
  slug: string | null;
  filePath: string | null;
  thumbnailPath: string | null;
  durationSeconds: number | null;
  totalViews: number | null;
  rating: number | null;
  categories: string[];
  watchedSeconds: number | null;
  progressPercentage: number | null;
  lastWatchedAt: string | null;
  addedAt: string | null;
}

export interface UserDashboardResponse {
  featuredVideo: DashboardVideo | null;
  continueWatching: DashboardVideo[];
  recommendedVideos: DashboardVideo[];
  watchHistory: DashboardVideo[];
  watchlist: DashboardVideo[];
  trendingVideos: DashboardVideo[];
}
