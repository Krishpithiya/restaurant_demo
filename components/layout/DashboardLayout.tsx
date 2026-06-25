'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Role } from '@/types';

interface Props {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function DashboardLayout({ children, requiredRole }: Props) {
  const router = useRouter();
  const currentUser = useStore((s) => s.currentUser);

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
    } else if (requiredRole && currentUser.role !== requiredRole) {
      router.replace(`/${currentUser.role}`);
    }
  }, [currentUser, requiredRole, router]);

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-brand-cream overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
