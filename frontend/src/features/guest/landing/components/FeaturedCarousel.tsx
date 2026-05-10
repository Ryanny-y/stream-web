import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from '@/shared/components/VideoCard';
import type { VideoSummary } from '@/shared/types/api';

interface FeaturedCarouselProps {
  videos: VideoSummary[];
  isLoading: boolean;
}

const FeaturedCarousel = ({ videos, isLoading }: FeaturedCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = (): void => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right'): void => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -480 : 480;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Content</h2>
          <p className="text-muted-foreground mt-1">Hand-picked top-rated titles</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-card border border-border hover:border-primary/50 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-card border border-border hover:border-primary/50 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="snap-start shrink-0 w-72 sm:w-80">
              <div className="aspect-video rounded-xl bg-muted animate-pulse" />
              <div className="mt-3 h-4 w-3/4 rounded bg-muted animate-pulse" />
            </div>
          ))}
        {!isLoading && videos.map((video) => (
          <div key={video.id} className="snap-start shrink-0 w-72 sm:w-80">
            <VideoCard video={video} />
          </div>
        ))}
      </div>
      {!isLoading && videos.length === 0 && (
        <p className="text-sm text-muted-foreground">No featured videos are published yet.</p>
      )}
    </section>
  );
};

export default FeaturedCarousel;
