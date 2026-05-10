import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { VideoStatusBadge, VisibilityBadge } from './Badges';
import { 
  Image as ImageIcon, 
  Film, 
  Tag, 
  Calendar, 
  Eye, 
  Star, 
  Heart, 
  Bookmark, 
  Info,
  X,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Textarea } from '@/shared/components/ui/textarea';
import type { AdminCategory, AdminVideo, VideoFormData, VideoStatus, VideoVisibility } from '../types';
import { resolveMediaUrl } from '../media';

// Form Schemas
const videoSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'DELETED']),
  featured: z.boolean(),
  trending: z.boolean(),
  thumbnailFile: z.any().optional(),
  videoFile: z.any().optional(),
});

// 1. Video Form Modal (Add/Edit)
interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VideoFormData) => void | Promise<void>;
  video?: AdminVideo | null;
  categories: AdminCategory[];
  isSubmitting?: boolean;
}

export const VideoFormModal: React.FC<VideoFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  video,
  categories,
  isSubmitting = false,
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      featured: false,
      trending: false,
      categories: [],
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (video) {
        reset({
          title: video.title,
          description: video.description,
          visibility: video.visibility,
          status: video.status,
          featured: video.featured,
          trending: video.trending,
          categories: video.categories,
        });
      } else {
        reset({
          title: '',
          description: '',
          visibility: 'PUBLIC',
          status: 'ACTIVE',
          featured: false,
          trending: false,
          categories: [],
        });
      }
    }
  }, [video, isOpen, reset]);

  const selectedVisibility = watch('visibility');
  const selectedStatus = watch('status');
  const selectedCategories = watch('categories');
  const selectedThumbnailFile = watch('thumbnailFile')?.[0] as File | undefined;
  const selectedVideoFile = watch('videoFile')?.[0] as File | undefined;
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedThumbnailFile) {
      setThumbnailPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedThumbnailFile);
    setThumbnailPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedThumbnailFile]);

  const formatFileSize = (size: number) => {
    if (size >= 1024 * 1024 * 1024) return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${size} B`;
  };

  const toggleCategory = (cat: string) => {
    const current = selectedCategories || [];
    if (current.includes(cat)) {
      setValue('categories', current.filter(c => c !== cat));
    } else {
      setValue('categories', [...current, cat]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{video ? 'Edit Video Content' : 'Upload New Video'}</DialogTitle>
          <DialogDescription>
            Configure video metadata, visibility, and platform status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title</Label>
              <Input id="title" placeholder="Enter video title..." {...register('title')} className="bg-zinc-900 border-white/10" />
              {errors.title && <p className="text-xs text-rose-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Write a compelling description..." 
                className="bg-zinc-900 border-white/10 min-h-[100px] resize-none"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={selectedVisibility} onValueChange={(v) => setValue('visibility', v as VideoVisibility)}>
                  <SelectTrigger className="bg-zinc-900 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10">
                    <SelectItem value="PUBLIC">Public (Visible to everyone)</SelectItem>
                    <SelectItem value="PRIVATE">Private (Only you can see)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Publishing Status</Label>
                <Select value={selectedStatus} onValueChange={(v) => setValue('status', v as VideoStatus)}>
                  <SelectTrigger className="bg-zinc-900 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                    <SelectItem value="DELETED">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white">Featured Content</h4>
                <p className="text-xs text-gray-500">Display this video in the featured section of the platform.</p>
              </div>
              <Button 
                type="button"
                variant={watch('featured') ? "default" : "outline"}
                onClick={() => setValue('featured', !watch('featured'))}
                className={cn(
                  "h-8 px-4 text-xs transition-all",
                  watch('featured') ? "bg-primary text-white" : "bg-transparent border-white/10 text-gray-400"
                )}
              >
                {watch('featured') ? 'Featured' : 'Regular'}
              </Button>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white">Trending Content</h4>
                <p className="text-xs text-gray-500">Highlight this video in trending areas.</p>
              </div>
              <Button 
                type="button"
                variant={watch('trending') ? "default" : "outline"}
                onClick={() => setValue('trending', !watch('trending'))}
                className={cn(
                  "h-8 px-4 text-xs transition-all",
                  watch('trending') ? "bg-primary text-white" : "bg-transparent border-white/10 text-gray-400"
                )}
              >
                {watch('trending') ? 'Trending' : 'Regular'}
              </Button>
            </div>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map(category => (
                  <button
                    key={category.categoryId}
                    type="button"
                    onClick={() => toggleCategory(category.categoryName)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      selectedCategories?.includes(category.categoryName)
                        ? "bg-primary border-primary text-white"
                        : "bg-zinc-900 border-white/10 text-gray-400 hover:border-white/20"
                    )}
                  >
                    {category.categoryName}
                  </button>
                ))}
              </div>
              {errors.categories && <p className="text-xs text-rose-500">{errors.categories.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <Label>Thumbnail Image</Label>
                <label className="aspect-video rounded-xl border-2 border-dashed border-white/10 bg-zinc-900/50 flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden relative">
                  {thumbnailPreviewUrl ? (
                    <img src={thumbnailPreviewUrl} className="w-full h-full object-cover" alt="Selected thumbnail preview" />
                  ) : video?.thumbnailPath ? (
                    <img src={resolveMediaUrl(video.thumbnailPath)} className="w-full h-full object-cover" alt="Current thumbnail" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-600 group-hover:text-primary transition-colors" />
                      <span className="text-xs text-gray-500">Drag & drop or click to upload</span>
                    </>
                  )}
                  {(selectedThumbnailFile || video?.thumbnailPath) && (
                    <div className="absolute inset-x-3 bottom-3 rounded-lg border border-emerald-500/20 bg-zinc-950/90 px-3 py-2 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {selectedThumbnailFile ? 'Thumbnail selected' : 'Thumbnail uploaded'}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-gray-400">
                        {selectedThumbnailFile
                          ? `${selectedThumbnailFile.name} (${formatFileSize(selectedThumbnailFile.size)})`
                          : 'Click to replace the current thumbnail'}
                      </p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="sr-only" {...register('thumbnailFile')} />
                </label>
              </div>
              <div className="space-y-3">
                <Label>Video File</Label>
                <label className="aspect-video rounded-xl border-2 border-dashed border-white/10 bg-zinc-900/50 flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
                  <Film className="w-8 h-8 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="text-xs text-gray-500">Upload MP4, MKV (Max 2GB)</span>
                  {(selectedVideoFile || video?.filePath) && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center p-4">
                      <div className="w-full max-w-[260px] rounded-xl border border-emerald-500/20 bg-zinc-950/90 p-3 text-center shadow-lg backdrop-blur-sm">
                        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                          {selectedVideoFile ? <UploadCloud className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
                          {selectedVideoFile ? 'Video selected' : 'Video uploaded'}
                        </Badge>
                        <p className="mt-2 truncate text-xs text-gray-300">
                          {selectedVideoFile ? selectedVideoFile.name : 'Click to replace the current video'}
                        </p>
                        {selectedVideoFile && (
                          <p className="mt-1 text-[11px] text-gray-500">{formatFileSize(selectedVideoFile.size)}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <input type="file" accept="video/*" className="sr-only" {...register('videoFile')} />
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white" disabled={isSubmitting}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" disabled={isSubmitting}>
                {video ? 'Update Video' : 'Publish Video'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// 2. Video Details Modal
interface VideoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: AdminVideo | null;
}

export const VideoDetailsModal: React.FC<VideoDetailsModalProps> = ({ isOpen, onClose, video }) => {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 bg-zinc-950 border-white/10">
        <div className="relative aspect-video w-full">
          <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full bg-black/50 text-white hover:bg-black/80"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <VideoStatusBadge status={video.status} />
              <VisibilityBadge visibility={video.visibility} />
              {video.featured && <Badge className="bg-amber-500 text-black font-bold border-none">FEATURED</Badge>}
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{video.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-400 border-b border-white/5 pb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-white font-medium">{video.totalViews.toLocaleString()}</span> views
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-white font-medium">{video.rating || '4.8'}</span> rating
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              {new Date(video.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-purple-500" />
              {Math.floor((video.durationSeconds || 0) / 60)}m {(video.durationSeconds || 0) % 60}s
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-1 shrink-0" />
              <p className="text-gray-300 text-sm leading-relaxed">{video.description}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Tag className="w-4 h-4 text-gray-500" />
              {video.categories.map(cat => (
                <span key={cat} className="px-2 py-0.5 bg-white/5 text-gray-400 text-[11px] rounded border border-white/5 uppercase font-medium">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <Heart className="w-3 h-3 text-rose-500" /> Favorites
              </span>
              <span className="text-white font-bold">{video.favoritesCount || 124}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <Bookmark className="w-3 h-3 text-amber-500" /> Watchlist
              </span>
              <span className="text-white font-bold">{video.watchlistCount || 45}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 3. Confirm Delete Dialog
interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  videoTitle: string;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  videoTitle 
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            Confirm Video Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to delete <span className="text-white font-bold">"{videoTitle}"</span>? 
            This will permanently remove the video file and thumbnail from the storage.
            <br /><br />
            <span className="text-rose-500 font-medium">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-rose-500 hover:bg-rose-600 text-white border-transparent"
          >
            Permanently Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
