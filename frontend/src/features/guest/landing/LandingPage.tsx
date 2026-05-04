import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import HeroSection from './components/HeroSection';
import FeaturedCarousel from './components/FeaturedCarousel';
import TrendingSection from './components/TrendingSection';
import CategorySection from './components/CategorySection';
import WhyChooseUsSection from './components/WhyChooseUsSection';

/** 
 * Main landing page for guest users.
 * Composed of self-contained section components to keep this file lean.
 */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCarousel />
        <TrendingSection />
        <CategorySection />
        <WhyChooseUsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
