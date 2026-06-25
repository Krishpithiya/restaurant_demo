'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';

export default function RootPage() {
  const router      = useRouter();
  const currentUser = useStore(s => s.currentUser);

  useEffect(() => {
    if (currentUser) router.replace(`/${currentUser.role}`);
    else router.replace('/login');
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
