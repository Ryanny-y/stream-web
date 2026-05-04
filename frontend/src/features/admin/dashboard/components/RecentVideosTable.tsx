import React from 'react';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

// Mock data for the table
const recentVideos = [
  {
    id: '1',
    title: 'The Dark Horizon',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
    category: 'Sci-Fi',
    views: '1.2M',
    status: 'Published',
    uploadDate: '2026-05-01',
  },
  {
    id: '2',
    title: 'Neon Nights',
    thumbnail: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80',
    category: 'Action',
    views: '850K',
    status: 'Published',
    uploadDate: '2026-04-28',
  },
  {
    id: '3',
    title: 'Silent Whispers',
    thumbnail: 'https://images.unsplash.com/photo-1574267432553-4b462808152a?auto=format&fit=crop&q=80',
    category: 'Thriller',
    views: '0',
    status: 'Draft',
    uploadDate: '2026-05-03',
  },
  {
    id: '4',
    title: 'Cosmic Journey',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80',
    category: 'Documentary',
    views: '3.1M',
    status: 'Archived',
    uploadDate: '2026-01-15',
  },
  {
    id: '5',
    title: 'Laugh Out Loud',
    thumbnail: 'https://images.unsplash.com/photo-1527228114514-69e3fe619bfb?auto=format&fit=crop&q=80',
    category: 'Comedy',
    views: '150K',
    status: 'Published',
    uploadDate: '2026-05-02',
  },
];

export const RecentVideosTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <Badge variant="success">Published</Badge>;
      case 'Draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'Archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10 bg-black/20">
            <TableHead className="w-[80px]">Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentVideos.map((video) => (
            <TableRow key={video.id} className="border-white/5 hover:bg-white/5">
              <TableCell>
                <div className="w-16 h-9 rounded bg-zinc-800 overflow-hidden relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-white">{video.title}</TableCell>
              <TableCell className="text-gray-400">{video.category}</TableCell>
              <TableCell className="text-gray-400">{video.views}</TableCell>
              <TableCell>{getStatusBadge(video.status)}</TableCell>
              <TableCell className="text-gray-400 text-xs">{video.uploadDate}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" /> Edit Video
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
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
