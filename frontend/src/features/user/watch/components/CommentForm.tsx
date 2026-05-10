import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

const maxCommentLength = 2000;

const schema = z.object({
  content: z.string().trim().min(1, 'Comment is required').max(maxCommentLength, `Keep comments under ${maxCommentLength} characters`),
});

type CommentFormData = z.infer<typeof schema>;

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(schema),
    defaultValues: { content: '' },
  });
  const content = watch('content') || '';

  const submit = async ({ content }: CommentFormData) => {
    await onSubmit(content.trim());
    reset();
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submit)}>
      <Textarea
        {...register('content')}
        aria-label="Comment"
        placeholder="Add a comment..."
        className="min-h-28 resize-none border-white/10 bg-zinc-950 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
        maxLength={maxCommentLength}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs">
          {errors.content ? (
            <span className="text-rose-400">{errors.content.message}</span>
          ) : (
            <span className="text-gray-500">{content.length}/{maxCommentLength}</span>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90">
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};
