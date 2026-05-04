import React, { useState, useEffect } from 'react';
import { 
  Film, 
  CheckCircle2, 
  FileEdit, 
  Archive, 
  Eye, 
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Video
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatsCard } from '../users/components/StatsCard'; // Reusing StatsCard
import { FilterBar } from './components/FilterBar';
import { VideoTable } from './components/VideoTable';
import { VideoFormModal, VideoDetailsModal, ConfirmDeleteDialog } from './components/VideoModals';
import type { AdminVideo, VideoStats } from './types';
import { apiFetch } from '@/shared/lib/api';
import { Skeleton } from '@/shared/components/ui/skeleton';

// Mock Data
const MOCK_VIDEOS: AdminVideo[] = [
  {
    videoId: '1',
    title: 'The Dark Horizon',
    description: 'A thrilling sci-fi adventure into the deep unknown of space.',
    slug: 'the-dark-horizon',
    filePath: '/videos/dark-horizon.mp4',
    thumbnailPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
    durationSeconds: 5400,
    fileSize: 1024 * 1024 * 1200,
    releaseDate: '2024-01-12',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    featured: true,
    trending: true,
    totalViews: 1245000,
    uploadedBy: 'Admin John',
    categories: ['Sci-Fi', 'Action'],
    createdAt: '2024-01-12T10:00:00',
    updatedAt: '2024-05-04T15:30:00',
    rating: 4.9,
    favoritesCount: 12400,
    watchlistCount: 5600
  },
  {
    videoId: '2',
    title: 'Neon Nights',
    description: 'Cyberpunk aesthetic exploration of a future city that never sleeps.',
    slug: 'neon-nights',
    filePath: '/videos/neon-nights.mp4',
    thumbnailPath: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80',
    durationSeconds: 3600,
    fileSize: 1024 * 1024 * 800,
    releaseDate: '2024-02-05',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    featured: false,
    trending: true,
    totalViews: 850000,
    uploadedBy: 'Jane Smith',
    categories: ['Action', 'Thriller'],
    createdAt: '2024-02-05T09:15:00',
    updatedAt: '2024-05-05T11:45:00',
    rating: 4.5,
    favoritesCount: 8900,
    watchlistCount: 3200
  },
  {
    videoId: '3',
    title: 'Silent Whispers',
    description: 'A psychological thriller about the secrets hidden in a small town.',
    slug: 'silent-whispers',
    filePath: '/videos/silent-whispers.mp4',
    thumbnailPath: 'https://images.unsplash.com/photo-1574267432553-4b462808152a?auto=format&fit=crop&q=80',
    durationSeconds: 7200,
    fileSize: 1024 * 1024 * 1500,
    releaseDate: '2024-05-03',
    visibility: 'PRIVATE',
    status: 'DRAFT',
    featured: false,
    trending: false,
    totalViews: 0,
    uploadedBy: 'Admin Mike',
    categories: ['Thriller', 'Drama'],
    createdAt: '2024-05-03T14:20:00',
    updatedAt: '2024-05-03T18:10:00',
    rating: 0.0,
    favoritesCount: 0,
    watchlistCount: 0
  },
  {
    videoId: '4',
    title: 'Cosmic Journey',
    description: 'An educational documentary about the birth of the universe.',
    slug: 'cosmic-journey',
    filePath: '/videos/cosmic-journey.mp4',
    thumbnailPath: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80',
    durationSeconds: 3600,
    fileSize: 1024 * 1024 * 900,
    releaseDate: '2024-01-15',
    visibility: 'PUBLIC',
    status: 'ARCHIVED',
    featured: false,
    trending: false,
    totalViews: 3100000,
    uploadedBy: 'Admin John',
    categories: ['Documentary'],
    createdAt: '2024-01-15T11:40:00',
    updatedAt: '2024-05-01T09:20:00',
    rating: 4.8,
    favoritesCount: 45000,
    watchlistCount: 12000
  },
  {
    videoId: '5',
    title: 'Laugh Out Loud',
    description: 'A collection of the funniest moments in stand-up history.',
    slug: 'laugh-out-loud',
    filePath: '/videos/lol.mp4',
    thumbnailPath: 'https://images.unsplash.com/photo-1527228114514-69e3fe619bfb?auto=format&fit=crop&q=80',
    durationSeconds: 1800,
    fileSize: 1024 * 1024 * 300,
    releaseDate: '2024-05-02',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    featured: true,
    trending: false,
    totalViews: 150000,
    uploadedBy: 'Jane Smith',
    categories: ['Comedy'],
    createdAt: '2024-05-02T16:50:00',
    updatedAt: '2024-05-04T12:00:00',
    rating: 4.2,
    favoritesCount: 1200,
    watchlistCount: 500
  }
];

export const VideoManagementPage: React.FC = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real scenario, we would have an endpoint for videos and video stats
      // For now, I'll use placeholders if the endpoints don't exist yet
      const data = await apiFetch('/admin/videos').catch(() => MOCK_VIDEOS);
      setVideos(data);
      
      // Calculate dummy stats based on data
      setStats({
        totalVideos: data.length,
        publishedVideos: data.filter((v: any) => v.status === 'PUBLISHED').length,
        draftVideos: data.filter((v: any) => v.status === 'DRAFT').length,
        archivedVideos: data.filter((v: any) => v.status === 'ARCHIVED').length,
        totalViews: data.reduce((acc: number, curr: any) => acc + curr.totalViews, 0)
      });
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

  const handleConfirmDelete = () => {
    if (selectedVideo) {
      setVideos(videos.filter(v => v.videoId !== selectedVideo.videoId));
      setIsDeleteOpen(false);
      setSelectedVideo(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingVideo) {
      setVideos(videos.map(v => v.videoId === editingVideo.videoId ? { 
        ...v, 
        ...data, 
        updatedAt: new Date().toISOString() 
      } : v));
    } else {
      const newVideo: AdminVideo = {
        videoId: Math.random().toString(36).substr(2, 9),
        ...data,
        slug: data.title.toLowerCase().replace(/ /g, '-'),
        filePath: '/videos/new.mp4',
        thumbnailPath: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80',
        durationSeconds: 7200,
        fileSize: 1024 * 1024 * 500,
        releaseDate: new Date().toISOString().split('T')[0],
        totalViews: 0,
        uploadedBy: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVideos([newVideo, ...videos]);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (video: AdminVideo, newStatus: any) => {
    setVideos(videos.map(v => v.videoId === video.videoId ? { 
      ...v, 
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : v));
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
          label="Drafts" 
          value={isLoading ? '...' : stats?.draftVideos ?? 0} 
          icon={FileEdit} 
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
        
        {error && !videos.length && (
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
