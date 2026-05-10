export type Role = 'ADMIN' | 'USER' | 'SUBSCRIBER' | string;

export interface AuthResponse {
  userId: string;
  username: string;
  email: string;
  firstName?: string | null;
  fullName: string;
  profileImage?: string | null;
  roles: Role[];
  accessToken: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  firstName?: string | null;
  fullName: string;
  roles: Role[];
  profileImage?: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
