import { TrendingUp } from 'lucide-react';
import VideoCard from '@/shared/components/VideoCard';
import { mockVideos } from '@/shared/utils/mockData';

const TrendingSection = (): JSX.Element => {
  // Sort by view count for "trending"
  const trending = [...mockVideos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Trending Now</h2>
          <p className="text-muted-foreground mt-0.5">Most watched this week</p>
        </div>
      </div>

      {/* Horizontal scroll on mobile, grid on tablet+ */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {trending.map((video, index) => (
          <div key={video.id} className="relative shrink-0 w-64 sm:w-auto">
            {/* Rank number overlay */}
            <span className="absolute -left-2 -top-2 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary/40">
              {index + 1}
            </span>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
