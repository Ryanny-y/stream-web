import React from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { getInitials, resolveProfileImage } from '../utils';

interface AvatarUploaderProps {
  fullName: string;
  profileImage?: string | null;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  fullName,
  profileImage,
  previewUrl,
  onFileSelect,
  onRemove,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const imageUrl = previewUrl || resolveProfileImage(profileImage);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
      <Avatar className="h-24 w-24 border border-white/10 ring-4 ring-primary/10">
        <AvatarImage src={imageUrl} />
        <AvatarFallback className="bg-primary text-2xl font-bold text-white">{getInitials(fullName)}</AvatarFallback>
      </Avatar>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => inputRef.current?.click()} className="bg-primary hover:bg-primary/90 text-white">
            <Camera className="mr-2 h-4 w-4" /> Change Avatar
          </Button>
          <Button type="button" variant="outline" onClick={onRemove} className="border-white/10 bg-white/5 text-gray-200">
            <Trash2 className="mr-2 h-4 w-4" /> Remove Avatar
          </Button>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, or GIF. Maximum size 2MB.</p>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      </div>
    </div>
  );
};
