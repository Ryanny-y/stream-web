import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatsCard } from './components/StatsCard';
import { FilterBar } from './components/FilterBar';
import { UserTable } from './components/UserTable';
import { UserFormModal, ConfirmDeleteDialog } from './components/UserModals';
import type { AdminUser, UserStats } from './types';
import { apiFetch } from '@/shared/lib/api';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersData, statsData] = await Promise.all([
        apiFetch('/admin/users'),
        apiFetch('/admin/users/status')
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination Logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.userId !== selectedUser.userId));
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingUser) {
      setUsers(users.map(u => u.userId === editingUser.userId ? { 
        ...u, 
        ...data, 
        updatedAt: new Date().toISOString() 
      } : u));
    } else {
      const newUser: AdminUser = {
        userId: Math.random().toString(36).substr(2, 9),
        ...data,
        emailVerified: false,
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([newUser, ...users]);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (user: AdminUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUsers(users.map(u => u.userId === user.userId ? { 
      ...u, 
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    } : u));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Manage Users</h1>
          <p className="text-gray-400 mt-1">Manage registered users, roles, and account access.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchData}
            disabled={isLoading}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleAddUser}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          label="Total Users" 
          value={isLoading ? '...' : stats?.totalUsers ?? 0} 
          icon={Users} 
        />
        <StatsCard 
          label="Active Users" 
          value={isLoading ? '...' : stats?.totalActiveUsers ?? 0} 
          icon={UserCheck} 
        />
        <StatsCard 
          label="Suspended" 
          value={isLoading ? '...' : stats?.suspendedUsers ?? 0} 
          icon={UserX} 
        />
        <StatsCard 
          label="Banned" 
          value={isLoading ? '...' : stats?.bannedUsers ?? 0} 
          icon={AlertTriangle} 
          className="border-rose-500/20 bg-rose-500/5"
        />
        <StatsCard 
          label="System Admins" 
          value={isLoading ? '...' : stats?.systemAdmin ?? 0} 
          icon={ShieldCheck} 
        />
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <FilterBar />
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-500">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchData} className="ml-auto hover:bg-rose-500/20">Try Again</Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(itemsPerPage)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No users found</h3>
            <p className="text-gray-500 mt-1">Start by adding a new user to your platform.</p>
            <Button onClick={handleAddUser} variant="outline" className="mt-4 border-white/10 text-white">
              Add First User
            </Button>
          </div>
        ) : (
          <>
            <UserTable 
              users={currentUsers} 
              onEdit={handleEditUser}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-gray-500">
                Showing <span className="text-white font-medium">{indexOfFirstUser + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLastUser, users.length)}</span> of <span className="text-white font-medium">{users.length}</span> users
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === i + 1 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

      {/* Modals */}
      <UserFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        user={editingUser}
      />

      <ConfirmDeleteDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete}
        userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
      />
    </div>
  );
};

export default UserManagementPage;
