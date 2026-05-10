export type Role = 'ADMIN' | 'USER' | 'SUBSCRIBER' | string;

export interface AuthResponse {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  roles: Role[];
  accessToken: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  roles: Role[];
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
