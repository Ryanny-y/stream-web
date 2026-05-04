import React from 'react';
import { 
  Users, 
  Film, 
  Eye, 
  Tags, 
  AlertTriangle, 
  TrendingUp, 
  Upload, 
  FileText,
  UserPlus,
  Trash2,
  Lock
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

// Mock Data for Charts
const userGrowthData = [
  { name: 'Jan', users: 4000 },
  { name: 'Feb', users: 5000 },
  { name: 'Mar', users: 6500 },
  { name: 'Apr', users: 8200 },
  { name: 'May', users: 11000 },
  { name: 'Jun', users: 15000 },
];

const categoriesData = [
  { name: 'Action', value: 400 },
  { name: 'Sci-Fi', value: 300 },
  { name: 'Drama', value: 300 },
  { name: 'Comedy', value: 200 },
  { name: 'Horror', value: 100 },
];

const COLORS = ['#E50914', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export const AdminDashboard: React.FC = () => {
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
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard 
          label="Total Users" 
          value="124.5K" 
          icon={Users} 
          trend={{ value: "12%", isUp: true }} 
        />
        <StatsCard 
          label="Active Users" 
          value="45.2K" 
          icon={TrendingUp} 
          trend={{ value: "5.4%", isUp: true }} 
        />
        <StatsCard 
          label="Total Videos" 
          value="8,432" 
          icon={Film} 
          trend={{ value: "2.1%", isUp: true }} 
        />
        <StatsCard 
          label="Total Views" 
          value="2.4M" 
          icon={Eye} 
          trend={{ value: "18%", isUp: true }} 
        />
        <StatsCard 
          label="Categories" 
          value="24" 
          icon={Tags} 
        />
        <StatsCard 
          label="Reports Pending" 
          value="12" 
          icon={AlertTriangle} 
          trend={{ value: "4", isUp: false }} 
          className="border-rose-500/20 bg-rose-500/5"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="User Growth" description="Monthly new user registrations" className="lg:col-span-2">
          <div className="w-full min-w-0">
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
          </div>
        </ChartCard>

        <ChartCard title="Most Watched Categories" description="Distribution by views">
          <div className="w-full min-w-0">
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
          <RecentVideosTable />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <ActivityItem 
              icon={UserPlus} 
              description="New user 'johndoe' registered." 
              timestamp="2 mins ago" 
              iconBgColor="bg-emerald-500/10"
              iconColor="text-emerald-500"
            />
            <ActivityItem 
              icon={Upload} 
              description="Video 'The Dark Horizon' was uploaded by Admin." 
              timestamp="1 hour ago" 
            />
            <ActivityItem 
              icon={Trash2} 
              description="Video 'Test clip' was deleted." 
              timestamp="3 hours ago" 
              iconBgColor="bg-rose-500/10"
              iconColor="text-rose-500"
            />
            <ActivityItem 
              icon={Lock} 
              description="User 'spammer123' was suspended." 
              timestamp="5 hours ago" 
              iconBgColor="bg-amber-500/10"
              iconColor="text-amber-500"
            />
            <ActivityItem 
              icon={Tags} 
              description="New category 'Cyberpunk' added." 
              timestamp="1 day ago" 
              iconBgColor="bg-blue-500/10"
              iconColor="text-blue-500"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
