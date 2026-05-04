// Placement: shared/components — used in landing, browse, and video detail pages (3+ features)
import { cn } from '@/shared/lib/utils';

interface CategoryChipProps {
  label: string;
  /** Whether this category is currently active/selected */
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const CategoryChip = ({ label, active = false, onClick, className }: CategoryChipProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
        'border',
        active
          ? 'bg-primary border-primary text-white shadow-md shadow-primary/30'
          : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
        className
      )}
    >
      {label}
    </button>
  );
};

export default CategoryChip;
