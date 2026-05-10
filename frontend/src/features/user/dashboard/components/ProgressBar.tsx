import React from 'react';

export const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);
