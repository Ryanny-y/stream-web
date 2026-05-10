import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick }) => (
  <Button
    type="button"
    variant="outline"
    onClick={onClick}
    className="border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white"
  >
    <Icon className="mr-2 h-4 w-4" />
    {label}
  </Button>
);
