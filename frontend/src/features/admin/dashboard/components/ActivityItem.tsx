import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ActivityItemProps {
  icon: LucideIcon;
  description: string;
  timestamp: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  description,
  timestamp,
  iconBgColor = "bg-white/5",
  iconColor = "text-primary"
}) => {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
        iconBgColor
      )}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300 leading-tight group-hover:text-white transition-colors">
          {description}
        </p>
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1 block">
          {timestamp}
        </span>
      </div>
    </div>
  );
};
