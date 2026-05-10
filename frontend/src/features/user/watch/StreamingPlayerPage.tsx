import React from 'react';
import { ArrowLeft, Clapperboard, MessageCircle, Play } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { apiFetch } from '@/shared/lib/api';
import { useAuth } from '@/shared/lib/auth-context';
import {
  addToFavorites,
  addToWatchlist,
  getMyFavoriteVideoIds,
  getMyWatchlistVideoIds,
  removeFromFavorites,
  removeFromWatchlist,
} from '../watchlist/watchlistService';
import { UserNavbar } from '../dashboard/components/UserNavbar';
import { UserSidebar } from '../dashboard/components/UserSidebar';
import { SectionHeader } from '../dashboard/components/SectionHeader';
import { EmptyState } from '../dashboard/components/EmptyState';
import type { WatchPageResponse } from './types';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoDetails } from './components/VideoDetails';
import { SuggestedVideoCard } from './components/SuggestedVideoCard';
import { RatingSummaryCard } from './components/RatingSummaryCard';
import { CommentForm } from './components/CommentForm';
import { CommentCard } from './components/CommentCard';
import { ConfirmDialog } from './components/ConfirmDialog';
import type { Comment, RatingSummary } from './types';
import {
  createComment,
  deleteComment,
  getVideoComments,
  getVideoRatings,
  submitRating,
} from './engagementService';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [data, setData] = React.useState<WatchPageResponse | null>(null);
  const [ratingSummary, setRatingSummary] = React.useState<RatingSummary | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [isInWatchlist, setIsInWatchlist] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEngagementLoading, setIsEngagementLoading] = React.useState(true);
  const [isRatingSubmitting, setIsRatingSubmitting] = React.useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [commentToDelete, setCommentToDelete] = React.useState<Comment | null>(null);
  const progressRef = React.useRef({ watchedSeconds: 0, durationSeconds: 0 });
  const savedRef = React.useRef(false);

  const fetchWatchPage = async () => {
    if (!videoId) return;
    setIsLoading(true);
    setError(null);
    savedRef.current = false;
    try {
      const [response, watchlistIds, favoriteIds] = await Promise.all([
        apiFetch(`/user/watch/${videoId}`),
        getMyWatchlistVideoIds().catch(() => new Set<string>()),
        getMyFavoriteVideoIds().catch(() => new Set<string>()),
      ]);
      setData(response);
      setIsInWatchlist(watchlistIds.has(videoId));
      setIsFavorite(favoriteIds.has(videoId));
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

  React.useEffect(() => {
    if (!videoId) return;

    const fetchEngagement = async () => {
      setIsEngagementLoading(true);
      setMessage(null);
      try {
        const [ratingsData, commentsData] = await Promise.all([
          getVideoRatings(videoId),
          getVideoComments(videoId),
        ]);
        setRatingSummary(ratingsData);
        setComments(commentsData);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to load ratings and comments' });
      } finally {
        setIsEngagementLoading(false);
      }
    };

    fetchEngagement();
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

  const toggleWatchlist = async () => {
    if (!videoId) return;
    if (isInWatchlist) {
      await removeFromWatchlist(videoId).catch(() => undefined);
      setIsInWatchlist(false);
      return;
    }

    try {
      await addToWatchlist(videoId);
      setIsInWatchlist(true);
    } catch (err: any) {
      if (String(err.message || '').toLowerCase().includes('already')) {
        await removeFromWatchlist(videoId).catch(() => undefined);
        setIsInWatchlist(false);
      }
    }
  };

  const toggleFavorites = async () => {
    if (!videoId) return;
    if (isFavorite) {
      await removeFromFavorites(videoId).catch(() => undefined);
      setIsFavorite(false);
      return;
    }

    try {
      await addToFavorites(videoId);
      setIsFavorite(true);
    } catch (err: any) {
      if (String(err.message || '').toLowerCase().includes('already')) {
        await removeFromFavorites(videoId).catch(() => undefined);
        setIsFavorite(false);
      }
    }
  };

  const share = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  };

  const handleRating = async (rating: number) => {
    if (!videoId) return;
    setIsRatingSubmitting(true);
    setMessage(null);
    try {
      const nextSummary = await submitRating(videoId, rating);
      setRatingSummary(nextSummary);
      setMessage({ type: 'success', text: 'Rating saved' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save rating' });
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const handleCreateComment = async (content: string) => {
    if (!videoId) return;
    setIsCommentSubmitting(true);
    setMessage(null);
    try {
      const comment = await createComment(videoId, content);
      setComments((current) => [comment, ...current]);
      setMessage({ type: 'success', text: 'Comment posted' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to post comment' });
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await deleteComment(commentToDelete.commentId);
      setComments((current) => current.filter((comment) => comment.commentId !== commentToDelete.commentId));
      setMessage({ type: 'success', text: 'Comment deleted' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete comment' });
    } finally {
      setCommentToDelete(null);
    }
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
            resumeSeconds={searchParams.get('restart') === '1' ? 0 : data.progress?.watchedSeconds || 0}
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
                onAddWatchlist={toggleWatchlist}
                onAddFavorite={toggleFavorites}
                onShare={share}
                isInWatchlist={isInWatchlist}
                isFavorite={isFavorite}
              />

              {message && (
                <div className={`rounded-xl border p-4 text-sm ${
                  message.type === 'success'
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                }`}>
                  {message.text}
                </div>
              )}

              <RatingSummaryCard
                summary={ratingSummary}
                isLoading={isEngagementLoading}
                isSubmitting={isRatingSubmitting}
                onRate={handleRating}
              />

              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <SectionHeader title={`Comments (${comments.length})`} />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <CommentForm onSubmit={handleCreateComment} isSubmitting={isCommentSubmitting} />
                </div>

                {isEngagementLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-28 rounded-xl bg-white/5" />
                    ))}
                  </div>
                ) : comments.length ? (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <CommentCard
                        key={comment.commentId}
                        comment={comment}
                        canDelete={Boolean(user?.userId && comment.userId === user.userId)}
                        onDelete={setCommentToDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
                    <MessageCircle className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                    <h2 className="text-lg font-bold text-white">No comments yet</h2>
                    <p className="mt-1 text-sm text-gray-400">Start the discussion with your thoughts on this video.</p>
                  </div>
                )}
              </section>
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

          <ConfirmDialog
            open={Boolean(commentToDelete)}
            onOpenChange={(open) => !open && setCommentToDelete(null)}
            onConfirm={handleDeleteComment}
          />
        </main>
      )}
    </div>
  );
};

export default StreamingPlayerPage;
