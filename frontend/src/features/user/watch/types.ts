import type { DashboardVideo } from '../dashboard/types';

export interface VideoProgress {
  videoId: string;
  watchedSeconds: number;
  durationSeconds: number | null;
  progressPercentage: number;
  completed: boolean;
  lastWatchedAt: string | null;
}

export interface WatchPageResponse {
  video: DashboardVideo;
  progress: VideoProgress;
  suggestedVideos: DashboardVideo[];
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

export interface Comment {
  commentId: string;
  videoId: string;
  userId: string | null;
  username: string | null;
  profileImage: string | null;
  commentText: string;
  createdAt: string;
}
