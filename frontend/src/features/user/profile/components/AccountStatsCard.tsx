import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AccountStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export const AccountStatsCard: React.FC<AccountStatsCardProps> = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </div>
);
