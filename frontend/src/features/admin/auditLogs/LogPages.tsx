import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileClock,
  LogIn,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserCog,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { StatsCard } from '../users/components/StatsCard';
import { apiFetch } from '@/shared/lib/api';
import type { AuditLog, DisplayLog, LogFilters, LoginLog } from './types';
import { toDisplayAuditLog, toDisplayLoginLog } from './utils';
import { FilterBar } from './components/FilterBar';
import { AuditLogTable } from './components/AuditLogTable';
import { LogDetailsModal } from './components/LogDetailsModal';

const ITEMS_PER_PAGE = 10;

const initialFilters: LogFilters = {
  searchTerm: '',
  role: 'ALL',
  action: 'ALL',
  status: 'ALL',
  startDate: '',
  endDate: '',
};

const filterLogs = (logs: DisplayLog[], filters: LogFilters) => {
  const search = filters.searchTerm.trim().toLowerCase();
  const start = filters.startDate ? new Date(`${filters.startDate}T00:00:00`).getTime() : null;
  const end = filters.endDate ? new Date(`${filters.endDate}T23:59:59`).getTime() : null;

  return logs
    .filter((log) => {
      const haystack = `${log.user} ${log.email} ${log.actionLabel} ${log.module} ${log.details}`.toLowerCase();
      return !search || haystack.includes(search);
    })
    .filter((log) => filters.role === 'ALL' || log.role === filters.role)
    .filter((log) => filters.action === 'ALL' || log.action === filters.action)
    .filter((log) => filters.status === 'ALL' || log.status === filters.status)
    .filter((log) => {
      const time = new Date(log.timestamp).getTime();
      return (start === null || time >= start) && (end === null || time <= end);
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const exportLogs = (logs: DisplayLog[], filename: string) => {
  const headers = ['Timestamp', 'User', 'Email', 'Role', 'Action', 'Module', 'IP Address', 'Status', 'Details'];
  const rows = logs.map((log) => [
    log.timestamp,
    log.user,
    log.email,
    log.role,
    log.actionLabel,
    log.module,
    log.ipAddress,
    log.status,
    log.details.replace(/\s+/g, ' '),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

interface LogPageShellProps {
  title: string;
  subtitle: string;
  endpoint: string;
  exportName: string;
  mapLog: (log: any) => DisplayLog;
  statsVariant: 'audit' | 'login';
}

const LogPageShell: React.FC<LogPageShellProps> = ({ title, subtitle, endpoint, exportName, mapLog, statsVariant }) => {
  const [logs, setLogs] = useState<DisplayLog[]>([]);
  const [filters, setFilters] = useState<LogFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<DisplayLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch(endpoint);
      setLogs(data.map(mapLog));
    } catch (err: any) {
      setError(err.message || 'Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => filterLogs(logs, filters), [logs, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const stats = useMemo(() => {
    const loginEvents = logs.filter((log) => log.action === 'LOGIN' || log.action === 'FAILED_LOGIN').length;
    const failedLogins = logs.filter((log) => log.action === 'FAILED_LOGIN' || log.status === 'FAILED').length;
    const contentChanges = logs.filter((log) => ['CREATE', 'UPDATE', 'DELETE', 'UPLOAD'].includes(log.action)).length;
    const securityAlerts = logs.filter((log) => log.status === 'WARNING' || log.status === 'FAILED').length;

    return {
      totalLogs: logs.length,
      loginEvents,
      adminActions: logs.filter((log) => log.role === 'ADMIN' || log.role === 'SYSTEM').length,
      failedLogins,
      contentChanges,
      securityAlerts,
    };
  }, [logs]);

  const openDetails = (log: DisplayLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchLogs} disabled={isLoading} className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => exportLogs(filteredLogs, exportName)} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <StatsCard label="Total Logs" value={isLoading ? '...' : stats.totalLogs} icon={FileClock} />
        <StatsCard label="Login Events" value={isLoading ? '...' : stats.loginEvents} icon={LogIn} />
        <StatsCard label="Admin Actions" value={isLoading ? '...' : stats.adminActions} icon={UserCog} />
        <StatsCard label="Failed Logins" value={isLoading ? '...' : stats.failedLogins} icon={ShieldAlert} />
        <StatsCard label="Content Changes" value={isLoading ? '...' : stats.contentChanges} icon={statsVariant === 'audit' ? Upload : ShieldCheck} />
        <StatsCard label="Security Alerts" value={isLoading ? '...' : stats.securityAlerts} icon={AlertTriangle} />
      </div>

      <div className="space-y-4">
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-500">
            <p className="text-sm font-medium">{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchLogs} className="ml-auto hover:bg-rose-500/20">Try Again</Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-12 text-center">
            <FileClock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No logs found</h3>
            <p className="text-gray-500 mt-1">Adjust your filters or refresh the log feed.</p>
          </div>
        ) : (
          <>
            <AuditLogTable logs={currentLogs} onView={openDetails} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
              <p className="text-sm text-gray-500">
                Showing <span className="text-white font-medium">{startIndex + 1}</span> to{' '}
                <span className="text-white font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)}</span> of{' '}
                <span className="text-white font-medium">{filteredLogs.length}</span> logs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="px-3 text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <LogDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} log={selectedLog} />
    </div>
  );
};

export const AuditLogsPage: React.FC = () => (
  <LogPageShell
    title="Audit Logs"
    subtitle="Track system actions, login events, content updates, and admin activities."
    endpoint="/admin/logs/audit"
    exportName="audit-logs.csv"
    mapLog={(log: AuditLog) => toDisplayAuditLog(log)}
    statsVariant="audit"
  />
);

export const LoginLogsPage: React.FC = () => (
  <LogPageShell
    title="Login Logs"
    subtitle="Monitor authentication attempts, failed logins, and account access activity."
    endpoint="/admin/logs/login"
    exportName="login-logs.csv"
    mapLog={(log: LoginLog) => toDisplayLoginLog(log)}
    statsVariant="login"
  />
);
