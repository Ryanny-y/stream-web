import React from 'react';
import { ArrowUpDown, Eye, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import type { DisplayLog } from '../types';
import { formatDateTime } from '../utils';
import { ActionBadge, RoleBadge, StatusBadge } from './Badges';

interface AuditLogTableProps {
  logs: DisplayLog[];
  onView: (log: DisplayLog) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onView }) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead>
              <span className="inline-flex items-center gap-2">Timestamp <ArrowUpDown className="w-3 h-3 text-gray-600" /></span>
            </TableHead>
            <TableHead>User/Admin</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="hidden md:table-cell">Module</TableHead>
            <TableHead className="hidden xl:table-cell">IP Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden 2xl:table-cell">Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-white/5 border-white/5 transition-colors">
              <TableCell>
                <span className="text-xs text-gray-400">{formatDateTime(log.timestamp)}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-white">{log.user}</span>
                  <span className="text-[11px] text-gray-500 truncate max-w-[120px]">{log.id}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-gray-400">{log.email}</TableCell>
              <TableCell><RoleBadge role={log.role} /></TableCell>
              <TableCell><ActionBadge action={log.action} /></TableCell>
              <TableCell className="hidden md:table-cell text-sm text-gray-300">{log.module}</TableCell>
              <TableCell className="hidden xl:table-cell text-xs text-gray-500">{log.ipAddress}</TableCell>
              <TableCell><StatusBadge status={log.status} /></TableCell>
              <TableCell className="hidden 2xl:table-cell">
                <p className="max-w-[280px] truncate text-sm text-gray-500">{log.details}</p>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 bg-zinc-950 border-white/10 text-white">
                    <DropdownMenuLabel>Log Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(log)} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" /> View Details
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
