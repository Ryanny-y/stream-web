export type VideoStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
export type VideoVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';

export interface AdminVideo {
  videoId: string;
  title: string;
  description: string;
  slug: string;
  filePath: string;
  thumbnailPath: string;
  durationSeconds: number;
  fileSize: number;
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

export interface VideoStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  archivedVideos: number;
  totalViews: number;
}
