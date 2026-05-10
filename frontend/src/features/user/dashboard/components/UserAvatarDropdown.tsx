import React from 'react';
import { LayoutDashboard, LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { useAuth } from '@/shared/lib/auth-context';

const initials = (name?: string) =>
  (name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const UserAvatarDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = Boolean(user?.roles.includes('ADMIN'));

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 hover:bg-transparent">
          <Avatar className="h-9 w-9 border border-white/10 ring-2 ring-primary/20 ring-offset-2 ring-offset-zinc-950">
            <AvatarFallback className="bg-primary text-white">{initials(user?.fullName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/dashboard')} className="gap-2 cursor-pointer text-primary focus:text-primary focus:bg-primary/10">
            <LayoutDashboard className="w-4 h-4" /> User Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2 cursor-pointer">
          <User className="w-4 h-4" /> My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Settings className="w-4 h-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="gap-2 text-primary focus:text-primary focus:bg-primary/10 cursor-pointer">
          <LogOut className="w-4 h-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
