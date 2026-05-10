import { apiFetch } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api';
import type { Comment, RatingSummary } from './types';

const unwrap = <T,>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

export const getVideoRatings = async (videoId: string): Promise<RatingSummary> =>
  unwrap<RatingSummary>(await apiFetch(`/user/videos/${videoId}/rating`));

export const submitRating = async (videoId: string, rating: number): Promise<RatingSummary> => {
  try {
    await apiFetch(`/user/videos/${videoId}/rating`, { method: 'POST', body: { rating } });
  } catch (err: any) {
    const message = String(err.message || '').toLowerCase();
    if (!message.includes('already')) {
      throw err;
    }
    await apiFetch(`/user/videos/${videoId}/rating`, { method: 'PUT', body: { rating } });
  }

  return getVideoRatings(videoId);
};

export const getVideoComments = async (videoId: string): Promise<Comment[]> =>
  unwrap<Comment[]>(await apiFetch(`/user/videos/${videoId}/comments`));

export const createComment = async (videoId: string, content: string): Promise<Comment> =>
  unwrap<Comment>(await apiFetch(`/user/videos/${videoId}/comments`, {
    method: 'POST',
    body: { commentText: content },
  }));

export const deleteComment = async (commentId: string) => {
  await apiFetch(`/user/comments/${commentId}`, { method: 'DELETE' });
};
