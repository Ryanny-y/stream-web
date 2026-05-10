import React from 'react';
import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { getInitials, resolveProfileImage } from '../../profile/utils';
import type { Comment } from '../types';

const formatTimestamp = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));

interface CommentCardProps {
  comment: Comment;
  canDelete: boolean;
  onDelete: (comment: Comment) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, canDelete, onDelete }) => {
  const username = comment.username || 'Viewer';

  return (
    <article className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
      <Avatar className="h-10 w-10 border border-white/10">
        <AvatarImage src={resolveProfileImage(comment.profileImage)} alt={username} className="object-cover" />
        <AvatarFallback className="bg-primary/15 text-primary">{getInitials(username)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-white">{username}</h3>
          <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
            {formatTimestamp(comment.createdAt)}
          </time>
        </div>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">{comment.commentText}</p>
      </div>
      {canDelete && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 shrink-0 text-gray-500 hover:bg-rose-500/10 hover:text-rose-300"
          onClick={() => onDelete(comment)}
          aria-label="Delete comment"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </article>
  );
};
