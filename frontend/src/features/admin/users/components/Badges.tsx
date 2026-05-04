import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { AdminRole, UserStatus } from '../types';

export const RoleBadge: React.FC<{ role: AdminRole }> = ({ role }) => {
  const styles = {
    ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
    CONTENT_MANAGER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    USER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const labels = {
    ADMIN: "Admin",
    CONTENT_MANAGER: "Content Manager",
    USER: "User",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
      styles[role]
    )}>
      {labels[role]}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    SUSPENDED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    BANNED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <span className={cn(
      "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border w-fit uppercase tracking-tighter",
      styles[status]
    )}>
      <span className={cn("w-1 h-1 rounded-full", status === 'ACTIVE' ? "bg-emerald-500" : status === 'SUSPENDED' ? "bg-amber-500" : "bg-rose-500")} />
      {status}
    </span>
  );
};
