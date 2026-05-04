import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Star, Clock, Calendar, Eye, ChevronLeft } from 'lucide-react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import VideoCard from '@/shared/components/VideoCard';
import CategoryChip from '@/shared/components/CategoryChip';
import { mockVideos } from '@/shared/utils/mockData';

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatViews = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
};

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const video = mockVideos.find((v) => v.id === id) ?? mockVideos[0];

  // Similar: same genre, exclude current
  const similar = mockVideos.filter((v) => v.genre === video.genre && v.id !== video.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Browse
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Left: Thumbnail / Preview */}
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted shadow-2xl shadow-black/50">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer hover:bg-black/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-xl shadow-primary/40 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <CategoryChip label={video.genre} active />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-3">
              {video.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
              <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                <Star className="w-4 h-4 fill-yellow-400" />
                {video.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDuration(video.duration)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(video.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {formatViews(video.viewCount)} views
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {video.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-auto">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
                <Play className="w-5 h-5 fill-white" />
                Watch Now
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border hover:border-white/20 text-foreground font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                <Plus className="w-5 h-5" />
                Watchlist
              </button>
            </div>
          </div>
        </div>

        {/* Similar Videos */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-5">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similar.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Preview */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-5">Audience Reviews</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Alex M.', rating: 9, text: 'Absolutely gripping from start to finish. A must-watch!' },
              { name: 'Jordan K.', rating: 8, text: 'Great cinematography and strong performances throughout.' },
              { name: 'Sam R.', rating: 10, text: 'One of the best films I\'ve seen all year. Incredible.' },
            ].map((review) => (
              <div key={review.name} className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-foreground">{review.name}</span>
                  <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {review.rating}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VideoDetailPage;
