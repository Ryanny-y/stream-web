import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { CategoryStatus } from '../types';

export const StatusBadge: React.FC<{ status: CategoryStatus }> = ({ status }) => {
  const styles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    HIDDEN: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', styles[status])}>
      {status === 'ACTIVE' ? 'Active' : 'Hidden'}
    </span>
  );
};
