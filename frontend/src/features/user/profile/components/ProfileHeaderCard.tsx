import React from 'react';
import type { UserProfile } from '../types';
import { AvatarUploader } from './AvatarUploader';
import { formatDate } from '../utils';

interface ProfileHeaderCardProps {
  profile: UserProfile;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemoveAvatar: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  profile,
  previewUrl,
  onFileSelect,
  onRemoveAvatar,
}) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <AvatarUploader
        fullName={profile.fullName}
        profileImage={profile.profileImage}
        previewUrl={previewUrl}
        onFileSelect={onFileSelect}
        onRemove={onRemoveAvatar}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:min-w-[480px]">
        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
          <p className="text-xs text-gray-500">Full Name</p>
          <p className="mt-1 font-semibold text-white">{profile.fullName}</p>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
          <p className="text-xs text-gray-500">Email</p>
          <p className="mt-1 font-semibold text-white truncate">{profile.email}</p>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
          <p className="text-xs text-gray-500">Membership</p>
          <p className="mt-1 font-semibold text-white">{profile.roles.join(', ') || 'USER'}</p>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/5 p-4 sm:col-span-3">
          <p className="text-xs text-gray-500">Join Date</p>
          <p className="mt-1 font-semibold text-white">{formatDate(profile.createdAt)}</p>
        </div>
      </div>
    </div>
  </section>
);
