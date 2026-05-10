export type CategoryStatus = 'ACTIVE' | 'HIDDEN';
export type CategorySort = 'NEWEST' | 'OLDEST' | 'AZ' | 'MOST_VIDEOS';
export type CategoryStatusFilter = 'ALL' | CategoryStatus;

export interface AdminCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  status: CategoryStatus;
  videoCount: number;
  recentVideos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  categoryName: string;
  description: string;
  status: CategoryStatus;
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  hiddenCategories: number;
  videosCategorized: number;
}
