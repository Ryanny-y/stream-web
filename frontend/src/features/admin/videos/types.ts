export type VideoStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';
export type VideoVisibility = 'PUBLIC' | 'PRIVATE';

export interface AdminCategory {
  categoryId: number;
  categoryName: string;
  description?: string;
}

export interface AdminVideo {
  videoId: string;
  title: string;
  description: string;
  slug: string;
  filePath: string | null;
  thumbnailPath: string | null;
  durationSeconds: number | null;
  fileSize: number | null;
  releaseDate: string;
  visibility: VideoVisibility;
  status: VideoStatus;
  featured: boolean;
  trending: boolean;
  totalViews: number;
  uploadedBy: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  
  // UI helper fields
  rating?: number;
  favoritesCount?: number;
  watchlistCount?: number;
}

export interface VideoFormData {
  title: string;
  description: string;
  categories: string[];
  visibility: VideoVisibility;
  status: VideoStatus;
  featured: boolean;
  trending: boolean;
  thumbnailFile?: FileList;
  videoFile?: FileList;
}

export interface VideoStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  archivedVideos: number;
  totalViews: number;
}
