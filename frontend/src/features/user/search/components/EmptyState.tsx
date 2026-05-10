import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const EmptyState: React.FC = () => (
  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
    <SearchX className="mx-auto mb-4 h-12 w-12 text-gray-600" />
    <h2 className="text-xl font-bold text-white">No videos found</h2>
    <p className="mt-2 text-sm text-gray-400">Try another keyword, category, or filter.</p>
    <Button asChild className="mt-5 bg-primary text-white hover:bg-primary/90">
      <Link to="/browse">Browse Videos</Link>
    </Button>
  </div>
);
