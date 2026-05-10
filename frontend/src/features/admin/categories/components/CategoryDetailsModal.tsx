import React from 'react';
import { CalendarDays, Clapperboard, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { AdminCategory } from '../types';
import { StatusBadge } from './StatusBadge';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AdminCategory | null;
}

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({ isOpen, onClose, category }) => {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] bg-zinc-950 border-white/10">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{category.categoryName}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Category ID #{category.categoryId}</p>
            </div>
            <StatusBadge status={category.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm leading-6 text-gray-300">{category.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Clapperboard className="w-3.5 h-3.5 text-primary" /> Videos
              </p>
              <p className="text-2xl font-bold text-white mt-2">{category.videoCount}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-4 sm:col-span-2">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-primary" /> Timeline
              </p>
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <p>Created: <span className="text-white">{formatDateTime(category.createdAt)}</span></p>
                <p>Updated: <span className="text-white">{formatDateTime(category.updatedAt)}</span></p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Recent Videos
            </p>
            {category.recentVideos.length ? (
              <div className="space-y-2">
                {category.recentVideos.map((title) => (
                  <div key={title} className="rounded-lg border border-white/5 bg-zinc-900 px-3 py-2 text-sm text-gray-300">
                    {title}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-gray-500">
                No videos are currently assigned to this category.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
