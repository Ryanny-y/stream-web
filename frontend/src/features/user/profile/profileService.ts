import { apiFetch } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api';
import type { EditProfileFormData, UserProfile } from './types';

const unwrap = <T,>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const authHeader = () => {
  const authData = localStorage.getItem('auth_data');
  const token = authData ? JSON.parse(authData).accessToken : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const splitName = (fullName: string) => {
  const [firstName, ...lastNameParts] = fullName.trim().split(/\s+/);
  return {
    firstName: firstName || '',
    lastName: lastNameParts.join(' '),
  };
};

export const getMyProfile = async () => unwrap<UserProfile>(await apiFetch('/user/profile'));

export const updateMyProfile = async (data: EditProfileFormData) => {
  const name = splitName(data.fullName);
  return unwrap<UserProfile>(await apiFetch('/user/profile', {
    method: 'PUT',
    body: {
      username: data.username,
      email: data.email,
      firstName: name.firstName,
      lastName: name.lastName,
      phone: data.phone || null,
      bio: data.bio || null,
    },
  }));
};

export const updateMyAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8080/api/user/profile/avatar', {
    method: 'PUT',
    headers: authHeader(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return unwrap<UserProfile>(await response.json());
};

export const removeMyAvatar = async () =>
  unwrap<UserProfile>(await apiFetch('/user/profile/avatar', { method: 'DELETE' }));

export const changeMyPassword = async (currentPassword: string, newPassword: string) =>
  apiFetch('/user/change-password', {
    method: 'PUT',
    body: { currentPassword, newPassword },
  });
