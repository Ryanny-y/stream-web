import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { LogAction, LogRole, LogStatus } from '../types';
import { formatActionLabel } from '../utils';

export const StatusBadge: React.FC<{ status: LogStatus }> = ({ status }) => {
  const styles = {
    SUCCESS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', styles[status])}>
      {status}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: LogRole }> = ({ role }) => {
  const styles = {
    ADMIN: 'bg-primary/10 text-primary border-primary/20',
    CONTENT_MANAGER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    USER: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    SYSTEM: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', styles[role])}>
      {role.replace('_', ' ')}
    </span>
  );
};

export const ActionBadge: React.FC<{ action: LogAction }> = ({ action }) => {
  const styles = {
    LOGIN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    LOGOUT: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    CREATE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    UPDATE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    UPLOAD: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    ROLE_CHANGE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    FAILED_LOGIN: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    SUSPEND_USER: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    OTHER: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', styles[action])}>
      {formatActionLabel(action)}
    </span>
  );
};
