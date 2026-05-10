import React from 'react';
import { ArrowLeft, Clapperboard, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { apiFetch } from '@/shared/lib/api';
import { UserNavbar } from '../dashboard/components/UserNavbar';
import { UserSidebar } from '../dashboard/components/UserSidebar';
import { SectionHeader } from '../dashboard/components/SectionHeader';
import { EmptyState } from '../dashboard/components/EmptyState';
import type { WatchPageResponse } from './types';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoDetails } from './components/VideoDetails';
import { SuggestedVideoCard } from './components/SuggestedVideoCard';

const getToken = () => {
  const authData = localStorage.getItem('auth_data');
  return authData ? JSON.parse(authData).accessToken : null;
};

const saveProgressKeepalive = (videoId: string, watchedSeconds: number, durationSeconds: number) => {
  if (!videoId || watchedSeconds <= 0) return;

  const token = getToken();
  fetch(`http://localhost:8080/api/user/videos/${videoId}/view`, {
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      watchedSeconds: Math.floor(watchedSeconds),
      completed: durationSeconds > 0 && watchedSeconds >= durationSeconds - 5,
    }),
  }).catch(() => undefined);
};

const StreamingPlayerPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [data, setData] = React.useState<WatchPageResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const progressRef = React.useRef({ watchedSeconds: 0, durationSeconds: 0 });
  const savedRef = React.useRef(false);

  const fetchWatchPage = async () => {
    if (!videoId) return;
    setIsLoading(true);
    setError(null);
    savedRef.current = false;
    try {
      const response = await apiFetch(`/user/watch/${videoId}`);
      setData(response);
      progressRef.current = {
        watchedSeconds: response.progress?.watchedSeconds || 0,
        durationSeconds: response.progress?.durationSeconds || response.video?.durationSeconds || 0,
      };
    } catch (err: any) {
      setError(err.message || 'Video not found');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWatchPage();
  }, [videoId]);

  const saveProgress = React.useCallback(() => {
    if (!videoId || savedRef.current) return;
    savedRef.current = true;
    saveProgressKeepalive(videoId, progressRef.current.watchedSeconds, progressRef.current.durationSeconds);
  }, [videoId]);

  React.useEffect(() => {
    const handleBeforeUnload = () => saveProgress();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      saveProgress();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveProgress]);

  const addToWatchlist = async () => {
    if (!videoId) return;
    await apiFetch(`/user/watchlist/${videoId}`, { method: 'POST' }).catch(() => undefined);
  };

  const addToFavorites = async () => {
    if (!videoId) return;
    await apiFetch(`/user/favorites/${videoId}`, { method: 'POST' }).catch(() => undefined);
  };

  const share = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UserNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isLoading ? (
        <LoadingSkeleton />
      ) : error || !data ? (
        <main className="px-4 py-10 lg:px-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-gray-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <EmptyState icon={Clapperboard} message={error || 'Video unavailable'} />
        </main>
      ) : (
        <main className="space-y-8 px-4 py-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <VideoPlayer
            filePath={data.video.filePath}
            posterPath={data.video.thumbnailPath}
            resumeSeconds={data.progress?.watchedSeconds || 0}
            onTimeUpdate={(watchedSeconds, durationSeconds) => {
              progressRef.current = { watchedSeconds, durationSeconds };
              savedRef.current = false;
            }}
            onPlaybackError={() => setError('Playback error')}
          />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
            <div className="space-y-8">
              <VideoDetails
                video={data.video}
                onAddWatchlist={addToWatchlist}
                onAddFavorite={addToFavorites}
                onShare={share}
              />
            </div>
            <aside className="space-y-4">
              <SectionHeader title="Up Next" />
              {data.suggestedVideos.length ? (
                <div className="space-y-3">
                  {data.suggestedVideos.map((video) => (
                    <SuggestedVideoCard key={video.videoId} video={video} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={Play} message="No suggested videos available." />
              )}
            </aside>
          </div>
        </main>
      )}
    </div>
  );
};

export default StreamingPlayerPage;
