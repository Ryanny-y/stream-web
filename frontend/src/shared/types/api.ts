// Global API response wrapper used by all features
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Shared video types used across guest, user, and admin features
export interface VideoSummary {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number; // seconds
  genre: string;
  rating: number;
  releaseDate: string;
  viewCount: number;
}

/**
 * Matches the backend Category entity response:
 * { id, categoryName, description }
 * thumbnailUrl is NOT returned by the backend — we derive visuals on the frontend.
 */
export interface Category {
  id: string;
  categoryName: string;
  description: string;
}

