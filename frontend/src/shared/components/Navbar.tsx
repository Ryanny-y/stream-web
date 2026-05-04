// Placement: shared/components — Navbar appears on ALL pages (guest, user, admin)
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Menu, X, User, Heart, Bookmark, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/shared/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

interface NavLink {
  label: string;
  to: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Browse', to: '/browse' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Show solid background once user scrolls past hero
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isMobileOpen
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              View<span className="text-primary">ix</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  // Exact match for '/', prefix match for everything else
                  (link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to))
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none">
                    <span className="text-sm font-medium text-gray-200">
                      {user?.fullName.split(' ')[0]}
                    </span>
                    <Avatar className="w-8 h-8 border border-white/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {user ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 bg-background/95 backdrop-blur-md border-border">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  {user?.roles.includes('ADMIN') && (
                    <DropdownMenuItem 
                      className="cursor-pointer focus:bg-primary/10 focus:text-primary text-primary/90"
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      <Film className="mr-2 h-4 w-4" />
                      <span className="font-semibold">Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <Heart className="mr-2 h-4 w-4 text-primary" />
                    <span>My Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <Bookmark className="mr-2 h-4 w-4 text-blue-500" />
                    <span>My Watchlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isMobileOpen ? 'max-h-screen pb-4' : 'max-h-0'
        )}
      >
        <nav className="px-4 pt-2 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                (link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to))
                  ? 'text-white bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              )}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <Avatar className="w-10 h-10 border border-white/20">
                    <AvatarFallback className="bg-primary text-white">
                      {user ? getInitials(user.fullName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{user?.fullName}</span>
                    <span className="text-xs text-gray-400">{user?.email}</span>
                  </div>
                </div>
                {user?.roles.includes('ADMIN') && (
                  <Link to="/admin/dashboard" className="px-4 py-3 text-sm font-semibold text-primary flex items-center gap-2">
                    <Film className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link to="/favorites" className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" /> My Favorites
                </Link>
                <Link to="/watchlist" className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-500" /> My Watchlist
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm font-medium text-left text-red-400 hover:text-red-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white border border-border rounded-lg hover:border-white/20 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-3 text-sm font-semibold text-center text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
