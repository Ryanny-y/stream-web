import React from 'react';
import { Clock, Film, Flame, History, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { UserNavbar } from '../dashboard/components/UserNavbar';
import { UserSidebar } from '../dashboard/components/UserSidebar';
import type { HistorySort, HistoryVideo } from './types';
import { SearchBar } from './components/SearchBar';
import { FilterDropdown } from './components/FilterDropdown';
import { SortDropdown } from './components/SortDropdown';
import { StatsCard } from './components/StatsCard';
import { EmptyState } from './components/EmptyState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ConfirmDialog } from './components/ConfirmDialog';
import { HistoryVideoCard } from './components/HistoryVideoCard';
import {
  addToFavorites,
  addToWatchlist,
  clearWatchHistory,
  getMyFavoriteVideoIds,
  getMyWatchHistory,
  getMyWatchlistVideoIds,
  removeFromFavorites,
  removeFromWatchHistory,
  removeFromWatchlist,
} from './historyService';

const sortItems = (items: HistoryVideo[], sort: HistorySort) => {
  return [...items].sort((a, b) => {
    if (sort === 'OLDEST_WATCHED') return new Date(a.lastWatchedAt || 0).getTime() - new Date(b.lastWatchedAt || 0).getTime();
    if (sort === 'MOST_WATCHED') return (b.watchedSeconds || 0) - (a.watchedSeconds || 0);
    if (sort === 'HIGHEST_RATED') return (b.rating || 0) - (a.rating || 0);
    return new Date(b.lastWatchedAt || 0).getTime() - new Date(a.lastWatchedAt || 0).getTime();
  });
};

const formatHours = (seconds: number) => {
  const hours = seconds / 3600;
  if (hours < 1) return `${Math.round(seconds / 60)}m`;
  return `${hours.toFixed(1)}h`;
};

const getMostWatchedGenre = (items: HistoryVideo[]) => {
  const counts = new Map<string, number>();
  items.forEach((video) => {
    video.categories.forEach((category) => counts.set(category, (counts.get(category) || 0) + 1));
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data';
};

const HistoryPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [items, setItems] = React.useState<HistoryVideo[]>([]);
  const [watchlistVideoIds, setWatchlistVideoIds] = React.useState<Set<string>>(new Set());
  const [favoriteVideoIds, setFavoriteVideoIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('ALL');
  const [watchDate, setWatchDate] = React.useState('');
  const [sort, setSort] = React.useState<HistorySort>('RECENTLY_WATCHED');
  const [isClearOpen, setIsClearOpen] = React.useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [historyData, watchlistIds, favoriteIds] = await Promise.all([
        getMyWatchHistory(),
        getMyWatchlistVideoIds().catch(() => new Set<string>()),
        getMyFavoriteVideoIds().catch(() => new Set<string>()),
      ]);
      setItems(historyData);
      setWatchlistVideoIds(watchlistIds);
      setFavoriteVideoIds(favoriteIds);
    } catch (err: any) {
      setError(err.message || 'Failed to load watch history');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const categories = React.useMemo(() => {
    return Array.from(new Set(items.flatMap((item) => item.categories))).sort();
  }, [items]);

  const filteredItems = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = items
      .filter((item) => item.title.toLowerCase().includes(normalizedSearch))
      .filter((item) => category === 'ALL' || item.categories.includes(category))
      .filter((item) => !watchDate || (item.lastWatchedAt || '').startsWith(watchDate));
    return sortItems(filtered, sort);
  }, [items, search, category, watchDate, sort]);

  const stats = React.useMemo(() => {
    const totalSeconds = items.reduce((sum, item) => sum + (item.watchedSeconds || 0), 0);
    return {
      totalVideos: items.length,
      totalWatchHours: formatHours(totalSeconds),
      mostWatchedGenre: getMostWatchedGenre(items),
      lastWatchedVideo: sortItems(items, 'RECENTLY_WATCHED')[0]?.title || 'None yet',
    };
  }, [items]);

  const toggleWatchlist = async (videoId: string) => {
    const isInWatchlist = watchlistVideoIds.has(videoId);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(videoId);
        setWatchlistVideoIds((current) => {
          const next = new Set(current);
          next.delete(videoId);
          return next;
        });
        setMessage({ type: 'success', text: 'Removed from watchlist' });
        return;
      }

      await addToWatchlist(videoId);
      setWatchlistVideoIds((current) => new Set(current).add(videoId));
      setMessage({ type: 'success', text: 'Added to watchlist' });
    } catch (err: any) {
      if (!isInWatchlist && String(err.message || '').toLowerCase().includes('already')) {
        await removeFromWatchlist(videoId).catch(() => undefined);
        setWatchlistVideoIds((current) => {
          const next = new Set(current);
          next.delete(videoId);
          return next;
        });
        setMessage({ type: 'success', text: 'Removed from watchlist' });
        return;
      }
      setMessage({ type: 'error', text: err.message || 'Failed to update watchlist' });
    }
  };

  const toggleFavorite = async (videoId: string) => {
    const isFavorite = favoriteVideoIds.has(videoId);
    try {
      if (isFavorite) {
        await removeFromFavorites(videoId);
        setFavoriteVideoIds((current) => {
          const next = new Set(current);
          next.delete(videoId);
          return next;
        });
        setMessage({ type: 'success', text: 'Removed from favorites' });
        return;
      }

      await addToFavorites(videoId);
      setFavoriteVideoIds((current) => new Set(current).add(videoId));
      setMessage({ type: 'success', text: 'Added to favorites' });
    } catch (err: any) {
      if (!isFavorite && String(err.message || '').toLowerCase().includes('already')) {
        await removeFromFavorites(videoId).catch(() => undefined);
        setFavoriteVideoIds((current) => {
          const next = new Set(current);
          next.delete(videoId);
          return next;
        });
        setMessage({ type: 'success', text: 'Removed from favorites' });
        return;
      }
      setMessage({ type: 'error', text: err.message || 'Failed to update favorites' });
    }
  };

  const handleRemove = async (videoId: string) => {
    try {
      await removeFromWatchHistory(videoId);
      setItems((current) => current.filter((item) => item.videoId !== videoId));
      setMessage({ type: 'success', text: 'Removed from history' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove history item' });
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearWatchHistory();
      setItems([]);
      setIsClearOpen(false);
      setMessage({ type: 'success', text: 'Watch history cleared' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to clear history' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UserNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="space-y-8 px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Watch History</h1>
            <p className="mt-1 text-gray-400">Review videos you have watched before.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-gray-500">Total Watched</p>
              <p className="text-2xl font-bold text-white">{items.length}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
              disabled={items.length === 0}
              onClick={() => setIsClearOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear History
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Total Videos Watched" value={stats.totalVideos} icon={Film} />
          <StatsCard label="Total Watch Hours" value={stats.totalWatchHours} icon={Clock} />
          <StatsCard label="Most Watched Genre" value={stats.mostWatchedGenre} icon={Flame} />
          <StatsCard label="Last Watched Video" value={stats.lastWatchedVideo} icon={History} />
        </div>

        {message && (
          <div className={`rounded-xl border p-4 text-sm ${
            message.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
          }`}>
            {message.text}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
            {error}
            <Button variant="ghost" size="sm" onClick={fetchHistory} className="ml-3 text-rose-300 hover:bg-rose-500/10">
              Try Again
            </Button>
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_220px_180px_220px]">
            <SearchBar value={search} onChange={setSearch} />
            <FilterDropdown value={category} categories={categories} onChange={setCategory} />
            <Input
              type="date"
              value={watchDate}
              onChange={(event) => setWatchDate(event.target.value)}
              className="bg-zinc-950 border-white/10 focus-visible:ring-primary/50"
              aria-label="Filter by watch date"
            />
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </section>

        <section>
          {isLoading ? (
            <LoadingSkeleton />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
              No watch history items match your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((video) => (
                <HistoryVideoCard
                  key={video.videoId}
                  video={video}
                  onRemove={handleRemove}
                  onWatchlist={toggleWatchlist}
                  onFavorite={toggleFavorite}
                  isInWatchlist={watchlistVideoIds.has(video.videoId)}
                  isFavorite={favoriteVideoIds.has(video.videoId)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <ConfirmDialog open={isClearOpen} onOpenChange={setIsClearOpen} onConfirm={handleClearHistory} />
    </div>
  );
};

export default HistoryPage;
