import React from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Play, 
  Archive, 
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import type { AdminVideo } from '../types';
import { VideoStatusBadge } from './Badges';

interface VideoTableProps {
  videos: AdminVideo[];
  onView: (video: AdminVideo) => void;
  onEdit: (video: AdminVideo) => void;
  onDelete: (video: AdminVideo) => void;
  onStatusChange: (video: AdminVideo, newStatus: any) => void;
}

export const VideoTable: React.FC<VideoTableProps> = ({ 
  videos, 
  onView, 
  onEdit, 
  onDelete,
  onStatusChange 
}) => {
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead className="w-[120px]">Preview</TableHead>
            <TableHead>Video Details</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.videoId} className="hover:bg-white/5 border-white/5 transition-colors group">
              <TableCell>
                <div className="relative aspect-video w-24 rounded overflow-hidden bg-zinc-800 border border-white/10 group-hover:border-primary/50 transition-colors">
                  <img 
                    src={video.thumbnailPath} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white font-medium">
                    {formatDuration(video.durationSeconds)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col max-w-[200px]">
                  <span className="font-medium text-white truncate">{video.title}</span>
                  <span className="text-xs text-gray-500 truncate">by {video.uploadedBy}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {video.categories.map(cat => (
                    <span key={cat} className="text-[10px] bg-zinc-800 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">
                      {cat}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Eye className="w-3 h-3" />
                    {formatViews(video.totalViews)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    {video.rating || '0.0'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <VideoStatusBadge status={video.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-col text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-white/10 text-white">
                    <DropdownMenuLabel>Video Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(video)} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(video)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" /> Edit Content
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {video.status !== 'PUBLISHED' && (
                      <DropdownMenuItem onClick={() => onStatusChange(video, 'PUBLISHED')} className="cursor-pointer text-emerald-500">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Publish Now
                      </DropdownMenuItem>
                    )}
                    {video.status !== 'ARCHIVED' && (
                      <DropdownMenuItem onClick={() => onStatusChange(video, 'ARCHIVED')} className="cursor-pointer text-zinc-400">
                        <Archive className="mr-2 h-4 w-4" /> Archive Video
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete(video)}
                      className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Video
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
