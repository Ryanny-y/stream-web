import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary/30">
      {/* Sidebar - Hidden on mobile, but we are desktop-first here as per request */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
