import React from 'react';
import { Heart, History, Home, ListVideo, Search, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Search', to: '/search', icon: Search },
  { label: 'Watchlist', to: '/watchlist', icon: ListVideo },
  { label: 'Favorites', to: '/favorites', icon: Heart },
  { label: 'History', to: '/history', icon: History },
];

export const UserSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
    <aside className={cn(
      'fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-zinc-950 p-4 transition-transform lg:hidden',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-primary font-bold text-xl">VIEWIX</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400">
          <X className="w-5 h-5" />
        </Button>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);
