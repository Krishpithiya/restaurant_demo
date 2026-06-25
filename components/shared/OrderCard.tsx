'use client';
import { Order, OrderStatus } from '@/types';
import { StatusBadge, PaymentBadge, Button } from '@/components/ui';
import { formatCurrency, formatTime } from '@/lib/utils';
import { Clock, MapPin, Phone, User } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
  onMarkPaid?: (orderId: string) => void;
  role?: 'admin' | 'chef' | 'waiter';
  className?: string;
}

export default function OrderCard({ order, showActions = true, onStatusChange, onMarkPaid, role = 'admin', className }: OrderCardProps) {
  const nextStatus: Record<string, OrderStatus | null> = {
    PENDING: 'PREPARING',
    PREPARING: 'READY',
    READY: 'COMPLETED',
    COMPLETED: null,
  };

  const nextLabel: Record<string, string> = {
    PENDING: 'Start Preparing',
    PREPARING: 'Mark Ready',
    READY: 'Mark Served',
    COMPLETED: '',
  };

  const canProgress =
    (role === 'chef' && (order.status === 'PENDING' || order.status === 'PREPARING')) ||
    (role === 'waiter' && order.status === 'READY') ||
    (role === 'admin');

  return (
    <div className={`bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden hover:shadow-card-hover transition-shadow duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-brand-cream-dark bg-brand-cream/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
            <span className="text-brand-orange font-bold text-sm">#{order.id.slice(-3)}</span>
          </div>
          <div>
            <p className="font-semibold text-brand-brown text-sm">{order.id}</p>
            <p className="text-xs text-brand-brown-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge status={order.status} />
          <PaymentBadge paid={order.paymentStatus === 'PAID'} />
        </div>
      </div>

      {/* Customer */}
      <div className="px-5 py-3 bg-white border-b border-brand-cream-dark">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-cream-dark flex items-center justify-center text-brand-brown font-semibold text-sm">
            {order.customer.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand-brown-muted" />
              <span className="text-sm font-medium text-brand-brown">{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-brand-brown-muted flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {order.customer.phone}
              </span>
              <span className="text-xs text-brand-brown-muted flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Table {order.customer.tableNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-3 space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold flex items-center justify-center">
                {item.quantity}
              </span>
              <span className="text-brand-brown font-medium">{item.food.name}</span>
            </div>
            <span className="text-brand-brown-muted font-medium">{formatCurrency(item.food.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Total + Actions */}
      <div className="px-5 py-4 border-t border-brand-cream-dark bg-brand-cream/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-brand-brown-muted">Total</span>
          <span className="text-lg font-bold text-brand-orange">{formatCurrency(order.total)}</span>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {/* Chef / Waiter actions */}
            {canProgress && nextStatus[order.status] && onStatusChange && (
              <Button
                className="flex-1"
                size="sm"
                variant={order.status === 'READY' ? 'primary' : 'secondary'}
                onClick={() => onStatusChange(order.id, nextStatus[order.status]!)}
              >
                {nextLabel[order.status]}
              </Button>
            )}

            {/* Admin payment */}
            {role === 'admin' && order.status === 'COMPLETED' && order.paymentStatus === 'UNPAID' && onMarkPaid && (
              <Button
                size="sm"
                onClick={() => onMarkPaid(order.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Mark Payment Received
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
