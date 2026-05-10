const API_ORIGIN = 'http://localhost:8080';

export const resolveMediaUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

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

export const formatDuration = (seconds?: number | null) => {
  if (!seconds) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const formatCompact = (value?: number | null) =>
  new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0);

export const formatDate = (date?: string | null) => {
  if (!date) return 'Recently';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
};
