import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

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
  className 
}) => {
  return (
    <Card className={cn("bg-white/5 border-white/10 overflow-hidden relative group", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{label}</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
            
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isUp ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  trend.isUp ? "text-emerald-500" : "text-rose-500"
                )}>
                  {trend.value}
                </span>
                <span className="text-[10px] text-gray-500 ml-0.5">vs last month</span>
              </div>
            )}
          </div>
          
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Subtle Background Decoration */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
      </CardContent>
    </Card>
  );
};
