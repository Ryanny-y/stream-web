import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Clock, Calendar, Eye, ChevronLeft } from 'lucide-react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import VideoCard from '@/shared/components/VideoCard';
import CategoryChip from '@/shared/components/CategoryChip';
import type { VideoSummary } from '@/shared/types/api';
import { getPublicVideo, getPublicVideos } from '../publicService';

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatViews = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
};

const formatDate = (date: string): string => {
  if (!date) return 'Recently';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoSummary | null>(null);
  const [allVideos, setAllVideos] = useState<VideoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const [videoData, videosData] = await Promise.all([
          getPublicVideo(id),
          getPublicVideos(),
        ]);
        setVideo(videoData);
        setAllVideos(videosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const similar = useMemo(() => {
    if (!video) return [];
    return allVideos
      .filter((item) => item.id !== video.id && item.categories?.some((category) => video.categories?.includes(category)))
      .slice(0, 4);
  }, [allVideos, video]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Browse
        </Link>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
            <div className="lg:col-span-3 aspect-video rounded-2xl bg-muted animate-pulse" />
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ) : video ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
              <div className="lg:col-span-3">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted shadow-2xl shadow-black/50">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <Link
                    to={`/watch/${video.id}`}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer hover:bg-black/50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-xl shadow-primary/40 group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(video.categories?.length ? video.categories : [video.genre]).map((category) => (
                    <CategoryChip key={category} label={category} active />
                  ))}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-3">
                  {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
                  <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {video.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDuration(video.duration)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(video.releaseDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {formatViews(video.viewCount)} views
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {video.description || 'No description has been added for this video yet.'}
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  <Link
                    to={`/watch/${video.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Watch Now
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border hover:border-white/20 text-foreground font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                  >
                    Sign in to save
                  </Link>
                </div>
              </div>
            </div>

            {similar.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-5">More Like This</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similar.map((item) => (
                    <VideoCard key={item.id} video={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="py-24 text-center">
            <h1 className="text-2xl font-bold text-foreground">Video not found</h1>
            <p className="mt-2 text-muted-foreground">This title may no longer be available.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VideoDetailPage;
