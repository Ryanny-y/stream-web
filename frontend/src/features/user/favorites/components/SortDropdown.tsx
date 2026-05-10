import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { FavoriteSort } from '../types';

export const SortDropdown: React.FC<{ value: FavoriteSort; onChange: (value: FavoriteSort) => void }> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(next) => onChange(next as FavoriteSort)}>
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
