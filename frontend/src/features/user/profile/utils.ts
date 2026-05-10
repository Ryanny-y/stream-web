const API_ORIGIN = 'http://localhost:8080';

export const resolveProfileImage = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.replace(/\\/g, '/');
  if (normalized.startsWith('upload/images/')) {
    return `${API_ORIGIN}/images/${normalized.substring('upload/images/'.length)}`;
  }
  if (normalized.startsWith('/images/')) {
    return `${API_ORIGIN}${normalized}`;
  }
  return normalized;
};

export const getInitials = (name?: string | null) =>
  (name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const formatDate = (date?: string | null) =>
  date
    ? new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date))
    : 'Not available';
