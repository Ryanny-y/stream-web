import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { DurationFilter, RatingFilter } from '../types';

export const CategoryFilter: React.FC<{
  value: string;
  categories: string[];
  onChange: (value: string) => void;
}> = ({ value, categories, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="bg-zinc-950 border-white/10">
      <SelectValue placeholder="Genre" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ALL">All Genres</SelectItem>
      {categories.map((category) => (
        <SelectItem key={category} value={category}>{category}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const RatingFilterDropdown: React.FC<{
  value: RatingFilter;
  onChange: (value: RatingFilter) => void;
}> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(next) => onChange(next as RatingFilter)}>
    <SelectTrigger className="bg-zinc-950 border-white/10">
      <SelectValue placeholder="Rating" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ALL">Any Rating</SelectItem>
      <SelectItem value="4">4+ Stars</SelectItem>
      <SelectItem value="3">3+ Stars</SelectItem>
      <SelectItem value="2">2+ Stars</SelectItem>
    </SelectContent>
  </Select>
);

export const DurationFilterDropdown: React.FC<{
  value: DurationFilter;
  onChange: (value: DurationFilter) => void;
}> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(next) => onChange(next as DurationFilter)}>
    <SelectTrigger className="bg-zinc-950 border-white/10">
      <SelectValue placeholder="Duration" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ALL">Any Duration</SelectItem>
      <SelectItem value="SHORT">Under 30 min</SelectItem>
      <SelectItem value="MEDIUM">30-90 min</SelectItem>
      <SelectItem value="LONG">Over 90 min</SelectItem>
    </SelectContent>
  </Select>
);
