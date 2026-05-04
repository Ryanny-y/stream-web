import React from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  ShieldAlert, 
  Trash2,
  Calendar,
  Clock,
  MailCheck,
  MailX
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import type { AdminUser } from '../types';
import { RoleBadge, StatusBadge } from './Badges';

interface UserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onStatusChange: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
  onDelete,
  onStatusChange 
}) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead className="w-[80px]">User</TableHead>
            <TableHead>Account Info</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Joined</TableHead>
            <TableHead className="hidden lg:table-cell">Security</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.userId} className="hover:bg-white/5 border-white/5 transition-colors group">
              <TableCell>
                <Avatar className="h-9 w-9 border border-white/10 ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="bg-zinc-800 text-xs font-bold text-gray-400">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-white">{user.firstName} {user.lastName}</span>
                  <span className="text-xs text-gray-500">@{user.username}</span>
                  <span className="text-[10px] text-gray-600 mt-0.5">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map(role => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    Last seen: {new Date(user.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {user.emailVerified ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <MailCheck className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <MailX className="w-3 h-3" /> Unverified
                      </span>
                    )}
                  </div>
                  {user.failedAttempts > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-500">
                      <ShieldAlert className="w-3 h-3" /> {user.failedAttempts} failed attempts
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-white/10 text-white">
                    <DropdownMenuLabel>User Management</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" /> Edit Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={() => onStatusChange(user)} className="cursor-pointer">
                      <ShieldAlert className="mr-2 h-4 w-4" /> 
                      {user.status === 'ACTIVE' ? 'Suspend Access' : 'Restore Access'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(user)}
                      className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Permanent Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
