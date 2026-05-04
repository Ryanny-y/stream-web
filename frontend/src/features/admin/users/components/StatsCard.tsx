import React from 'react';
import { cn } from '@/shared/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <div className={cn(
      "bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all group",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn(
                "text-xs font-medium flex items-center gap-0.5",
                trend.isUp ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend.value}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};
