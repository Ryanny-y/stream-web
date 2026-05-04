const API_BASE_URL = 'http://localhost:8080/api';

interface FetchOptions extends RequestInit {
  body?: any;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const authData = localStorage.getItem('auth_data');
  const token = authData ? JSON.parse(authData).accessToken : null;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};
