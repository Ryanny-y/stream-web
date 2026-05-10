import React from 'react';
import { Button } from '@/shared/components/ui/button';
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
import { FavoriteVideoCard } from './components/FavoriteVideoCard';
import type { FavoriteItem, FavoriteSort } from './types';
import {
  addToFavorites,
  addToWatchlist,
  getMyFavorites,
  getMyWatchlistVideoIds,
  getRecommendedForFavorites,
  removeFromFavorites,
  removeFromWatchlist,
} from './favoritesService';

const sortItems = (items: FavoriteItem[], sort: FavoriteSort) => {
  return [...items].sort((a, b) => {
    if (sort === 'OLDEST_ADDED') return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    if (sort === 'HIGHEST_RATED') return (b.video.rating || 0) - (a.video.rating || 0);
    if (sort === 'MOST_VIEWED') return (b.video.totalViews || 0) - (a.video.totalViews || 0);
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });
};

const FavoritesPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [items, setItems] = React.useState<FavoriteItem[]>([]);
  const [recommended, setRecommended] = React.useState<DashboardVideo[]>([]);
  const [watchlistVideoIds, setWatchlistVideoIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('ALL');
  const [sort, setSort] = React.useState<FavoriteSort>('RECENTLY_ADDED');

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [favoritesData, watchlistIds, recommendedData] = await Promise.all([
        getMyFavorites(),
        getMyWatchlistVideoIds().catch(() => new Set<string>()),
        getRecommendedForFavorites().catch(() => []),
      ]);
      setItems(favoritesData);
      setWatchlistVideoIds(watchlistIds);
      setRecommended(recommendedData);
    } catch (err: any) {
      setError(err.message || 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFavorites();
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

  const handleRemoveFavorite = async (videoId: string) => {
    try {
      await removeFromFavorites(videoId);
      setItems((current) => current.filter((item) => item.video.videoId !== videoId));
      setMessage({ type: 'success', text: 'Removed from favorites' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove favorite' });
    }
  };

  const handleWatchlist = async (videoId: string) => {
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

  const handleAddRecommendedToFavorites = async (videoId: string) => {
    try {
      const item = await addToFavorites(videoId);
      setItems((current) => {
        if (current.some((existing) => existing.video.videoId === videoId)) {
          return current;
        }
        return [item, ...current];
      });
      setRecommended((current) => current.filter((video) => video.videoId !== videoId));
      setMessage({ type: 'success', text: 'Added to favorites' });
    } catch (err: any) {
      if (String(err.message || '').toLowerCase().includes('already')) {
        await removeFromFavorites(videoId).catch(() => undefined);
        setItems((current) => current.filter((item) => item.video.videoId !== videoId));
        setMessage({ type: 'success', text: 'Removed from favorites' });
        return;
      }
      setMessage({ type: 'error', text: err.message || 'Failed to add to favorites' });
    }
  };

  const favoriteVideoIds = React.useMemo(() => new Set(items.map((item) => item.video.videoId)), [items]);
  const visibleRecommendations = React.useMemo(
    () => recommended.filter((video) => !favoriteVideoIds.has(video.videoId)).slice(0, 8),
    [recommended, favoriteVideoIds],
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UserNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="space-y-8 px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Favorites</h1>
            <p className="mt-1 text-gray-400">Videos you liked and saved as favorites.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-gray-500">Total Favorites</p>
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
            <Button variant="ghost" size="sm" onClick={fetchFavorites} className="ml-3 text-rose-300 hover:bg-rose-500/10">
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
              No favorite videos match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <FavoriteVideoCard
                  key={item.video.videoId}
                  item={item}
                  onRemove={handleRemoveFavorite}
                  onWatchlist={handleWatchlist}
                  isInWatchlist={watchlistVideoIds.has(item.video.videoId)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Recommended Based on Your Favorites" />
          {isLoading ? (
            <LoadingSkeleton />
          ) : visibleRecommendations.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleRecommendations.map((video) => (
                <VideoCard
                  key={video.videoId}
                  video={video}
                  onSecondaryAction={handleAddRecommendedToFavorites}
                  isSecondaryActive={favoriteVideoIds.has(video.videoId)}
                  secondaryKind="favorite"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-gray-500">
              Recommendations will appear after you like more videos.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default FavoritesPage;
