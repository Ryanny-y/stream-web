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
  videoId?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  thumbnailPath?: string | null;
  filePath?: string | null;
  duration: number; // seconds
  durationSeconds?: number | null;
  genre: string;
  categories?: string[];
  rating: number;
  releaseDate: string;
  viewCount: number;
  totalViews?: number | null;
  slug?: string | null;
  featured?: boolean | null;
  trending?: boolean | null;
  uploadedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/**
 * Matches the backend Category entity response:
 * { id, categoryName, description }
 * thumbnailUrl is NOT returned by the backend — we derive visuals on the frontend.
 */
export interface Category {
  id: string;
  categoryId?: number;
  categoryName: string;
  description: string;
}

export interface PublicVideoResponse {
  videoId: string;
  title: string;
  description: string | null;
  slug: string | null;
  filePath: string | null;
  thumbnailPath: string | null;
  durationSeconds: number | null;
  releaseDate: string | null;
  featured: boolean | null;
  trending: boolean | null;
  totalViews: number | null;
  uploadedBy: string | null;
  categories: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PublicCategoryResponse {
  categoryId: number;
  categoryName: string;
  description: string | null;
}
