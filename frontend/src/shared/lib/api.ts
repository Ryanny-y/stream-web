export const API_ORIGIN = 'http://localhost:8080';
const API_BASE_URL = `${API_ORIGIN}/api`;

interface FetchOptions extends RequestInit {
  body?: any;
}

const getAuthToken = () => {
  const authData = localStorage.getItem('auth_data');
  return authData ? JSON.parse(authData).accessToken : null;
};

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const token = getAuthToken();

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

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const apiUpload = async (endpoint: string, file: File) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const resolveMediaUrl = (path?: string | null) => {
  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/\\/g, '/');

  if (normalizedPath.startsWith('upload/images/')) {
    return `${API_ORIGIN}/images/${normalizedPath.substring('upload/images/'.length)}`;
  }

  if (normalizedPath.startsWith('upload/videos/')) {
    return `${API_ORIGIN}/videos/${normalizedPath.substring('upload/videos/'.length)}`;
  }

  if (normalizedPath.startsWith('/images/') || normalizedPath.startsWith('/videos/')) {
    return `${API_ORIGIN}${normalizedPath}`;
  }

  return normalizedPath;
};
