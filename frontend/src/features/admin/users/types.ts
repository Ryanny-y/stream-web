export type AdminRole = 'ADMIN' | 'USER' | 'CONTENT_MANAGER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export interface AdminUser {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  status: UserStatus;
  emailVerified: boolean;
  failedAttempts: number;
  lockedUntil?: string;
  roles: AdminRole[];
  createdAt: string;
  updatedAt: string;
  
  // UI helper fields (optional, can be derived)
  fullName?: string; 
  
  // Stats (keeping these as they are useful for the dashboard view I built)
  totalWatchTime?: string;
  videosWatched?: number;
  favoritesCount?: number;
  watchlistCount?: number;
}

export interface UserStats {
  totalUsers: number;
  totalActiveUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  systemAdmin: number;
}
