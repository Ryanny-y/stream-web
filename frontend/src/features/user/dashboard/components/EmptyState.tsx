import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => (
  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
    <Icon className="mx-auto mb-3 h-8 w-8 text-gray-600" />
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);
