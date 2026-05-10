import React from 'react';
import { Bell, Menu, Search, Tv } from 'lucide-react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { UserAvatarDropdown } from './UserAvatarDropdown';

const links = [
  { label: 'Search', to: '/search' },
  { label: 'Browse', to: '/browse' },
  { label: 'Watchlist', to: '/watchlist' },
  { label: 'Favorites', to: '/favorites' },
  { label: 'History', to: '/history' },
];

export const UserNavbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = search.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden text-gray-400 hover:text-white" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        <Link to="/dashboard" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
          <Tv className="w-8 h-8" />
          <span>VIEWIX</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <form className="relative hidden md:block w-72" onSubmit={submitSearch}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search videos..."
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary/50"
            type="search"
            aria-label="Search videos"
          />
        </form>
        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-zinc-950" />
        </Button>
        <UserAvatarDropdown />
      </div>
    </header>
  );
};
