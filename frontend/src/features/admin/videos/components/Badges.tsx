import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { VideoStatus, VideoVisibility } from '../types';

export const VideoStatusBadge: React.FC<{ status: VideoStatus }> = ({ status }) => {
  const styles = {
    PUBLISHED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    DRAFT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    ARCHIVED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
      styles[status]
    )}>
      {status}
    </span>
  );
};

export const VisibilityBadge: React.FC<{ visibility: VideoVisibility }> = ({ visibility }) => {
  const styles = {
    PUBLIC: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PRIVATE: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    UNLISTED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
      styles[visibility]
    )}>
      {visibility}
    </span>
  );
};
