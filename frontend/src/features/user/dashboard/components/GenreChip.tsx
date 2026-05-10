import React from 'react';

export const GenreChip: React.FC<{ genre?: string }> = ({ genre }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[11px] font-medium text-gray-200">
    {genre || 'Featured'}
  </span>
);
