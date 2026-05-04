import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, ChevronRight, Film } from 'lucide-react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import VideoCard from '@/shared/components/VideoCard';
import { mockCategories, mockVideos } from '@/shared/utils/mockData';
import type { Category } from '@/shared/types/api';

/** A curated color/icon palette cycling by index — used because the backend
 *  does not return thumbnailUrls for categories. */
const PALETTE = [
  { gradient: 'from-red-900 via-red-800 to-red-950',       icon: '🎬', accent: 'text-red-400',     badge: 'bg-red-500/20 text-red-400 ring-red-500/30' },
  { gradient: 'from-blue-900 via-blue-800 to-blue-950',     icon: '🎭', accent: 'text-blue-400',    badge: 'bg-blue-500/20 text-blue-400 ring-blue-500/30' },
  { gradient: 'from-purple-900 via-purple-800 to-purple-950', icon: '🚀', accent: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-400 ring-purple-500/30' },
  { gradient: 'from-orange-900 via-orange-800 to-orange-950', icon: '👻', accent: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 ring-orange-500/30' },
  { gradient: 'from-emerald-900 via-emerald-800 to-emerald-950', icon: '😂', accent: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30' },
  { gradient: 'from-cyan-900 via-cyan-800 to-cyan-950',     icon: '🎥', accent: 'text-cyan-400',    badge: 'bg-cyan-500/20 text-cyan-400 ring-cyan-500/30' },
  { gradient: 'from-pink-900 via-pink-800 to-pink-950',     icon: '💕', accent: 'text-pink-400',    badge: 'bg-pink-500/20 text-pink-400 ring-pink-500/30' },
  { gradient: 'from-yellow-900 via-yellow-800 to-yellow-950', icon: '⚡', accent: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400 ring-yellow-500/30' },
];

interface CategoryCardProps {
  category: Category;
  index: number;
  videoCount: number;
}

const CategoryCard = ({ category, index, videoCount }: CategoryCardProps): JSX.Element => {
  const style = PALETTE[index % PALETTE.length];
  return (
    <Link
      to={`/browse?category=${category.categoryName}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-white/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
    >
      {/* Gradient hero area */}
      <div className={`relative h-44 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-700" />

        {/* Large icon */}
        <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-300 relative z-10">
          {style.icon}
        </span>

        {/* "Browse →" hover button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
            Browse <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="flex-1 flex flex-col gap-2 bg-card p-4 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-foreground text-lg leading-tight">{category.categoryName}</h3>
          {/* Video count badge */}
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${style.badge}`}>
            {videoCount} titles
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
};

const CategoriesPage = (): JSX.Element => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return mockCategories;
    const q = query.toLowerCase();
    return mockCategories.filter(
      (c) =>
        c.categoryName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [query]);

  /** Count how many mock videos fall into each category */
  const countForCategory = (name: string) =>
    mockVideos.filter((v) => v.genre === name).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Page Header */}
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

        {/* Search bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="categories-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories…"
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-6 mb-10 text-sm text-muted-foreground">
          <span>
            <span className="font-bold text-foreground">{mockCategories.length}</span> total categories
          </span>
          <span>
            <span className="font-bold text-foreground">{mockVideos.length}</span> titles available
          </span>
        </div>

        {/* Category Grid */}
        {filtered.length > 0 ? (
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
          /* Empty state */
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
