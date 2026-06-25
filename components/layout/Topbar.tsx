'use client';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store';
import { Bell } from 'lucide-react';

function getTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/admin':            'Dashboard',
    '/admin/orders':     'Orders',
    '/admin/menu':       'Menu Management',
    '/admin/customers':  'Customers',
    '/admin/waiters':    'Waiter Management',
    '/admin/chefs':      'Chef Management',
    '/chef':             'Kitchen Dashboard',
    '/chef/orders':      'All Orders',
    '/waiter':           'Dashboard',
    '/waiter/new-order': 'New Order',
    '/waiter/orders':    'My Orders',
  };
  // Match exact first, then prefix
  if (map[pathname]) return map[pathname];
  for (const key of Object.keys(map).sort((a,b) => b.length - a.length)) {
    if (pathname.startsWith(key)) return map[key];
  }
  return 'Anna Kitchen';
}

export default function Topbar() {
  const pathname    = usePathname();
  const currentUser = useStore(s => s.currentUser);
  const orders      = useStore(s => s.orders);

  const alertCount = orders.filter(o => o.status === 'PENDING' || o.status === 'READY').length;
  const title      = getTitle(pathname);
  const now        = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <header className="h-16 bg-white border-b border-brand-cream-dark flex items-center justify-between px-6 flex-shrink-0">
      <div className="pl-12 lg:pl-0">
        <h2 className="text-lg font-semibold text-brand-brown">{title}</h2>
        <p className="text-xs text-brand-brown-muted hidden sm:block">{now}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button className="w-9 h-9 rounded-xl bg-brand-cream-dark flex items-center justify-center text-brand-brown-muted hover:text-brand-brown hover:bg-brand-cream transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-xs font-bold rounded-full flex items-center justify-center">{alertCount}</span>
          )}
        </div>
        {currentUser && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {currentUser.avatar}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-brand-brown leading-none">{currentUser.name}</p>
              <p className="text-xs text-brand-brown-muted capitalize">{currentUser.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
