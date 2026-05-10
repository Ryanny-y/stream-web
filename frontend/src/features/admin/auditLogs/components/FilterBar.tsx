import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { LogAction, LogFilters, LogRole, LogStatus } from '../types';
import { DateRangePicker } from './DateRangePicker';

interface FilterBarProps {
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const update = (patch: Partial<LogFilters>) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_180px_190px_160px_280px] gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={filters.searchTerm}
            onChange={(event) => update({ searchTerm: event.target.value })}
            placeholder="Search by user, email, action..."
            className="pl-10 bg-zinc-950 border-white/10 focus-visible:ring-primary/50"
          />
        </div>
        <Select value={filters.role} onValueChange={(value) => update({ role: value as 'ALL' | LogRole })}>
          <SelectTrigger className="bg-zinc-950 border-white/10">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="CONTENT_MANAGER">Content Manager</SelectItem>
            <SelectItem value="USER">Subscriber/User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.action} onValueChange={(value) => update({ action: value as 'ALL' | LogAction })}>
          <SelectTrigger className="bg-zinc-950 border-white/10">
            <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="LOGOUT">Logout</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="UPLOAD">Upload</SelectItem>
            <SelectItem value="ROLE_CHANGE">Role Change</SelectItem>
            <SelectItem value="FAILED_LOGIN">Failed Login</SelectItem>
            <SelectItem value="SUSPEND_USER">Suspend User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(value) => update({ status: value as 'ALL' | LogStatus })}>
          <SelectTrigger className="bg-zinc-950 border-white/10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="SUCCESS">Success</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="WARNING">Warning</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(startDate) => update({ startDate })}
          onEndDateChange={(endDate) => update({ endDate })}
        />
      </div>
    </div>
  );
};
