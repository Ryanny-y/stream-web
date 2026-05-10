import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmit, onClear }) => (
  <form
    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:flex-row"
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, genre, category, or keyword..."
        className="h-12 bg-zinc-950 pl-12 pr-11 text-base border-white/10 focus-visible:ring-primary/50"
        type="search"
        aria-label="Search videos"
      />
      {value && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 text-gray-400 hover:text-white"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
    <Button type="submit" className="h-12 bg-primary px-8 text-white hover:bg-primary/90">
      Search
    </Button>
  </form>
);
