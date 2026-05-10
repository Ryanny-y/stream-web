import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { WatchlistSort } from '../types';

export const SortDropdown: React.FC<{ value: WatchlistSort; onChange: (value: WatchlistSort) => void }> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(next) => onChange(next as WatchlistSort)}>
    <SelectTrigger className="bg-zinc-950 border-white/10">
      <SelectValue placeholder="Sort" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="RECENTLY_ADDED">Recently Added</SelectItem>
      <SelectItem value="OLDEST_ADDED">Oldest Added</SelectItem>
      <SelectItem value="HIGHEST_RATED">Highest Rated</SelectItem>
      <SelectItem value="MOST_VIEWED">Most Viewed</SelectItem>
    </SelectContent>
  </Select>
);
