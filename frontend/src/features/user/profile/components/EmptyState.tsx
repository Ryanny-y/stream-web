import React from 'react';
import { UserX } from 'lucide-react';

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
    <UserX className="mx-auto mb-3 h-10 w-10 text-gray-600" />
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);
