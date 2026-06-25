'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import { PaymentBadge, StatusBadge, EmptyState, Button } from '@/components/ui';
import { formatCurrency, formatTime, formatDate } from '@/lib/utils';
import { User, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function AdminCustomersPage() {
  const { orders, markPaymentReceived } = useStore();
  const [tab, setTab] = useState<'active' | 'done'>('active');

  const activeCustomers = orders.filter(o => o.status !== 'COMPLETED' || o.paymentStatus === 'UNPAID');
  const doneCustomers = orders.filter(o => o.status === 'COMPLETED' && o.paymentStatus === 'PAID');

  const displayed = tab === 'active' ? activeCustomers : doneCustomers;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'active' ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-brand-brown-muted border border-brand-cream-dark hover:text-brand-brown'
          }`}
        >
          Active Customers
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === 'active' ? 'bg-white/20' : 'bg-brand-cream-dark text-brand-brown'}`}>
            {activeCustomers.length}
          </span>
        </button>
        <button
          onClick={() => setTab('done')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'done' ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-brand-brown-muted border border-brand-cream-dark hover:text-brand-brown'
          }`}
        >
          Completed
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === 'done' ? 'bg-white/20' : 'bg-brand-cream-dark text-brand-brown'}`}>
            {doneCustomers.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {displayed.length === 0 ? (
        <EmptyState
          icon={tab === 'active' ? '🪑' : '✅'}
          title={tab === 'active' ? 'No active customers' : 'No completed orders yet'}
          description={tab === 'active' ? 'Customers will appear here once waiters create orders.' : 'Completed and paid orders will show here.'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden hover:shadow-card-hover transition-shadow">
              {/* Header */}
              <div className="px-5 py-4 border-b border-brand-cream-dark bg-brand-cream/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white font-bold">
                      {order.customer.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-brown">{order.customer.name}</p>
                      <p className="text-xs text-brand-brown-muted">{order.id}</p>
                    </div>
                  </div>
                  <PaymentBadge paid={order.paymentStatus === 'PAID'} />
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-brown-muted">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Table {order.customer.tableNumber}</span>
                </div>
              </div>

              {/* Order info */}
              <div className="px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-brand-brown-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />{formatTime(order.createdAt)}
                  </span>
                </div>

                <div className="space-y-1 mt-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-brand-brown-muted">
                      <span>{item.quantity}× {item.food.name}</span>
                      <span>{formatCurrency(item.food.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-cream-dark mt-3 pt-3 flex items-center justify-between">
                  <span className="text-sm text-brand-brown-muted">Total</span>
                  <span className="font-bold text-brand-orange">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Actions */}
              {order.status === 'COMPLETED' && order.paymentStatus === 'UNPAID' && (
                <div className="px-5 pb-4">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => markPaymentReceived(order.id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Payment Received
                  </Button>
                </div>
              )}

              {order.paymentStatus === 'PAID' && (
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Payment Received
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
