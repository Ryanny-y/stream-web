import type { AuditLog } from '../auditLogs/types';
import type { AdminVideo } from '../videos/types';

export interface DashboardUserGrowth {
  month: string;
  totalUsers: number;
}

export interface DashboardCategoryStats {
  categoryId: number;
  categoryName: string;
  totalViews: number;
}

export interface AdminDashboardResponse {
  totalUsers: number;
  totalActiveUsers: number;
  totalVideos: number;
  totalCategories: number;
  totalViews: number;
  userGrowth: DashboardUserGrowth[];
  mostWatchedCategories: DashboardCategoryStats[];
  recentVideos: AdminVideo[];
  recentActivity: AuditLog[];
}
