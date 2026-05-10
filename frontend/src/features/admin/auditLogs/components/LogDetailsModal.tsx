import React from 'react';
import { Clock, Globe2, Monitor, ShieldCheck, UserRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { DisplayLog } from '../types';
import { formatDateTime } from '../utils';
import { ActionBadge, RoleBadge, StatusBadge } from './Badges';

interface LogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: DisplayLog | null;
}

export const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px] bg-zinc-950 border-white/10">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">Log Details</DialogTitle>
              <p className="text-xs text-gray-500 mt-1">{log.id}</p>
            </div>
            <StatusBadge status={log.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="text-xs text-gray-500 flex items-center gap-2"><UserRound className="w-3.5 h-3.5 text-primary" /> User/Admin</p>
              <p className="mt-2 text-sm font-semibold text-white">{log.user}</p>
              <p className="text-xs text-gray-500 truncate">{log.email}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="text-xs text-gray-500 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> Role</p>
              <div className="mt-2"><RoleBadge role={log.role} /></div>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="text-xs text-gray-500 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" /> Timestamp</p>
              <p className="mt-2 text-sm text-white">{formatDateTime(log.timestamp)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/5 bg-zinc-900 p-4">
              <p className="text-xs text-gray-500">Action Performed</p>
              <div className="mt-2"><ActionBadge action={log.action} /></div>
            </div>
            <div className="rounded-lg border border-white/5 bg-zinc-900 p-4">
              <p className="text-xs text-gray-500">Module Affected</p>
              <p className="mt-2 text-sm text-white">{log.module}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-zinc-900 p-4">
              <p className="text-xs text-gray-500 flex items-center gap-2"><Globe2 className="w-3.5 h-3.5 text-primary" /> IP Address</p>
              <p className="mt-2 text-sm text-white">{log.ipAddress}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-zinc-900 p-4">
              <p className="text-xs text-gray-500 flex items-center gap-2"><Monitor className="w-3.5 h-3.5 text-primary" /> Device / Browser</p>
              <p className="mt-2 text-sm text-white">{log.device}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">Description / Details</p>
            <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-300 font-sans">{log.details}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
