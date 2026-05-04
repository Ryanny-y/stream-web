// Placement: shared/components — Navbar appears on ALL pages (guest, user, admin)
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface NavLink {
  label: string;
  to: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Browse', to: '/browse' },
  { label: 'Categories', to: '/browse?view=categories' },
  { label: 'About', to: '/about' },
];

const Navbar = (): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

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
                  location.pathname === link.to
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
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
                location.pathname === link.to
                  ? 'text-white bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
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
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
