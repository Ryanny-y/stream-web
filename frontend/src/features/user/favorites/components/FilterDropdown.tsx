import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const FilterDropdown: React.FC<{
  value: string;
  categories: string[];
  onChange: (value: string) => void;
}> = ({ value, categories, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="bg-zinc-950 border-white/10">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ALL">All Genres</SelectItem>
      {categories.map((category) => (
        <SelectItem key={category} value={category}>{category}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);
