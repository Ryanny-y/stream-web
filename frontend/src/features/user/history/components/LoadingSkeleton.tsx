import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className="h-40 rounded-xl bg-white/5" />
    ))}
  </div>
);
