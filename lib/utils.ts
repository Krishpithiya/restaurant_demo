import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Order, OrderStatus, DateFilter } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':   return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'PREPARING': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'READY':     return 'bg-green-100 text-green-800 border-green-200';
    case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
    default:          return 'bg-gray-100 text-gray-700';
  }
}

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':   return 'Pending';
    case 'PREPARING': return 'Preparing';
    case 'READY':     return 'Ready to Serve';
    case 'COMPLETED': return 'Completed';
    default:          return status;
  }
}

export function generateOrderId(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${num}`;
}

export function generateCustomerId(): string {
  return `c-${Date.now()}`;
}

// ── Date filter helpers ─────────────────────────────────────────────────────
export function filterOrdersByDate(orders: Order[], filter: DateFilter): Order[] {
  const now = new Date();
  return orders.filter((o) => {
    const d = new Date(o.createdAt);
    if (filter === 'today') {
      return d.toDateString() === now.toDateString();
    }
    if (filter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (filter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      return d >= monthAgo;
    }
    return true;
  });
}

export function avatarInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}
