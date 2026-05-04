import { Link } from 'react-router-dom';
import { Play, Film } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&q=80"
          alt="Hero background"
          className="w-full h-full object-cover scale-105"
        />
        {/* Multi-layer dark gradient for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <Film className="w-3.5 h-3.5" />
            Premium Streaming
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Unlimited Movies,{' '}
            <span className="text-primary">Shows</span>, and{' '}
            <span className="relative">
              Streaming
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/60 rounded-full" />
            </span>{' '}
            Entertainment
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-xl">
            Discover thousands of movies, series, and documentaries in stunning quality. 
            Your next binge starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-white" />
              Watch Now
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold text-base rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Browse Library
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12">
            {[
              { label: 'Titles', value: '10,000+' },
              { label: 'HD Quality', value: '4K' },
              { label: 'Daily Viewers', value: '500K+' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
