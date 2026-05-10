import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import type { EditProfileFormData, UserProfile } from '../types';

const schema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  username: z.string().trim().min(1, 'Username is required'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or fewer').optional(),
});

interface EditProfileFormProps {
  profile: UserProfile;
  isSubmitting: boolean;
  onSubmit: (data: EditProfileFormData) => void | Promise<void>;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, isSubmitting, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      username: profile.username,
      phone: profile.phone || '',
      bio: profile.bio || '',
    },
  });

  React.useEffect(() => {
    reset({
      fullName: profile.fullName,
      email: profile.email,
      username: profile.username,
      phone: profile.phone || '',
      bio: profile.bio || '',
    });
  }, [profile, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Update your account information and public identity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" className="bg-zinc-950 border-white/10" {...register('fullName')} />
          {errors.fullName && <p className="text-xs text-rose-500">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" className="bg-zinc-950 border-white/10" {...register('username')} />
          {errors.username && <p className="text-xs text-rose-500">{errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="bg-zinc-950 border-white/10" {...register('email')} />
          {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" className="bg-zinc-950 border-white/10" {...register('phone')} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" className="bg-zinc-950 border-white/10 min-h-[120px] resize-none" {...register('bio')} />
          {errors.bio && <p className="text-xs text-rose-500">{errors.bio.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => reset()} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>Save Changes</Button>
      </div>
    </form>
  );
};
