import { Link } from 'react-router-dom';
import { mockCategories } from '@/shared/utils/mockData';

/** Accent colors for category cards (cycling) */
const categoryColors = [
  'from-red-900/60 to-red-950',
  'from-blue-900/60 to-blue-950',
  'from-purple-900/60 to-purple-950',
  'from-orange-900/60 to-orange-950',
  'from-emerald-900/60 to-emerald-950',
  'from-cyan-900/60 to-cyan-950',
];

const CategorySection = (): JSX.Element => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Popular Categories</h2>
        <p className="text-muted-foreground mt-1">Find exactly what you're in the mood for</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {mockCategories.map((category, index) => (
          <Link
            key={category.id}
            to={`/browse?category=${category.name}`}
            className="group relative rounded-xl overflow-hidden aspect-video cursor-pointer"
          >
            {/* Background image */}
            <img
              src={category.thumbnailUrl}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b ${categoryColors[index % categoryColors.length]} opacity-75 group-hover:opacity-90 transition-opacity`} />
            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg text-center drop-shadow-lg group-hover:scale-105 transition-transform">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
