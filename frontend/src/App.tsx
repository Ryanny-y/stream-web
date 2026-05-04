import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/features/guest/landing/LandingPage';
import BrowsePage from '@/features/guest/browse/BrowsePage';
import VideoDetailPage from '@/features/guest/videoDetail/VideoDetailPage';
import LoginPage from '@/features/guest/auth/pages/LoginPage';
import RegisterPage from '@/features/guest/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/features/guest/auth/pages/ForgotPasswordPage';
import AboutPage from '@/features/guest/about/AboutPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest / Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/videos/:id" element={<VideoDetailPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Fallback: redirect unknown routes to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
