import React from 'react';
import { 
  Users, 
  Film, 
  Eye, 
  Tags, 
  TrendingUp, 
  Upload, 
  FileText,
  Trash2,
  RefreshCw,
  PlusCircle,
  Pencil,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

import { StatsCard } from './components/StatsCard';
import { ChartCard } from './components/ChartCard';
import { ActivityItem } from './components/ActivityItem';
import { RecentVideosTable } from './components/RecentVideosTable';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { apiFetch } from '@/shared/lib/api';
import type { AdminDashboardResponse } from './types';

const COLORS = ['#E50914', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const formatCompact = (value: number) =>
  new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const formatMonth = (month: string) => {
  const date = new Date(`${month}-01T00:00:00`);
  return Number.isNaN(date.getTime())
    ? month
    : new Intl.DateTimeFormat(undefined, { month: 'short' }).format(date);
};

const formatRelativeTime = (date: string) => {
  const diffMs = new Date(date).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, 'minute');
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, 'hour');
  return formatter.format(Math.round(diffHours / 24), 'day');
};

const activityIconFor = (action: string) => {
  const normalized = action.toUpperCase();
  if (normalized.includes('CREATE')) return PlusCircle;
  if (normalized.includes('UPDATE')) return Pencil;
  if (normalized.includes('DELETE')) return Trash2;
  if (normalized.includes('UPLOAD')) return Upload;
  return ShieldCheck;
};

export const AdminDashboard: React.FC = () => {
  const [dashboard, setDashboard] = React.useState<AdminDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/admin/dashboard');
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboard();
  }, []);

  const userGrowthData = (dashboard?.userGrowth || []).map((entry) => ({
    name: formatMonth(entry.month),
    users: entry.totalUsers,
  }));

  const categoriesData = (dashboard?.mostWatchedCategories || []).map((entry) => ({
    name: entry.categoryName,
    value: entry.totalViews,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Report
          </Button>
          <Button onClick={fetchDashboard} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-500">
          <p className="text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchDashboard} className="ml-auto hover:bg-rose-500/20">
            Try Again
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard 
          label="Total Users" 
          value={isLoading ? '...' : formatCompact(dashboard?.totalUsers || 0)} 
          icon={Users} 
        />
        <StatsCard 
          label="Active Users" 
          value={isLoading ? '...' : formatCompact(dashboard?.totalActiveUsers || 0)} 
          icon={TrendingUp} 
        />
        <StatsCard 
          label="Total Videos" 
          value={isLoading ? '...' : formatCompact(dashboard?.totalVideos || 0)} 
          icon={Film} 
        />
        <StatsCard 
          label="Total Views" 
          value={isLoading ? '...' : formatCompact(dashboard?.totalViews || 0)} 
          icon={Eye} 
        />
        <StatsCard 
          label="Categories" 
          value={isLoading ? '...' : formatCompact(dashboard?.totalCategories || 0)} 
          icon={Tags} 
        />
        <StatsCard 
          label="Recent Activity" 
          value={isLoading ? '...' : formatCompact(dashboard?.recentActivity.length || 0)} 
          icon={ShieldCheck} 
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="User Growth" description="Monthly new user registrations" className="lg:col-span-2">
          <div className="w-full min-w-0">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full bg-white/5 rounded-xl" />
            ) : (
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <LineChart data={userGrowthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="users" stroke="#E50914" strokeWidth={3} dot={{ fill: '#E50914', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Most Watched Categories" description="Distribution by views">
          <div className="w-full min-w-0">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full bg-white/5 rounded-xl" />
            ) : categoriesData.length ? (
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoriesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">
                No category view data yet.
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {categoriesData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section: Table & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Videos</h2>
            <Button variant="link" className="text-primary hover:text-primary/80 px-0">View All</Button>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full bg-white/5 rounded-xl" />
              ))}
            </div>
          ) : (
            <RecentVideosTable videos={dashboard?.recentVideos || []} />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full bg-white/5 rounded-lg" />
              ))
            ) : dashboard?.recentActivity.length ? (
              dashboard.recentActivity.map((activity) => {
                const Icon = activityIconFor(activity.action);
                return (
                  <ActivityItem
                    key={activity.logId}
                    icon={Icon}
                    description={`${activity.username || 'System'} performed ${activity.action} on ${activity.entityName || 'System'}.`}
                    timestamp={formatRelativeTime(activity.createdAt)}
                    iconBgColor={activity.action.toUpperCase().includes('DELETE') ? 'bg-rose-500/10' : 'bg-white/5'}
                    iconColor={activity.action.toUpperCase().includes('DELETE') ? 'text-rose-500' : 'text-primary'}
                  />
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No recent activity yet.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
