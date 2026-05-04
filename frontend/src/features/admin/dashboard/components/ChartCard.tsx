import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className,
  description 
}) => {
  return (
    <Card className={cn("bg-white/5 border-white/10 h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="w-full h-[300px]">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
