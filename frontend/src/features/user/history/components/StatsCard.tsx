import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
    <p className="mt-1 line-clamp-1 text-xl font-bold text-white">{value}</p>
  </div>
);
