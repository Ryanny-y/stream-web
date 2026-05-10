import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export const SearchBar: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search watch history..."
      className="bg-zinc-950 pl-10 border-white/10 focus-visible:ring-primary/50"
    />
  </div>
);
