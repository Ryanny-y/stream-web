import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { HistorySort } from '../types';

export const SortDropdown: React.FC<{ value: HistorySort; onChange: (value: HistorySort) => void }> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(next) => onChange(next as HistorySort)}>
    <SelectTrigger className="bg-zinc-950 border-white/10">
      <SelectValue placeholder="Sort" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="RECENTLY_WATCHED">Recently Watched</SelectItem>
      <SelectItem value="OLDEST_WATCHED">Oldest Watched</SelectItem>
      <SelectItem value="MOST_WATCHED">Most Watched</SelectItem>
      <SelectItem value="HIGHEST_RATED">Highest Rated</SelectItem>
    </SelectContent>
  </Select>
);
