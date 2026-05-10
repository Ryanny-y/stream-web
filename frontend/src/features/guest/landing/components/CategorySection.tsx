import { Link } from 'react-router-dom';
import { Film, Flame, Laugh, Rocket, Theater, Video } from 'lucide-react';
import type { Category } from '@/shared/types/api';

const categoryColors = [
  { gradient: 'from-red-900/80 to-red-950/90', ring: 'ring-red-500/30', Icon: Film },
  { gradient: 'from-blue-900/80 to-blue-950/90', ring: 'ring-blue-500/30', Icon: Theater },
  { gradient: 'from-purple-900/80 to-purple-950/90', ring: 'ring-purple-500/30', Icon: Rocket },
  { gradient: 'from-orange-900/80 to-orange-950/90', ring: 'ring-orange-500/30', Icon: Flame },
  { gradient: 'from-emerald-900/80 to-emerald-950/90', ring: 'ring-emerald-500/30', Icon: Laugh },
  { gradient: 'from-cyan-900/80 to-cyan-950/90', ring: 'ring-cyan-500/30', Icon: Video },
];

interface CategorySectionProps {
  categories: Category[];
  isLoading: boolean;
}

const CategorySection = ({ categories, isLoading }: CategorySectionProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Popular Categories</h2>
          <p className="text-muted-foreground mt-1">Find exactly what you're in the mood for</p>
        </div>
        <Link
          to="/categories"
          className="text-sm text-primary font-medium hover:underline hidden sm:block"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-video rounded-xl bg-muted animate-pulse" />
          ))}
        {!isLoading &&
          categories.slice(0, 6).map((category, index) => {
            const style = categoryColors[index % categoryColors.length];
            const Icon = style.Icon;
            return (
              <Link
                key={category.id}
                to={`/browse?category=${encodeURIComponent(category.categoryName)}`}
                className={`group relative rounded-xl overflow-hidden aspect-video cursor-pointer ring-1 ${style.ring} hover:ring-2 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <Icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-white font-bold text-sm text-center drop-shadow-lg">
                    {category.categoryName}
                  </span>
                </div>
              </Link>
            );
          })}
      </div>
      {!isLoading && categories.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">No categories are published yet.</p>
      )}
    </section>
  );
};

export default CategorySection;
