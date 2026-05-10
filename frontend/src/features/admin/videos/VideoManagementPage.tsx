import React, { useState, useEffect } from 'react';
import { 
  Film, 
  CheckCircle2, 
  Archive, 
  Eye, 
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Video,
  Trash2
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatsCard } from '../users/components/StatsCard'; // Reusing StatsCard
import { FilterBar } from './components/FilterBar';
import { VideoTable } from './components/VideoTable';
import { VideoFormModal, VideoDetailsModal, ConfirmDeleteDialog } from './components/VideoModals';
import type { AdminCategory, AdminVideo, VideoFormData, VideoStats, VideoStatus } from './types';
import { apiFetch, apiUpload } from '@/shared/lib/api';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const VideoManagementPage: React.FC = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null);

  const createSlug = (title: string) =>
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const categoryIdsFor = (categoryNames: string[]) =>
    categoryNames
      .map(name => categories.find(category => category.categoryName === name)?.categoryId)
      .filter((categoryId): categoryId is number => categoryId !== undefined);

  const calculateStats = (items: AdminVideo[]): VideoStats => ({
    totalVideos: items.length,
    publishedVideos: items.filter(video => video.status === 'ACTIVE').length,
    draftVideos: items.filter(video => video.status === 'DELETED').length,
    archivedVideos: items.filter(video => video.status === 'ARCHIVED').length,
    totalViews: items.reduce((acc, curr) => acc + (curr.totalViews || 0), 0)
  });

  const applyVideos = (items: AdminVideo[]) => {
    setVideos(items);
    setStats(calculateStats(items));
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [videoData, categoryData] = await Promise.all([
        apiFetch('/admin/videos'),
        apiFetch('/admin/categories'),
      ]);
      applyVideos(videoData);
      setCategories(categoryData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch video data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination Logic
  const indexOfLastVideo = currentPage * itemsPerPage;
  const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(videos.length / itemsPerPage);

  const handleAddVideo = () => {
    setEditingVideo(null);
    setIsFormOpen(true);
  };

  const handleEditVideo = (video: AdminVideo) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const handleViewDetails = (video: AdminVideo) => {
    setSelectedVideo(video);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (video: AdminVideo) => {
    setSelectedVideo(video);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVideo) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await apiFetch(`/admin/videos/${selectedVideo.videoId}`, { method: 'DELETE' });
      applyVideos(videos.filter(v => v.videoId !== selectedVideo.videoId));
      setIsDeleteOpen(false);
      setSelectedVideo(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete video');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: VideoFormData) => {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      title: data.title,
      description: data.description,
      slug: editingVideo?.slug || createSlug(data.title),
      visibility: data.visibility,
      featured: data.featured,
      trending: data.trending,
      categoryIds: categoryIdsFor(data.categories),
    };

    try {
      let savedVideo: AdminVideo = editingVideo
        ? await apiFetch(`/admin/videos/${editingVideo.videoId}`, { method: 'PUT', body: payload })
        : await apiFetch('/admin/videos', { method: 'POST', body: payload });

      const thumbnailFile = data.thumbnailFile?.[0];
      if (thumbnailFile) {
        savedVideo = await apiUpload(`/admin/videos/${savedVideo.videoId}/thumbnail`, thumbnailFile);
      }

      const videoFile = data.videoFile?.[0];
      if (videoFile) {
        savedVideo = await apiUpload(`/admin/videos/${savedVideo.videoId}/file`, videoFile);
      }

      if (savedVideo.status !== data.status) {
        savedVideo = await apiFetch(`/admin/videos/${savedVideo.videoId}/status`, {
          method: 'PATCH',
          body: { status: data.status },
        });
      }

      const nextVideos = editingVideo
        ? videos.map(video => video.videoId === savedVideo.videoId ? savedVideo : video)
        : [savedVideo, ...videos];

      applyVideos(nextVideos);
      setIsFormOpen(false);
      setEditingVideo(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save video');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (video: AdminVideo, newStatus: VideoStatus) => {
    setError(null);
    try {
      const updatedVideo = await apiFetch(`/admin/videos/${video.videoId}/status`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      applyVideos(videos.map(item => item.videoId === updatedVideo.videoId ? updatedVideo : item));
    } catch (err: any) {
      setError(err.message || 'Failed to update video status');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Manage Videos</h1>
          <p className="text-gray-400 mt-1">Upload, update, publish, archive, and monitor platform videos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchData}
            disabled={isLoading}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleAddVideo}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          label="Total Videos" 
          value={isLoading ? '...' : stats?.totalVideos ?? 0} 
          icon={Video} 
        />
        <StatsCard 
          label="Published" 
          value={isLoading ? '...' : stats?.publishedVideos ?? 0} 
          icon={CheckCircle2} 
        />
        <StatsCard 
          label="Deleted" 
          value={isLoading ? '...' : stats?.draftVideos ?? 0} 
          icon={Trash2} 
        />
        <StatsCard 
          label="Archived" 
          value={isLoading ? '...' : stats?.archivedVideos ?? 0} 
          icon={Archive} 
          className="border-zinc-500/20 bg-zinc-500/5"
        />
        <StatsCard 
          label="Total Views" 
          value={isLoading ? '...' : (stats?.totalViews ? (stats.totalViews / 1000000).toFixed(1) + 'M' : '0')} 
          icon={Eye} 
        />
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <FilterBar />
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-500">
            <p className="text-sm font-medium">{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchData} className="ml-auto hover:bg-rose-500/20">Try Again</Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(itemsPerPage)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-12 text-center">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No videos found</h3>
            <p className="text-gray-500 mt-1">Start by uploading your first video to the platform.</p>
            <Button onClick={handleAddVideo} variant="outline" className="mt-4 border-white/10 text-white">
              Upload Video
            </Button>
          </div>
        ) : (
          <>
            <VideoTable 
              videos={currentVideos} 
              onView={handleViewDetails}
              onEdit={handleEditVideo}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-gray-500">
                Showing <span className="text-white font-medium">{indexOfFirstVideo + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLastVideo, videos.length)}</span> of <span className="text-white font-medium">{videos.length}</span> videos
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === i + 1 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <VideoFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        video={editingVideo}
        categories={categories}
        isSubmitting={isSubmitting}
      />

      <VideoDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        video={selectedVideo}
      />

      <ConfirmDeleteDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete}
        videoTitle={selectedVideo?.title || ''}
      />
    </div>
  );
};

export default VideoManagementPage;
