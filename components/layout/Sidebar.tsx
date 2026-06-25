'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, UtensilsCrossed, Users, ChefHat, LogOut, ShieldCheck, Coffee, Menu, X, UserCheck } from 'lucide-react';
import { useState } from 'react';

const navConfig = {
  admin: [
    { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
    { href: '/admin/orders',    label: 'Orders',     icon: ClipboardList },
    { href: '/admin/menu',      label: 'Menu',       icon: UtensilsCrossed },
    { href: '/admin/customers', label: 'Customers',  icon: Users },
    { href: '/admin/waiters',   label: 'Waiters',    icon: Coffee },
    { href: '/admin/chefs',     label: 'Chefs',      icon: ChefHat },
  ],
  chef: [
    { href: '/chef',        label: 'Kitchen',    icon: ChefHat },
    { href: '/chef/orders', label: 'All Orders', icon: ClipboardList },
  ],
  waiter: [
    { href: '/waiter',           label: 'Dashboard', icon: LayoutDashboard },
    { href: '/waiter/new-order', label: 'New Order', icon: UtensilsCrossed },
    { href: '/waiter/orders',    label: 'My Orders', icon: ClipboardList },
  ],
};

const roleIcons   = { admin: ShieldCheck, chef: ChefHat, waiter: Coffee };
const roleColors  = { admin: 'from-brand-orange to-brand-orange-dark', chef: 'from-blue-500 to-blue-700', waiter: 'from-green-500 to-green-700' };

export default function Sidebar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const { currentUser, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return null;

  const navItems  = navConfig[currentUser?.role];
  const RoleIcon  = roleIcons[currentUser?.role];

  function handleLogout() { logout(); router.push('/login'); }

 function isActive(href: string) {
  if (!currentUser) return false;

  if (href === `/${currentUser?.role}`) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-brand-cream-dark">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-lg text-lg">🍛</div>
          <div>
            <h1 className="font-display font-bold text-brand-brown text-lg leading-none">Anna Kitchen</h1>
            <span className="text-xs text-brand-brown-muted">Management System</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}
            className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(href) ? 'bg-brand-orange text-white shadow-md' : 'text-brand-brown-muted hover:bg-brand-cream-dark hover:text-brand-brown'
            )}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-cream-dark">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream-dark mb-3">
          <div className={cn('w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shadow-sm', roleColors[currentUser?.role])}>
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-brown truncate">{currentUser.name}</p>
            <p className="text-xs text-brand-brown-muted capitalize">{currentUser?.role}</p>
          </div>
          <RoleIcon className="w-4 h-4 text-brand-brown-muted flex-shrink-0" />
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-brown-muted hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-card rounded-xl flex items-center justify-center text-brand-brown"
        onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />}
      <aside className={cn('lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transition-transform duration-300', mobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        <SidebarContent />
      </aside>
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-card border-r border-brand-cream-dark">
        <SidebarContent />
      </aside>
    </>
  );
}
