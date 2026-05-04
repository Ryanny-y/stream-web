import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatsCard } from './components/StatsCard';
import { FilterBar } from './components/FilterBar';
import { UserTable } from './components/UserTable';
import { UserFormModal, UserDetailsModal, ConfirmDeleteDialog } from './components/UserModals';
import type { AdminUser } from './types';

// Mock Data updated to match AdminUserResponse DTO
const MOCK_USERS: AdminUser[] = [
  {
    userId: '1',
    username: 'admin_john',
    email: 'john@viewix.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 234 567 890',
    profileImage: '',
    status: 'ACTIVE',
    emailVerified: true,
    failedAttempts: 0,
    roles: ['ADMIN'],
    createdAt: '2024-01-12T10:00:00',
    updatedAt: '2024-05-04T15:30:00',
    videosWatched: 124,
    totalWatchTime: '45h 20m',
    favoritesCount: 12,
    watchlistCount: 24,
  },
  {
    userId: '2',
    username: 'jane_content',
    email: 'jane@viewix.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1 987 654 321',
    profileImage: '',
    status: 'ACTIVE',
    emailVerified: true,
    failedAttempts: 2,
    roles: ['CONTENT_MANAGER'],
    createdAt: '2024-02-05T09:15:00',
    updatedAt: '2024-05-05T11:45:00',
    videosWatched: 89,
    totalWatchTime: '32h 15m',
    favoritesCount: 8,
    watchlistCount: 15,
  },
  {
    userId: '3',
    username: 'mike_b',
    email: 'mike.b@gmail.com',
    firstName: 'Michael',
    lastName: 'Brown',
    phone: '',
    profileImage: '',
    status: 'SUSPENDED',
    emailVerified: true,
    failedAttempts: 5,
    lockedUntil: '2024-05-10T00:00:00',
    roles: ['USER'],
    createdAt: '2024-03-15T14:20:00',
    updatedAt: '2024-05-03T18:10:00',
    videosWatched: 245,
    totalWatchTime: '112h 45m',
    favoritesCount: 45,
    watchlistCount: 67,
  },
  {
    userId: '4',
    username: 'sarah_w',
    email: 'sarah.w@outlook.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    phone: '',
    profileImage: '',
    status: 'BANNED',
    emailVerified: false,
    failedAttempts: 12,
    roles: ['USER'],
    createdAt: '2024-04-20T11:40:00',
    updatedAt: '2024-05-01T09:20:00',
    videosWatched: 0,
    totalWatchTime: '0h',
    favoritesCount: 0,
    watchlistCount: 0,
  },
  {
    userId: '5',
    username: 'david_m',
    email: 'david.m@viewix.com',
    firstName: 'David',
    lastName: 'Miller',
    phone: '+44 7700 900000',
    profileImage: '',
    status: 'ACTIVE',
    emailVerified: true,
    failedAttempts: 0,
    roles: ['USER', 'CONTENT_MANAGER'],
    createdAt: '2024-05-02T16:50:00',
    updatedAt: '2024-05-04T12:00:00',
    videosWatched: 42,
    totalWatchTime: '15h 30m',
    favoritesCount: 5,
    watchlistCount: 12,
  }
];

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
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
      // Update
      setUsers(users.map(u => u.userId === editingUser.userId ? { 
        ...u, 
        ...data, 
        updatedAt: new Date().toISOString() 
      } : u));
    } else {
      // Add
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
        <Button 
          onClick={handleAddUser}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          label="Total Users" 
          value={users.length} 
          icon={Users} 
          trend={{ value: '12%', isUp: true }} 
        />
        <StatsCard 
          label="Active Users" 
          value={users.filter(u => u.status === 'ACTIVE').length} 
          icon={UserCheck} 
          trend={{ value: '5%', isUp: true }} 
        />
        <StatsCard 
          label="Suspended" 
          value={users.filter(u => u.status === 'SUSPENDED').length} 
          icon={UserX} 
          trend={{ value: '2%', isUp: false }} 
        />
        <StatsCard 
          label="Banned" 
          value={users.filter(u => u.status === 'BANNED').length} 
          icon={AlertTriangle} 
          className="border-rose-500/20 bg-rose-500/5"
        />
        <StatsCard 
          label="System Admins" 
          value={users.filter(u => u.roles.includes('ADMIN')).length} 
          icon={ShieldCheck} 
        />
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <FilterBar />
        
        <UserTable 
          users={users} 
          onView={handleViewDetails}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
          onStatusChange={handleStatusChange}
        />

        {/* Pagination Placeholder */}
        <div className="flex items-center justify-between py-4">
          <p className="text-sm text-gray-500">Showing {users.length} of {users.length} users</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="bg-zinc-900 border-white/5 text-gray-400">Previous</Button>
            <Button variant="outline" size="sm" disabled className="bg-zinc-900 border-white/5 text-gray-400">Next</Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        user={editingUser}
      />

      <UserDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        user={selectedUser}
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
