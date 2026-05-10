import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flame, Tags } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { UserNavbar } from '../dashboard/components/UserNavbar';
import { UserSidebar } from '../dashboard/components/UserSidebar';
import { SectionHeader } from '../dashboard/components/SectionHeader';
import type { DurationFilter, RatingFilter, SearchFilters, SearchSort, SearchVideo } from './types';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter, DurationFilterDropdown, RatingFilterDropdown } from './components/FilterDropdown';
import { SortDropdown } from './components/SortDropdown';
import { EmptyState } from './components/EmptyState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { SearchVideoCard } from './components/SearchVideoCard';
import {
  addToFavorites,
  addToWatchlist,
  getMyFavoriteVideoIds,
  getMyWatchlistVideoIds,
  getTrendingVideos,
  removeFromFavorites,
  removeFromWatchlist,
  searchVideos,
} from './searchService';

const suggestedSearches = ['Action', 'Drama', 'Comedy', 'Trending', 'Featured'];

const durationMatches = (video: SearchVideo, duration: DurationFilter) => {
  const seconds = video.durationSeconds || 0;
  if (duration === 'SHORT') return seconds > 0 && seconds < 1800;
  if (duration === 'MEDIUM') return seconds >= 1800 && seconds <= 5400;
  if (duration === 'LONG') return seconds > 5400;
  return true;
};

const sortVideos = (videos: SearchVideo[], sort: SearchSort) => {
  return [...videos].sort((a, b) => {
    if (sort === 'NEWEST') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    if (sort === 'MOST_VIEWED') return (b.totalViews || 0) - (a.totalViews || 0);
    if (sort === 'HIGHEST_RATED') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });
};

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(searchParams.get('q') || '');
  const [query, setQuery] = React.useState(searchParams.get('q') || '');
  const [videos, setVideos] = React.useState<SearchVideo[]>([]);
  const [watchlistVideoIds, setWatchlistVideoIds] = React.useState<Set<string>>(new Set());
  const [favoriteVideoIds, setFavoriteVideoIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [category, setCategory] = React.useState('ALL');
  const [rating, setRating] = React.useState<RatingFilter>('ALL');
  const [duration, setDuration] = React.useState<DurationFilter>('ALL');
  const [sort, setSort] = React.useState<SearchSort>('RELEVANCE');

  React.useEffect(() => {
    const nextQuery = searchParams.get('q') || '';
    setInputValue(nextQuery);
    setQuery(nextQuery);
  }, [searchParams]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmed = inputValue.trim();
      const current = searchParams.get('q') || '';
      if (trimmed === current) return;

      navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search', { replace: true });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [inputValue, navigate, searchParams]);

  const filters = React.useMemo<SearchFilters>(() => ({
    category,
    rating,
    duration,
    sort,
  }), [category, rating, duration, sort]);

  const fetchResults = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resultData, watchlistIds, favoriteIds] = await Promise.all([
        query.trim() ? searchVideos(query, filters) : getTrendingVideos(),
        getMyWatchlistVideoIds().catch(() => new Set<string>()),
        getMyFavoriteVideoIds().catch(() => new Set<string>()),
      ]);
      setVideos(resultData);
      setWatchlistVideoIds(watchlistIds);
      setFavoriteVideoIds(favoriteIds);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  React.useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const categories = React.useMemo(() => {
    return Array.from(new Set(videos.flatMap((video) => video.categories))).sort();
  }, [videos]);

  const filteredVideos = React.useMemo(() => {
    const minimumRating = rating === 'ALL' ? 0 : Number(rating);
    const filtered = videos
      .filter((video) => category === 'ALL' || video.categories.includes(category))
      .filter((video) => (video.rating || 0) >= minimumRating)
      .filter((video) => durationMatches(video, duration));
    return sortVideos(filtered, sort);
  }, [videos, category, rating, duration, sort]);

  const popularCategories = React.useMemo(() => categories.slice(0, 8), [categories]);

  const runSearch = (value = inputValue) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  const clearSearch = () => {
    setInputValue('');
    navigate('/search');
  };

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

  const showSuggestions = !query.trim() || (!isLoading && filteredVideos.length === 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UserNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="space-y-8 px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Search Results</h1>
            <p className="mt-1 text-gray-400">
              {query.trim() ? <>Results for: "{query}"</> : 'Search videos or explore what is trending now.'}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-gray-500">Total Results</p>
            <p className="text-2xl font-bold text-white">{filteredVideos.length}</p>
          </div>
        </div>

        <SearchBar value={inputValue} onChange={setInputValue} onSubmit={() => runSearch()} onClear={clearSearch} />

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
            <Button variant="ghost" size="sm" onClick={fetchResults} className="ml-3 text-rose-300 hover:bg-rose-500/10">
              Try Again
            </Button>
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
            <CategoryFilter value={category} categories={categories} onChange={setCategory} />
            <RatingFilterDropdown value={rating} onChange={setRating} />
            <DurationFilterDropdown value={duration} onChange={setDuration} />
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </section>

        <section>
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredVideos.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredVideos.map((video) => (
                <SearchVideoCard
                  key={video.videoId}
                  video={video}
                  onWatchlist={toggleWatchlist}
                  onFavorite={toggleFavorite}
                  isInWatchlist={watchlistVideoIds.has(video.videoId)}
                  isFavorite={favoriteVideoIds.has(video.videoId)}
                />
              ))}
            </div>
          )}
        </section>

        {showSuggestions && (
          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <SectionHeader title="Trending Searches" />
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((term) => (
                  <Button
                    key={term}
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-white/5 text-gray-200 hover:bg-primary/15 hover:text-primary"
                    onClick={() => {
                      setInputValue(term);
                      runSearch(term);
                    }}
                  >
                    <Flame className="mr-2 h-3.5 w-3.5" /> {term}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <SectionHeader title="Popular Categories" />
              <div className="flex flex-wrap gap-2">
                {(popularCategories.length ? popularCategories : ['Action', 'Drama', 'Comedy']).map((name) => (
                  <Button
                    key={name}
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-white/5 text-gray-200 hover:bg-primary/15 hover:text-primary"
                    onClick={() => setCategory(name)}
                  >
                    <Tags className="mr-2 h-3.5 w-3.5" /> {name}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
