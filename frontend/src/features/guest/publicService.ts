import { apiFetch, resolveMediaUrl } from '@/shared/lib/api';
import type {
  ApiResponse,
  Category,
  PublicCategoryResponse,
  PublicVideoResponse,
  VideoSummary,
} from '@/shared/types/api';

const fallbackThumbnail =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=80';

const unwrap = <T,>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

export const toVideoSummary = (video: PublicVideoResponse): VideoSummary => {
  const categories = video.categories ?? [];
  return {
    id: video.videoId,
    videoId: video.videoId,
    title: video.title,
    description: video.description ?? '',
    thumbnailUrl: resolveMediaUrl(video.thumbnailPath) ?? fallbackThumbnail,
    thumbnailPath: video.thumbnailPath,
    filePath: video.filePath,
    duration: video.durationSeconds ?? 0,
    durationSeconds: video.durationSeconds,
    genre: categories[0] ?? 'Uncategorized',
    categories,
    rating: 0,
    releaseDate: video.releaseDate ?? video.createdAt ?? '',
    viewCount: video.totalViews ?? 0,
    totalViews: video.totalViews,
    slug: video.slug,
    featured: video.featured,
    trending: video.trending,
    uploadedBy: video.uploadedBy,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
  };
};

export const toCategory = (category: PublicCategoryResponse): Category => ({
  id: String(category.categoryId),
  categoryId: category.categoryId,
  categoryName: category.categoryName,
  description: category.description ?? '',
});

export const getPublicVideos = async () => {
  const response = unwrap<PublicVideoResponse[]>(await apiFetch('/public/videos'));
  return response.map(toVideoSummary);
};

export const getPublicVideo = async (videoId: string) => {
  const response = unwrap<PublicVideoResponse>(await apiFetch(`/public/videos/${videoId}`));
  return toVideoSummary(response);
};

export const getFeaturedVideos = async () => {
  const response = unwrap<PublicVideoResponse[]>(await apiFetch('/public/videos/featured'));
  return response.map(toVideoSummary);
};

export const getTrendingVideos = async () => {
  const response = unwrap<PublicVideoResponse[]>(await apiFetch('/public/videos/trending'));
  return response.map(toVideoSummary);
};

export const searchPublicVideos = async (query: string) => {
  const response = unwrap<PublicVideoResponse[]>(
    await apiFetch(`/public/videos/search?query=${encodeURIComponent(query)}`)
  );
  return response.map(toVideoSummary);
};

export const getPublicCategories = async () => {
  const response = unwrap<PublicCategoryResponse[]>(await apiFetch('/public/categories'));
  return response.map(toCategory);
};

export const getCategoryVideos = async (categoryId: number) => {
  const response = unwrap<PublicVideoResponse[]>(
    await apiFetch(`/public/categories/${categoryId}/videos`)
  );
  return response.map(toVideoSummary);
};
