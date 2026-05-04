import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import type { AdminUser, AdminRole, UserStatus } from '../types';
import { RoleBadge, StatusBadge } from './Badges';
import { Calendar, Clock, PlayCircle, Heart, Bookmark, User as UserIcon, Phone, Mail, ShieldAlert } from 'lucide-react';

// Form Schemas
const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  roles: z.array(z.enum(['ADMIN', 'USER', 'CONTENT_MANAGER'])).min(1, 'Select at least one role'),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

type UserFormData = z.infer<typeof userSchema>;

// 1. User Form Modal (Add/Edit)
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: AdminUser | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user 
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
      status: user.status,
    } : {
      roles: ['USER'],
      status: 'ACTIVE',
    }
  });

  const selectedRoles = watch('roles');
  const selectedStatus = watch('status');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User Account' : 'Register New Admin User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Modify existing user profile and access levels.' : 'Create a new administrative or platform user.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} className="bg-zinc-900 border-white/10" />
              {errors.firstName && <p className="text-xs text-rose-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} className="bg-zinc-900 border-white/10" />
              {errors.lastName && <p className="text-xs text-rose-500">{errors.lastName.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register('username')} className="bg-zinc-900 border-white/10" />
              {errors.username && <p className="text-xs text-rose-500">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" {...register('phone')} className="bg-zinc-900 border-white/10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register('email')} className="bg-zinc-900 border-white/10" />
            {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input id="password" type="password" {...register('password')} className="bg-zinc-900 border-white/10" />
              {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Role</Label>
              <Select 
                value={selectedRoles[0]} 
                onValueChange={(v) => setValue('roles', [v as AdminRole])}
              >
                <SelectTrigger className="bg-zinc-900 border-white/10">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10">
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="CONTENT_MANAGER">Content Manager</SelectItem>
                  <SelectItem value="USER">Standard User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account Status</Label>
              <Select value={selectedStatus} onValueChange={(v) => setValue('status', v as UserStatus)}>
                <SelectTrigger className="bg-zinc-900 border-white/10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              {user ? 'Update Profile' : 'Register User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// 2. User Details Modal
interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Full User Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-zinc-800 text-xl font-bold text-gray-400">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.roles.map(role => (
                  <RoleBadge key={role} role={role} />
                ))}
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          {/* Contact & Security Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Contact Info</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Mail className="w-3 h-3 text-primary" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Phone className="w-3 h-3 text-primary" />
                  <span>{user.phone || 'No phone'}</span>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Security</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Verified:</span>
                  <span className={user.emailVerified ? "text-emerald-500" : "text-rose-500"}>
                    {user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Failed attempts:</span>
                  <span className="text-white">{user.failedAttempts}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 text-center">
              <PlayCircle className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-[10px] text-gray-500 uppercase font-bold">Videos</p>
              <p className="text-lg font-bold text-white">{user.videosWatched || 0}</p>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <p className="text-[10px] text-gray-500 uppercase font-bold">Time</p>
              <p className="text-lg font-bold text-white">{user.totalWatchTime || '0h'}</p>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 text-center">
              <Heart className="w-4 h-4 mx-auto mb-1 text-rose-500" />
              <p className="text-[10px] text-gray-500 uppercase font-bold">Favs</p>
              <p className="text-lg font-bold text-white">{user.favoritesCount || 0}</p>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 text-center">
              <Bookmark className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <p className="text-[10px] text-gray-500 uppercase font-bold">List</p>
              <p className="text-lg font-bold text-white">{user.watchlistCount || 0}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Account Created
              </span>
              <span className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Last Modified
              </span>
              <span className="text-white font-medium">{new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white border-white/10">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 3. Confirm Delete Dialog
interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  userName 
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Confirm Account Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to permanently delete <span className="text-white font-bold">{userName}</span>? 
            This will wipe their login credentials, viewing history, and all personal data from the system.
            <br /><br />
            <span className="text-rose-400 font-medium">This action cannot be reversed.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-rose-500 hover:bg-rose-600 text-white border-transparent"
          >
            Permanently Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
