import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { AdminCategory, CategoryFormData, CategoryStatus } from '../types';

const categorySchema = z.object({
  categoryName: z.string().trim().min(1, 'Category name is required').max(100, 'Category name must be 100 characters or fewer'),
  description: z.string().trim().min(1, 'Description is required'),
  status: z.enum(['ACTIVE', 'HIDDEN']),
});

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void | Promise<void>;
  category?: AdminCategory | null;
  existingNames: string[];
  isSubmitting?: boolean;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  existingNames,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      description: '',
      status: 'ACTIVE',
    },
  });

  React.useEffect(() => {
    if (!isOpen) return;

    reset({
      categoryName: category?.categoryName || '',
      description: category?.description || '',
      status: category?.status || 'ACTIVE',
    });
  }, [category, isOpen, reset]);

  const selectedStatus = watch('status');

  const submit = async (data: CategoryFormData) => {
    const normalized = data.categoryName.trim().toLowerCase();
    const currentName = category?.categoryName.trim().toLowerCase();
    const isDuplicate = existingNames.some((name) => name.trim().toLowerCase() === normalized && name.trim().toLowerCase() !== currentName);

    if (isDuplicate) {
      setError('categoryName', { type: 'validate', message: 'Category name must be unique' });
      return;
    }

    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] bg-zinc-950 border-white/10">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Update genre metadata and visibility.' : 'Create a new genre for organizing platform videos.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="e.g. Sci-Fi"
              className="bg-zinc-900 border-white/10"
              {...register('categoryName')}
            />
            {errors.categoryName && <p className="text-xs text-rose-500">{errors.categoryName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe how this category should be used..."
              className="bg-zinc-900 border-white/10 min-h-[120px] resize-none"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setValue('status', value as CategoryStatus)}>
              <SelectTrigger className="bg-zinc-900 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="HIDDEN">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
              {category ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
