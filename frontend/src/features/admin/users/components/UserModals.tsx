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
import type { AdminUser, AdminRole, UserStatus } from '../types';
import { ShieldAlert } from 'lucide-react';

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
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      roles: ['USER'],
      status: 'ACTIVE',
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phone: user.phone || '',
          roles: user.roles,
          status: user.status,
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          phone: '',
          roles: ['USER'],
          status: 'ACTIVE',
          password: '',
        });
      }
    }
  }, [user, isOpen, reset]);

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
              <Input id="firstName" placeholder="e.g. John" {...register('firstName')} className="bg-zinc-900 border-white/10" />
              {errors.firstName && <p className="text-xs text-rose-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="e.g. Doe" {...register('lastName')} className="bg-zinc-900 border-white/10" />
              {errors.lastName && <p className="text-xs text-rose-500">{errors.lastName.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="johndoe123" {...register('username')} className="bg-zinc-900 border-white/10" />
              {errors.username && <p className="text-xs text-rose-500">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" {...register('phone')} className="bg-zinc-900 border-white/10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" {...register('email')} className="bg-zinc-900 border-white/10" />
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
