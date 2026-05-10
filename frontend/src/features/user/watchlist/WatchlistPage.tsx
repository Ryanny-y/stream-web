import React from 'react';
import { UserNavbar } from '../dashboard/components/UserNavbar';
import { UserSidebar } from '../dashboard/components/UserSidebar';
import { SectionHeader } from '../dashboard/components/SectionHeader';
import { VideoCard } from '../dashboard/components/VideoCard';
import type { DashboardVideo } from '../dashboard/types';
import { SearchBar } from './components/SearchBar';
import { FilterDropdown } from './components/FilterDropdown';
import { SortDropdown } from './components/SortDropdown';
import { EmptyState } from './components/EmptyState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { WatchlistVideoCard } from './components/WatchlistVideoCard';
import type { WatchlistItem, WatchlistSort } from './types';
import {
  addToWatchlist,
  addToFavorites,
  getMyWatchlist,
  getRecommendedForWatchlist,
  removeFromWatchlist,
} from './watchlistService';
import { Button } from '@/shared/components/ui/button';

const sortItems = (items: WatchlistItem[], sort: WatchlistSort) => {
  return [...items].sort((a, b) => {
    if (sort === 'OLDEST_ADDED') return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    if (sort === 'HIGHEST_RATED') return (b.video.rating || 0) - (a.video.rating || 0);
    if (sort === 'MOST_VIEWED') return (b.video.totalViews || 0) - (a.video.totalViews || 0);
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });
};

const WatchlistPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [items, setItems] = React.useState<WatchlistItem[]>([]);
  const [recommended, setRecommended] = React.useState<DashboardVideo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('ALL');
  const [sort, setSort] = React.useState<WatchlistSort>('RECENTLY_ADDED');

  const fetchWatchlist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [watchlistData, recommendedData] = await Promise.all([
        getMyWatchlist(),
        getRecommendedForWatchlist().catch(() => []),
      ]);
      setItems(watchlistData);
      setRecommended(recommendedData);
    } catch (err: any) {
      setError(err.message || 'Failed to load watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWatchlist();
  }, []);

  const categories = React.useMemo(() => {
    return Array.from(new Set(items.flatMap((item) => item.video.categories))).sort();
  }, [items]);

  const filteredItems = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = items
      .filter((item) => item.video.title.toLowerCase().includes(normalizedSearch))
      .filter((item) => category === 'ALL' || item.video.categories.includes(category));
    return sortItems(filtered, sort);
  }, [items, search, category, sort]);

  const handleRemove = async (videoId: string) => {
    try {
      await removeFromWatchlist(videoId);
      setItems((current) => current.filter((item) => item.video.videoId !== videoId));
      setMessage({ type: 'success', text: 'Removed from watchlist' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove video' });
    }
  };

  const handleFavorite = async (videoId: string) => {
    try {
      await addToFavorites(videoId);
      setMessage({ type: 'success', text: 'Added to favorites' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to add favorite' });
    }
  };

  const handleAddRecommendedToWatchlist = async (videoId: string) => {
    try {
      const item = await addToWatchlist(videoId);
      setItems((current) => {
        if (current.some((existing) => existing.video.videoId === videoId)) {
          return current;
        }
        return [item, ...current];
      });
      setRecommended((current) => current.filter((video) => video.videoId !== videoId));
      setMessage({ type: 'success', text: 'Added to watchlist' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to add to watchlist' });
    }
  };

  const watchlistVideoIds = React.useMemo(() => new Set(items.map((item) => item.video.videoId)), [items]);
  const visibleRecommendations = React.useMemo(
    () => recommended.filter((video) => !watchlistVideoIds.has(video.videoId)).slice(0, 8),
    [recommended, watchlistVideoIds],
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UserNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="space-y-8 px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Watchlist</h1>
            <p className="mt-1 text-gray-400">Videos you saved to watch later.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-gray-500">Total Saved</p>
            <p className="text-2xl font-bold text-white">{items.length}</p>
          </div>
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
            <Button variant="ghost" size="sm" onClick={fetchWatchlist} className="ml-3 text-rose-300 hover:bg-rose-500/10">
              Try Again
            </Button>
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px]">
            <SearchBar value={search} onChange={setSearch} />
            <FilterDropdown value={category} categories={categories} onChange={setCategory} />
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
              No saved videos match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <WatchlistVideoCard
                  key={item.video.videoId}
                  item={item}
                  onRemove={handleRemove}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Recommended Based on Your Watchlist" />
          {isLoading ? (
            <LoadingSkeleton />
          ) : visibleRecommendations.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleRecommendations.map((video) => (
                <VideoCard key={video.videoId} video={video} onSecondaryAction={handleAddRecommendedToWatchlist} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-gray-500">
              Recommendations will appear after you watch or save more videos.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WatchlistPage;
