import { useEffect, useState } from 'react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import HeroSection from './components/HeroSection';
import FeaturedCarousel from './components/FeaturedCarousel';
import TrendingSection from './components/TrendingSection';
import CategorySection from './components/CategorySection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import { getFeaturedVideos, getPublicCategories, getTrendingVideos } from '../publicService';
import type { Category, VideoSummary } from '@/shared/types/api';

/** 
 * Main landing page for guest users.
 * Composed of self-contained section components to keep this file lean.
 */
const LandingPage = () => {
  const [featuredVideos, setFeaturedVideos] = useState<VideoSummary[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<VideoSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [featured, trending, categoryData] = await Promise.all([
          getFeaturedVideos(),
          getTrendingVideos(),
          getPublicCategories(),
        ]);
        setFeaturedVideos(featured);
        setTrendingVideos(trending);
        setCategories(categoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load public content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          </div>
        )}
        <FeaturedCarousel videos={featuredVideos} isLoading={isLoading} />
        <TrendingSection videos={trendingVideos} isLoading={isLoading} />
        <CategorySection categories={categories} isLoading={isLoading} />
        <WhyChooseUsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
