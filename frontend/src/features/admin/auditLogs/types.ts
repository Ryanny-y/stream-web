export type LogStatus = 'SUCCESS' | 'FAILED' | 'WARNING';
export type LogRole = 'ADMIN' | 'CONTENT_MANAGER' | 'USER' | 'SYSTEM';
export type LogAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'UPLOAD'
  | 'ROLE_CHANGE'
  | 'FAILED_LOGIN'
  | 'SUSPEND_USER'
  | 'OTHER';

export interface AuditLog {
  logId: string;
  userId: string | null;
  username: string | null;
  action: string;
  entityName: string | null;
  entityId: string | null;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface LoginLog {
  loginId: string;
  userId: string | null;
  username: string | null;
  emailAttempt: string;
  success: boolean;
  ipAddress: string | null;
  attemptedAt: string;
}

export interface DisplayLog {
  id: string;
  timestamp: string;
  user: string;
  email: string;
  role: LogRole;
  action: LogAction;
  actionLabel: string;
  module: string;
  ipAddress: string;
  status: LogStatus;
  device: string;
  details: string;
  raw: AuditLog | LoginLog;
}

export interface LogFilters {
  searchTerm: string;
  role: 'ALL' | LogRole;
  action: 'ALL' | LogAction;
  status: 'ALL' | LogStatus;
  startDate: string;
  endDate: string;
}
