import { Link } from 'react-router-dom';
import { mockCategories } from '@/shared/utils/mockData';

/**
 * Icon emojis used as visual stand-ins since the backend does not return thumbnailUrls.
 * Cycled by category index to keep it colorful without hardcoding per category.
 */
const categoryColors = [
  { gradient: 'from-red-900/80 to-red-950/90',     ring: 'ring-red-500/30',     icon: '🎬' },
  { gradient: 'from-blue-900/80 to-blue-950/90',   ring: 'ring-blue-500/30',   icon: '🎭' },
  { gradient: 'from-purple-900/80 to-purple-950/90', ring: 'ring-purple-500/30', icon: '🚀' },
  { gradient: 'from-orange-900/80 to-orange-950/90', ring: 'ring-orange-500/30', icon: '👻' },
  { gradient: 'from-emerald-900/80 to-emerald-950/90', ring: 'ring-emerald-500/30', icon: '😂' },
  { gradient: 'from-cyan-900/80 to-cyan-950/90',   ring: 'ring-cyan-500/30',   icon: '🎥' },
];

const CategorySection = () => {
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
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {mockCategories.map((category, index) => {
          const style = categoryColors[index % categoryColors.length];
          return (
            <Link
              key={category.id}
              to={`/browse?category=${category.categoryName}`}
              className={`group relative rounded-xl overflow-hidden aspect-video cursor-pointer ring-1 ${style.ring} hover:ring-2 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              {/* Gradient background (no image — backend has no thumbnailUrl) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {style.icon}
                </span>
                <span className="text-white font-bold text-sm text-center drop-shadow-lg">
                  {category.categoryName}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
