import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';

export const FilterBar: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 py-6">
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search by title, description or slug..." 
          className="pl-10 bg-zinc-900 border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary w-full"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem>All Categories</DropdownMenuItem>
            <DropdownMenuItem>Action</DropdownMenuItem>
            <DropdownMenuItem>Comedy</DropdownMenuItem>
            <DropdownMenuItem>Drama</DropdownMenuItem>
            <DropdownMenuItem>Horror</DropdownMenuItem>
            <DropdownMenuItem>Sci-Fi</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem>All Status</DropdownMenuItem>
            <DropdownMenuItem>Published</DropdownMenuItem>
            <DropdownMenuItem>Draft</DropdownMenuItem>
            <DropdownMenuItem>Archived</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white shrink-0">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem>Newest Upload</DropdownMenuItem>
            <DropdownMenuItem>Most Viewed</DropdownMenuItem>
            <DropdownMenuItem>Highest Rated</DropdownMenuItem>
            <DropdownMenuItem>Duration (Longest)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
