'use client';
import { useStore } from '@/store';
import { StatusBadge, EmptyState } from '@/components/ui';
import { formatCurrency, formatTime } from '@/lib/utils';
import { OrderStatus } from '@/types';
import { Clock, Flame, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS: { status: OrderStatus; label: string; emoji: string; headerCls: string; actionLabel?: string; actionNext?: OrderStatus; actionCls?: string }[] = [
  {
    status: 'PENDING', label: 'Incoming', emoji: '🔔',
    headerCls: 'bg-amber-50 border-amber-200 text-amber-800',
    actionLabel: '🔥 Start Preparing', actionNext: 'PREPARING',
    actionCls: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    status: 'PREPARING', label: 'Preparing', emoji: '👨‍🍳',
    headerCls: 'bg-blue-50 border-blue-200 text-blue-800',
    actionLabel: '✅ Mark Ready', actionNext: 'READY',
    actionCls: 'bg-green-600 hover:bg-green-700 text-white',
  },
  {
    status: 'READY', label: 'Ready to Serve', emoji: '🍽️',
    headerCls: 'bg-green-50 border-green-200 text-green-800',
  },
];

export default function ChefDashboard() {
  const { orders, updateOrderStatus } = useStore();

  const stats = {
    pending:   orders.filter(o => o.status === 'PENDING').length,
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    ready:     orders.filter(o => o.status === 'READY').length,
  };

  const totalActive = stats.pending + stats.preparing + stats.ready;

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Incoming', val: stats.pending,   cls: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Preparing', val: stats.preparing, cls: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Ready', val: stats.ready,       cls: 'bg-green-50 border-green-200 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.cls}`}>
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {totalActive === 0 ? (
        <EmptyState icon="🍳" title="Kitchen is clear!" description="No orders in the queue right now. Take a breather!" />
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {COLUMNS.map((col, ci) => {
            const colOrders = orders.filter(o => o.status === col.status);
            return (
              <motion.div key={col.status} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: ci * 0.08 }}>
                {/* Column header */}
                <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border mb-3 ${col.headerCls}`}>
                  <span className="font-bold text-sm flex items-center gap-2">
                    {col.emoji} {col.label}
                  </span>
                  <span className="text-xs font-bold bg-white/60 rounded-full px-2 py-0.5">
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[100px]">
                  <AnimatePresence>
                    {colOrders.length === 0 ? (
                      <div className="rounded-xl border-2 border-dashed border-brand-cream-dark p-6 text-center">
                        <p className="text-sm text-brand-brown-muted/50">No orders here</p>
                      </div>
                    ) : (
                      colOrders.map(order => (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden"
                        >
                          {/* Card header */}
                          <div className={`px-4 py-3 border-b border-brand-cream-dark ${
                            col.status === 'PENDING' ? 'bg-amber-50/60' :
                            col.status === 'PREPARING' ? 'bg-blue-50/60' : 'bg-green-50/60'
                          }`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-brand-brown text-sm">{order.id}</p>
                                <p className="text-xs text-brand-brown-muted">Table {order.customer.tableNumber}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-brand-brown text-sm">{order.customer.name}</p>
                                <p className="text-xs text-brand-brown-muted flex items-center gap-1 justify-end">
                                  <Clock className="w-3 h-3" />{formatTime(order.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="px-4 py-3 space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-brand-orange/10 text-brand-orange text-xs font-bold flex items-center justify-center flex-shrink-0">
                                  ×{item.quantity}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-brand-brown line-clamp-1">{item.food.name}</p>
                                  <p className="text-xs text-brand-brown-muted">{item.food.category}</p>
                                </div>
                                {item.food.spiceLevel === 'hot' && <Flame className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="px-4 py-3 border-t border-brand-cream-dark">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-brand-brown-muted">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} items total
                              </span>
                              <span className="text-sm font-bold text-brand-orange">{formatCurrency(order.total)}</span>
                            </div>

                            {col.actionLabel && col.actionNext ? (
                              <button
                                onClick={() => updateOrderStatus(order.id, col.actionNext!)}
                                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${col.actionCls}`}
                              >
                                {col.actionLabel}
                              </button>
                            ) : (
                              <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-100 text-green-700 text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                Waiting for waiter
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
