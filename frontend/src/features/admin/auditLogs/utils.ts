import type { AuditLog, DisplayLog, LogAction, LoginLog } from './types';

export const normalizeAction = (action: string): LogAction => {
  const normalized = action.toUpperCase().replace(/[\s-]+/g, '_');
  if (normalized.includes('LOGIN') && normalized.includes('FAILED')) return 'FAILED_LOGIN';
  if (normalized.includes('LOGIN')) return 'LOGIN';
  if (normalized.includes('LOGOUT')) return 'LOGOUT';
  if (normalized.includes('CREATE')) return 'CREATE';
  if (normalized.includes('UPDATE')) return 'UPDATE';
  if (normalized.includes('DELETE')) return 'DELETE';
  if (normalized.includes('UPLOAD')) return 'UPLOAD';
  if (normalized.includes('ROLE')) return 'ROLE_CHANGE';
  if (normalized.includes('SUSPEND')) return 'SUSPEND_USER';
  return 'OTHER';
};

export const formatActionLabel = (action: LogAction) =>
  action
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export const describeDevice = (userAgent?: string | null) => {
  if (!userAgent) return 'Unknown device';
  if (userAgent.includes('Edg/')) return 'Microsoft Edge';
  if (userAgent.includes('Chrome/')) return 'Chrome';
  if (userAgent.includes('Firefox/')) return 'Firefox';
  if (userAgent.includes('Safari/')) return 'Safari';
  return userAgent.slice(0, 80);
};

const compactJson = (value: string | null) => {
  if (!value) return '';
  try {
    return JSON.stringify(JSON.parse(value));
  } catch {
    return value;
  }
};

export const toDisplayAuditLog = (log: AuditLog): DisplayLog => {
  const action = normalizeAction(log.action);
  const oldValue = compactJson(log.oldValue);
  const newValue = compactJson(log.newValue);

  return {
    id: log.logId,
    timestamp: log.createdAt,
    user: log.username || 'System',
    email: log.username || 'system',
    role: log.username ? 'ADMIN' : 'SYSTEM',
    action,
    actionLabel: formatActionLabel(action),
    module: log.entityName || 'System',
    ipAddress: log.ipAddress || 'Unknown',
    status: 'SUCCESS',
    device: describeDevice(log.userAgent),
    details: newValue || oldValue || `${formatActionLabel(action)} ${log.entityName || 'record'}`,
    raw: log,
  };
};

export const toDisplayLoginLog = (log: LoginLog): DisplayLog => {
  const action: LogAction = log.success ? 'LOGIN' : 'FAILED_LOGIN';

  return {
    id: log.loginId,
    timestamp: log.attemptedAt,
    user: log.username || 'Unknown user',
    email: log.emailAttempt || 'Unknown email',
    role: log.userId ? 'USER' : 'SYSTEM',
    action,
    actionLabel: formatActionLabel(action),
    module: 'Authentication',
    ipAddress: log.ipAddress || 'Unknown',
    status: log.success ? 'SUCCESS' : 'FAILED',
    device: 'Login request',
    details: log.success ? 'User authenticated successfully.' : 'Authentication attempt failed.',
    raw: log,
  };
};
