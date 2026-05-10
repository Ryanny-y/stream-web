import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton key={index} className="aspect-[3/2] rounded-xl bg-white/5" />
    ))}
  </div>
);
