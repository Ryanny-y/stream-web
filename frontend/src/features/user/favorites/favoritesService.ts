import { apiFetch } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api';
import type { DashboardVideo } from '../dashboard/types';
import type { FavoriteItem } from './types';

const unwrap = <T,>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const toDashboardVideo = (video: any): DashboardVideo => ({
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
  watchedSeconds: null,
  progressPercentage: null,
  lastWatchedAt: null,
  addedAt: null,
});

export const getMyFavorites = async (): Promise<FavoriteItem[]> => {
  const response = unwrap<any[]>(await apiFetch('/user/favorites'));
  return response.map((item) => ({
    video: toDashboardVideo(item.video),
    addedAt: item.addedAt,
  }));
};

export const removeFromFavorites = async (videoId: string) => {
  await apiFetch(`/user/favorites/${videoId}`, { method: 'DELETE' });
};

export const addToFavorites = async (videoId: string): Promise<FavoriteItem> => {
  const item = unwrap<any>(await apiFetch(`/user/favorites/${videoId}`, { method: 'POST' }));
  return {
    video: toDashboardVideo(item.video),
    addedAt: item.addedAt,
  };
};

export const addToWatchlist = async (videoId: string) => {
  await apiFetch(`/user/watchlist/${videoId}`, { method: 'POST' });
};

export const removeFromWatchlist = async (videoId: string) => {
  await apiFetch(`/user/watchlist/${videoId}`, { method: 'DELETE' });
};

export const getMyWatchlistVideoIds = async (): Promise<Set<string>> => {
  const response = unwrap<any[]>(await apiFetch('/user/watchlist'));
  return new Set(response.map((item) => item.video?.videoId).filter(Boolean));
};

export const getRecommendedForFavorites = async (): Promise<DashboardVideo[]> => {
  const response = unwrap<any[]>(await apiFetch('/user/recommendations'));
  return response.map(toDashboardVideo);
};
