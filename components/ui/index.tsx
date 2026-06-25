'use client';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/types';
import { getStatusLabel } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, iconColor = 'text-brand-orange', iconBg = 'bg-orange-50', subtitle, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-brand-cream-dark hover:shadow-card-hover transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        {trend && (
          <span className={cn('text-xs font-medium px-2 py-1 rounded-full', trendUp ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100')}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-brand-brown mb-0.5">{value}</p>
      <p className="text-sm font-medium text-brand-brown">{title}</p>
      {subtitle && <p className="text-xs text-brand-brown-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── Status Badge ────────────────────────────────────────────────────────────
interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  PREPARING: 'bg-blue-100 text-blue-800 border-blue-200',
  READY: 'bg-green-100 text-green-800 border-green-200',
  COMPLETED: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusDots: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-500',
  PREPARING: 'bg-blue-500',
  READY: 'bg-green-500',
  COMPLETED: 'bg-gray-400',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', statusStyles[status], className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', statusDots[status])} />
      {getStatusLabel(status)}
    </span>
  );
}

// ── Payment Badge ───────────────────────────────────────────────────────────
export function PaymentBadge({ paid }: { paid: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
      paid ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', paid ? 'bg-emerald-500' : 'bg-rose-500')} />
      {paid ? 'Paid' : 'Unpaid'}
    </span>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-brand-brown mb-2">{title}</h3>
      <p className="text-sm text-brand-brown-muted max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-brand-cream-dark">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="w-16 h-6 rounded-full skeleton" />
      </div>
      <div className="w-20 h-7 rounded skeleton mb-1" />
      <div className="w-28 h-4 rounded skeleton" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-brand-cream-dark">
      <div className="w-16 h-4 rounded skeleton" />
      <div className="w-32 h-4 rounded skeleton" />
      <div className="flex-1 h-4 rounded skeleton" />
      <div className="w-20 h-6 rounded-full skeleton" />
      <div className="w-24 h-8 rounded-lg skeleton" />
    </div>
  );
}

// ── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const buttonVariants = {
  primary: 'bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm',
  secondary: 'bg-brand-cream-dark hover:bg-brand-cream text-brand-brown border border-brand-cream-dark',
  ghost: 'hover:bg-brand-cream-dark text-brand-brown-muted hover:text-brand-brown',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn('inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', buttonVariants[variant], buttonSizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-brand-brown">{label}</label>}
      <input
        className={cn(
          'px-4 py-2.5 rounded-xl border text-sm text-brand-brown placeholder:text-brand-brown-muted bg-white transition-colors outline-none',
          error ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-brand-cream-dark focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-brand-brown">{title}</h3>
        {subtitle && <p className="text-sm text-brand-brown-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
