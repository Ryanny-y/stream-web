import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import LandingPage from '@/features/guest/landing/LandingPage';
import BrowsePage from '@/features/guest/browse/BrowsePage';
import CategoriesPage from '@/features/guest/categories/CategoriesPage';
import VideoDetailPage from '@/features/guest/videoDetail/VideoDetailPage';
import LoginPage from '@/features/guest/auth/pages/LoginPage';
import RegisterPage from '@/features/guest/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/features/guest/auth/pages/ForgotPasswordPage';
import AboutPage from '@/features/guest/about/AboutPage';
import UserDashboardPage from '@/features/user/dashboard/UserDashboardPage';

// Admin Imports
import { AdminLayout } from '@/features/admin/layout/AdminLayout';
import { AdminDashboard } from '@/features/admin/dashboard/AdminDashboard';
import UserManagementPage from '@/features/admin/users/UserManagementPage';
import VideoManagementPage from '@/features/admin/videos/VideoManagementPage';
import CategoryManagementPage from '@/features/admin/categories/CategoryManagementPage';
import { AuditLogsPage, LoginLogsPage } from '@/features/admin/auditLogs/LogPages';

// Auth Imports
import { AuthProvider } from '@/shared/lib/auth-context';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

const App = () => {
  const userProtected = (children: ReactNode) => (
    <ProtectedRoute nonAdminOnly>
      {children}
    </ProtectedRoute>
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin routes - Protected */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="videos" element={<VideoManagementPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="login-logs" element={<LoginLogsPage />} />
            <Route path="logs" element={<AuditLogsPage />} />
          </Route>

          {/* Authenticated user routes */}
          <Route path="/dashboard" element={userProtected(<UserDashboardPage />)} />
          <Route path="/watchlist" element={userProtected(<UserDashboardPage />)} />
          <Route path="/favorites" element={userProtected(<UserDashboardPage />)} />
          <Route path="/history" element={userProtected(<UserDashboardPage />)} />
          <Route path="/profile" element={userProtected(<UserDashboardPage />)} />

          {/* Guest / Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
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
    </AuthProvider>
  );
};

export default App;
