import { apiFetch } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api';
import type { HistoryVideo } from './types';

const unwrap = <T,>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const toHistoryVideo = (video: any): HistoryVideo => ({
  videoId: video.videoId,
  title: video.title,
  description: video.description,
  slug: video.slug,
  filePath: video.filePath,
  thumbnailPath: video.thumbnailPath,
  durationSeconds: video.durationSeconds,
  totalViews: video.totalViews,
  rating: video.rating ?? 0,
  categories: video.categories || [],
  watchedSeconds: video.watchedSeconds ?? 0,
  progressPercentage: video.progressPercentage ?? 0,
  lastWatchedAt: video.lastWatchedAt,
  addedAt: video.addedAt,
});

export const getMyWatchHistory = async (): Promise<HistoryVideo[]> => {
  const response = unwrap<any[]>(await apiFetch('/user/history'));
  return response.map(toHistoryVideo);
};

export const removeFromWatchHistory = async (videoId: string) => {
  await apiFetch(`/user/history/${videoId}`, { method: 'DELETE' });
};

export const clearWatchHistory = async () => {
  await apiFetch('/user/history', { method: 'DELETE' });
};

export const addToWatchlist = async (videoId: string) => {
  await apiFetch(`/user/watchlist/${videoId}`, { method: 'POST' });
};

export const removeFromWatchlist = async (videoId: string) => {
  await apiFetch(`/user/watchlist/${videoId}`, { method: 'DELETE' });
};

export const addToFavorites = async (videoId: string) => {
  await apiFetch(`/user/favorites/${videoId}`, { method: 'POST' });
};

export const removeFromFavorites = async (videoId: string) => {
  await apiFetch(`/user/favorites/${videoId}`, { method: 'DELETE' });
};

export const getMyWatchlistVideoIds = async (): Promise<Set<string>> => {
  const response = unwrap<any[]>(await apiFetch('/user/watchlist'));
  return new Set(response.map((item) => item.video?.videoId).filter(Boolean));
};

export const getMyFavoriteVideoIds = async (): Promise<Set<string>> => {
  const response = unwrap<any[]>(await apiFetch('/user/favorites'));
  return new Set(response.map((item) => item.video?.videoId).filter(Boolean));
};
