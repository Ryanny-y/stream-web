import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { CategorySort, CategoryStatusFilter } from '../types';

interface FilterBarProps {
  searchTerm: string;
  statusFilter: CategoryStatusFilter;
  sortBy: CategorySort;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CategoryStatusFilter) => void;
  onSortChange: (value: CategorySort) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  statusFilter,
  sortBy,
  onSearchChange,
  onStatusChange,
  onSortChange,
}) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by category name..."
            className="pl-10 bg-zinc-950 border-white/10 focus-visible:ring-primary/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as CategoryStatusFilter)}>
          <SelectTrigger className="bg-zinc-950 border-white/10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="HIDDEN">Hidden</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as CategorySort)}>
          <SelectTrigger className="bg-zinc-950 border-white/10">
            <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEWEST">Newest</SelectItem>
            <SelectItem value="OLDEST">Oldest</SelectItem>
            <SelectItem value="AZ">A-Z</SelectItem>
            <SelectItem value="MOST_VIDEOS">Most Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
