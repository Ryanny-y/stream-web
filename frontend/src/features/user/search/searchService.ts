import { apiFetch } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api';
import type { SearchFilters, SearchVideo } from './types';

const unwrap = <T,>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const toSearchVideo = (video: any): SearchVideo => ({
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
  createdAt: video.createdAt,
  updatedAt: video.updatedAt,
  trending: video.trending,
});

export const searchVideos = async (query: string, _filters: SearchFilters): Promise<SearchVideo[]> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return getTrendingVideos();
  }

  const response = unwrap<any[]>(await apiFetch(`/public/videos/search?query=${encodeURIComponent(trimmedQuery)}`));
  return response.map(toSearchVideo);
};

export const getTrendingVideos = async (): Promise<SearchVideo[]> => {
  const response = unwrap<any[]>(await apiFetch('/public/videos/trending'));
  if (response.length > 0) {
    return response.map(toSearchVideo);
  }

  const fallback = unwrap<any[]>(await apiFetch('/public/videos'));
  return fallback.map(toSearchVideo);
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
