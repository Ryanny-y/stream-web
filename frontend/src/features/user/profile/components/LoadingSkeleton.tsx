import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-40 rounded-2xl bg-white/5" />
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
      <Skeleton className="h-96 rounded-2xl bg-white/5" />
      <Skeleton className="h-96 rounded-2xl bg-white/5" />
    </div>
  </div>
);
