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
