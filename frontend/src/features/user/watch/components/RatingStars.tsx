import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  disabled = false,
  size = 'md',
  label = 'Rate this video',
}) => {
  const [hoverValue, setHoverValue] = React.useState(0);
  const activeValue = hoverValue || value;
  const interactive = Boolean(onChange) && !disabled;

  return (
    <div className="inline-flex items-center gap-1" role={interactive ? 'radiogroup' : 'img'} aria-label={label}>
      {[1, 2, 3, 4, 5].map((rating) => {
        const isActive = rating <= activeValue;
        return (
          <button
            key={rating}
            type="button"
            className={cn(
              'rounded-sm text-gray-600 transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              interactive && 'hover:scale-110 hover:text-amber-300',
              isActive && 'text-amber-400',
              disabled && 'cursor-not-allowed opacity-60',
            )}
            disabled={!interactive}
            role={interactive ? 'radio' : undefined}
            aria-checked={interactive ? value === rating : undefined}
            aria-label={`${rating} star${rating === 1 ? '' : 's'}`}
            onMouseEnter={() => interactive && setHoverValue(rating)}
            onMouseLeave={() => interactive && setHoverValue(0)}
            onFocus={() => interactive && setHoverValue(rating)}
            onBlur={() => interactive && setHoverValue(0)}
            onClick={() => onChange?.(rating)}
          >
            <Star className={cn(sizes[size], isActive && 'fill-current')} />
          </button>
        );
      })}
    </div>
  );
};
