import React from 'react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionTo?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, actionTo }) => (
  <div className="flex items-center justify-between gap-4">
    <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="text-sm font-medium text-primary hover:text-primary/80">
        {actionLabel}
      </Link>
    )}
  </div>
);
