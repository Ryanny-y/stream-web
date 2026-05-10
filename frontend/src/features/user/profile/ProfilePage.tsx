import React from 'react';
import { Clock, Heart, ListVideo, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../dashboard/components/UserNavbar';
import { UserSidebar } from '../dashboard/components/UserSidebar';
import type { ChangePasswordFormData, EditProfileFormData, UserProfile } from './types';
import {
  changeMyPassword,
  getMyProfile,
  removeMyAvatar,
  updateMyAvatar,
  updateMyProfile,
} from './profileService';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import { EditProfileForm } from './components/EditProfileForm';
import { ChangePasswordForm } from './components/ChangePasswordForm';
import { AccountStatsCard } from './components/AccountStatsCard';
import { SecurityCard } from './components/SecurityCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { useAuth } from '@/shared/lib/auth-context';

const ProfilePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadProfile = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      setProfile(await getMyProfile());
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load profile' });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadProfile();
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, []);

  const handleAvatarSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Avatar must be an image file' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Avatar must be 2MB or smaller' });
      return;
    }

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setIsSubmitting(true);
    try {
      setProfile(await updateMyAvatar(file));
      setMessage({ type: 'success', text: 'Avatar updated' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update avatar' });
    } finally {
      setIsSubmitting(false);
      URL.revokeObjectURL(preview);
      setAvatarPreview(null);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsSubmitting(true);
    try {
      setProfile(await removeMyAvatar());
      setMessage({ type: 'success', text: 'Avatar removed' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove avatar' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (data: EditProfileFormData) => {
    setIsSubmitting(true);
    try {
      setProfile(await updateMyProfile(data));
      setMessage({ type: 'success', text: 'Profile updated' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      await changeMyPassword(data.currentPassword, data.newPassword);
      setMessage({ type: 'success', text: 'Password updated' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoutAll = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UserNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="space-y-8 px-4 py-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
          <p className="mt-1 text-gray-400">Manage your account, avatar, and security settings.</p>
        </div>

        {message && (
          <div className={`rounded-xl border p-4 text-sm ${
            message.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
          }`}>
            {message.text}
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : !profile ? (
          <EmptyState message="Profile could not be loaded." />
        ) : (
          <>
            <ProfileHeaderCard
              profile={profile}
              previewUrl={avatarPreview}
              onFileSelect={handleAvatarSelect}
              onRemoveAvatar={handleRemoveAvatar}
            />

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <AccountStatsCard label="Videos Watched" value={profile.videosWatched || 0} icon={PlayCircle} />
              <AccountStatsCard label="Watchlist Count" value={profile.watchlistCount || 0} icon={ListVideo} />
              <AccountStatsCard label="Favorites Count" value={profile.favoritesCount || 0} icon={Heart} />
              <AccountStatsCard label="Total Watch Hours" value={profile.totalWatchHours || 0} icon={Clock} />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
              <EditProfileForm profile={profile} isSubmitting={isSubmitting} onSubmit={handleProfileSubmit} />
              <div className="space-y-6">
                <ChangePasswordForm isSubmitting={isSubmitting} onSubmit={handlePasswordSubmit} />
                <SecurityCard profile={profile} onLogoutAll={logoutAll} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
