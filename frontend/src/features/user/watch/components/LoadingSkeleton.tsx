import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 px-4 py-6 lg:px-8">
    <Skeleton className="aspect-video w-full rounded-2xl bg-white/5" />
    <div className="space-y-3">
      <Skeleton className="h-8 w-2/3 bg-white/5" />
      <Skeleton className="h-4 w-full bg-white/5" />
      <Skeleton className="h-4 w-4/5 bg-white/5" />
    </div>
  </div>
);
