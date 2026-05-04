import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Film, 
  Tags, 
  BarChart3, 
  History, 
  Settings,
  Tv
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Manage Users', icon: Users, href: '/admin/users' },
  { label: 'Manage Videos', icon: Film, href: '/admin/videos' },
  { label: 'Categories', icon: Tags, href: '/admin/categories' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Audit Logs', icon: History, href: '/admin/logs' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
          <Tv className="w-8 h-8" />
          <span>VIEWIX</span>
          <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-1 font-medium tracking-normal">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-white" : "text-gray-400 group-hover:text-white"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate">admin@viewix.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
