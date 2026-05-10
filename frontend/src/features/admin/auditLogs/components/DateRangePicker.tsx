import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className="pl-10 bg-zinc-950 border-white/10 text-sm"
          aria-label="Start date"
        />
      </div>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className="pl-10 bg-zinc-950 border-white/10 text-sm"
          aria-label="End date"
        />
      </div>
    </div>
  );
};
