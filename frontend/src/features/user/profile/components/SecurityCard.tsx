import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { UserProfile } from '../types';
import { formatDate } from '../utils';

export const SecurityCard: React.FC<{ profile: UserProfile; onLogoutAll: () => void }> = ({ profile, onLogoutAll }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-5">
    <div>
      <h2 className="text-xl font-bold text-white">Security</h2>
      <p className="text-sm text-gray-500 mt-1">Review recent access and account state.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-white/5 bg-black/20 p-4">
        <p className="text-xs text-gray-500">Last Login</p>
        <p className="mt-1 font-semibold text-white">{formatDate(profile.lastLoginAt)}</p>
      </div>
      <div className="rounded-xl border border-white/5 bg-black/20 p-4">
        <p className="text-xs text-gray-500">Account Status</p>
        <p className="mt-1 inline-flex items-center gap-2 font-semibold text-emerald-400">
          <ShieldCheck className="h-4 w-4" /> {profile.status}
        </p>
      </div>
    </div>
    <Button type="button" variant="outline" onClick={onLogoutAll} className="border-white/10 bg-white/5 text-gray-200">
      <LogOut className="mr-2 h-4 w-4" /> Logout all devices
    </Button>
  </section>
);
