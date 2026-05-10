const API_ORIGIN = 'http://localhost:8080';

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
