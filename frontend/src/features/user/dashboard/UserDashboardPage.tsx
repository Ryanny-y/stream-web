import React from 'react';
import { Clock, History, ListVideo, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { apiFetch } from '@/shared/lib/api';
import { useAuth } from '@/shared/lib/auth-context';
import type { DashboardVideo, UserDashboardResponse } from './types';
import { formatDate, formatDuration, resolveMediaUrl } from './utils';
import { UserNavbar } from './components/UserNavbar';
import { UserSidebar } from './components/UserSidebar';
import { SectionHeader } from './components/SectionHeader';
import { EmptyState } from './components/EmptyState';
import { ContinueWatchingCard } from './components/ContinueWatchingCard';
import { VideoCard } from './components/VideoCard';
import { GenreChip } from './components/GenreChip';
import { ProgressBar } from './components/ProgressBar';

const CardSkeleton = () => <Skeleton className="aspect-[3/2] rounded-xl bg-white/5" />;

const videoGrid = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4';

const HistoryCard: React.FC<{ video: DashboardVideo }> = ({ video }) => (
  <article className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.07] transition-colors">
    <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
      {video.thumbnailPath && <img src={resolveMediaUrl(video.thumbnailPath)} alt={video.title} className="h-full w-full object-cover" />}
    </div>
    <div className="min-w-0 flex-1 space-y-2">
      <h3 className="line-clamp-1 font-semibold text-white">{video.title}</h3>
      <p className="text-xs text-gray-500">Last watched {formatDate(video.lastWatchedAt)}</p>
      <ProgressBar value={video.progressPercentage || 0} />
      <Button size="sm" variant="outline" className="h-8 border-white/10 bg-white/5 text-xs text-white">
        {(video.progressPercentage || 0) >= 95 ? 'Rewatch' : 'Resume'}
      </Button>
    </div>
  </article>
);

const UserDashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [dashboard, setDashboard] = React.useState<UserDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuth();

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/user/dashboard');
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load your dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboard();
  }, []);

  const featured = dashboard?.featuredVideo;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UserNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="space-y-10 px-4 py-6 lg:px-8">
        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
            {error}
            <Button variant="ghost" size="sm" onClick={fetchDashboard} className="ml-3 text-rose-300 hover:bg-rose-500/10">
              Try Again
            </Button>
          </div>
        )}

        <section className="relative overflow-hidden rounded-2xl border border-white/10 min-h-[420px] bg-zinc-900">
          {featured?.thumbnailPath && (
            <img src={resolveMediaUrl(featured.thumbnailPath)} alt={featured.title} className="absolute inset-0 h-full w-full object-cover opacity-45" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
          <div className="relative z-10 max-w-3xl px-6 py-12 lg:px-10 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Welcome back, {user?.fullName || user?.username}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              {featured?.title || 'Discover your next favorite story'}
            </h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              Continue watching your favorite videos or discover something new.
            </p>
            {featured && (
              <div className="mt-5 flex items-center gap-3">
                <GenreChip genre={featured.categories[0]} />
                <span className="text-sm text-gray-300">{formatDuration(featured.durationSeconds)}</span>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Play className="mr-2 h-4 w-4 fill-current" /> Watch Now
              </Button>
              <Button variant="outline" className="border-white/15 bg-white/10 text-white hover:bg-white/15">
                View Details
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Continue Watching" />
          {isLoading ? (
            <div className={videoGrid}>{Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)}</div>
          ) : dashboard?.continueWatching.length ? (
            <div className={videoGrid}>{dashboard.continueWatching.map((video) => <ContinueWatchingCard key={video.videoId} video={video} />)}</div>
          ) : (
            <EmptyState icon={Clock} message="No videos in progress yet." />
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Recommended Videos" />
          {isLoading ? (
            <div className={videoGrid}>{Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)}</div>
          ) : dashboard?.recommendedVideos.length ? (
            <div className={videoGrid}>{dashboard.recommendedVideos.map((video) => <VideoCard key={video.videoId} video={video} />)}</div>
          ) : (
            <EmptyState icon={Play} message="No recommendations available yet." />
          )}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <SectionHeader title="Watch History" actionLabel="View All History" actionTo="/history" />
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-xl bg-white/5" />)}</div>
            ) : dashboard?.watchHistory.length ? (
              <div className="space-y-3">{dashboard.watchHistory.map((video) => <HistoryCard key={video.videoId} video={video} />)}</div>
            ) : (
              <EmptyState icon={History} message="Your watch history is empty." />
            )}
          </div>

          <div className="space-y-4">
            <SectionHeader title="Watchlist" actionLabel="View Full Watchlist" actionTo="/watchlist" />
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, index) => <CardSkeleton key={index} />)}</div>
            ) : dashboard?.watchlist.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{dashboard.watchlist.slice(0, 4).map((video) => <VideoCard key={video.videoId} video={video} variant="watchlist" />)}</div>
            ) : (
              <EmptyState icon={ListVideo} message="No saved videos in your watchlist." />
            )}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Trending Now" />
          {isLoading ? (
            <div className={videoGrid}>{Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)}</div>
          ) : dashboard?.trendingVideos.length ? (
            <div className={videoGrid}>{dashboard.trendingVideos.map((video) => <VideoCard key={video.videoId} video={video} variant="trending" />)}</div>
          ) : (
            <EmptyState icon={Play} message="No trending videos available yet." />
          )}
        </section>

        <div className="h-8" />
      </main>
    </div>
  );
};

export default UserDashboardPage;
