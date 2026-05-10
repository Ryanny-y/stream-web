import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick, active = false }) => (
  <Button
    type="button"
    variant="outline"
    onClick={onClick}
    aria-pressed={active}
    className={`border-white/10 ${
      active
        ? 'bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary'
        : 'bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white'
    }`}
  >
    <Icon className={`mr-2 h-4 w-4 ${active ? 'fill-current' : ''}`} />
    {label}
  </Button>
);
