export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  phone: string | null;
  bio: string | null;
  profileImage: string | null;
  status: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  videosWatched: number;
  watchlistCount: number;
  favoritesCount: number;
  totalWatchHours: number;
  lastLoginAt: string | null;
}

export interface EditProfileFormData {
  fullName: string;
  email: string;
  username: string;
  phone?: string;
  bio?: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
