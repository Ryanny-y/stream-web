import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import VideoCard from '@/shared/components/VideoCard';
import CategoryChip from '@/shared/components/CategoryChip';
import type { Category, VideoSummary } from '@/shared/types/api';
import {
  getCategoryVideos,
  getPublicCategories,
  getPublicVideos,
  searchPublicVideos,
} from '../publicService';

type SortOption = 'rating' | 'newest' | 'views';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'views', label: 'Most Watched' },
];

const BrowsePage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'All';

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategories(await getPublicCategories());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const trimmedQuery = query.trim();
        const selectedCategory = categories.find((category) => category.categoryName === activeCategory);
        const nextVideos = trimmedQuery
          ? await searchPublicVideos(trimmedQuery)
          : selectedCategory?.categoryId
            ? await getCategoryVideos(selectedCategory.categoryId)
            : await getPublicVideos();
        setVideos(nextVideos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [activeCategory, categories, query]);

  const categoryNames = useMemo(
    () => ['All', ...categories.map((category) => category.categoryName)],
    [categories]
  );

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (query.trim() && activeCategory !== 'All') {
      result = result.filter((video) => video.categories?.includes(activeCategory));
    }

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest') result.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    else if (sortBy === 'views') result.sort((a, b) => b.viewCount - a.viewCount);

    return result;
  }, [activeCategory, query, sortBy, videos]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Browse Library</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? 'Loading titles...' : `${filteredVideos.length} titles available`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="browse-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, genres..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              id="browse-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {categoryNames.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-video rounded-xl bg-muted animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">No results found</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
            <button
              onClick={() => {
                setQuery('');
                setActiveCategory('All');
              }}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePage;
