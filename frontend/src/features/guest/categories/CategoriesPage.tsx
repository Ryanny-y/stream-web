import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, ChevronRight, Film, Flame, Laugh, Rocket, Theater, Video } from 'lucide-react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import type { Category, VideoSummary } from '@/shared/types/api';
import { getPublicCategories, getPublicVideos } from '../publicService';

const PALETTE = [
  { gradient: 'from-red-900 via-red-800 to-red-950', Icon: Film, badge: 'bg-red-500/20 text-red-400 ring-red-500/30' },
  { gradient: 'from-blue-900 via-blue-800 to-blue-950', Icon: Theater, badge: 'bg-blue-500/20 text-blue-400 ring-blue-500/30' },
  { gradient: 'from-purple-900 via-purple-800 to-purple-950', Icon: Rocket, badge: 'bg-purple-500/20 text-purple-400 ring-purple-500/30' },
  { gradient: 'from-orange-900 via-orange-800 to-orange-950', Icon: Flame, badge: 'bg-orange-500/20 text-orange-400 ring-orange-500/30' },
  { gradient: 'from-emerald-900 via-emerald-800 to-emerald-950', Icon: Laugh, badge: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30' },
  { gradient: 'from-cyan-900 via-cyan-800 to-cyan-950', Icon: Video, badge: 'bg-cyan-500/20 text-cyan-400 ring-cyan-500/30' },
];

interface CategoryCardProps {
  category: Category;
  index: number;
  videoCount: number;
}

const CategoryCard = ({ category, index, videoCount }: CategoryCardProps) => {
  const style = PALETTE[index % PALETTE.length];
  const Icon = style.Icon;

  return (
    <Link
      to={`/browse?category=${encodeURIComponent(category.categoryName)}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-white/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
    >
      <div className={`relative h-44 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
        <Icon className="h-14 w-14 text-white select-none group-hover:scale-110 transition-transform duration-300 relative z-10" />
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
            Browse <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 bg-card p-4 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-foreground text-lg leading-tight">{category.categoryName}</h3>
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${style.badge}`}>
            {videoCount} titles
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {category.description || 'Explore this collection of published videos.'}
        </p>
      </div>
    </Link>
  );
};

const CategoriesPage = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [categoryData, videoData] = await Promise.all([
          getPublicCategories(),
          getPublicVideos(),
        ]);
        setCategories(categoryData);
        setVideos(videoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories.filter(
      (category) =>
        category.categoryName.toLowerCase().includes(q) ||
        category.description.toLowerCase().includes(q)
    );
  }, [categories, query]);

  const countForCategory = (name: string) =>
    videos.filter((video) => video.categories?.includes(name)).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-4">
            <Tag className="w-3.5 h-3.5" />
            All Categories
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">
            Browse by Category
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Explore our full library organized by genre. Each category is curated with the best titles just for you.
          </p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="categories-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-6 mb-10 text-sm text-muted-foreground">
          <span>
            <span className="font-bold text-foreground">{categories.length}</span> total categories
          </span>
          <span>
            <span className="font-bold text-foreground">{videos.length}</span> titles available
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                videoCount={countForCategory(category.categoryName)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Film className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">No categories found</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Try a different search term.
              </p>
            </div>
            <button
              onClick={() => setQuery('')}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
