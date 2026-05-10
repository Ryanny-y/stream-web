import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { ChangePasswordFormData } from '../types';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

interface ChangePasswordFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ChangePasswordFormData) => void | Promise<void>;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ isSubmitting, onSubmit }) => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const submit = async (data: ChangePasswordFormData) => {
    await onSubmit(data);
    reset();
  };

  const passwordInput = (
    id: keyof ChangePasswordFormData,
    label: string,
    show: boolean,
    setShow: (show: boolean) => void,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} type={show ? 'text' : 'password'} className="bg-zinc-950 border-white/10 pr-10" {...register(id)} />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {errors[id] && <p className="text-xs text-rose-500">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(submit)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Change Password</h2>
        <p className="text-sm text-gray-500 mt-1">Keep your account secure with a strong password.</p>
      </div>
      <div className="space-y-4">
        {passwordInput('currentPassword', 'Current Password', showCurrent, setShowCurrent)}
        {passwordInput('newPassword', 'New Password', showNew, setShowNew)}
        <PasswordStrengthIndicator password={watch('newPassword')} />
        {passwordInput('confirmPassword', 'Confirm New Password', showConfirm, setShowConfirm)}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => reset()} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>Update Password</Button>
      </div>
    </form>
  );
};
