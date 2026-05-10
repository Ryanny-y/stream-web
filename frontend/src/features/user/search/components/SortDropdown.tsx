import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { SearchSort } from '../types';

export const SortDropdown: React.FC<{ value: SearchSort; onChange: (value: SearchSort) => void }> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(next) => onChange(next as SearchSort)}>
    <SelectTrigger className="bg-zinc-950 border-white/10">
      <SelectValue placeholder="Sort" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="RELEVANCE">Relevance</SelectItem>
      <SelectItem value="NEWEST">Newest</SelectItem>
      <SelectItem value="MOST_VIEWED">Most Viewed</SelectItem>
      <SelectItem value="HIGHEST_RATED">Highest Rated</SelectItem>
    </SelectContent>
  </Select>
);
