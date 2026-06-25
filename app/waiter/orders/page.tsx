'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import { StatusBadge, PaymentBadge, EmptyState } from '@/components/ui';
import { OrderStatus, Order } from '@/types';
import Link from 'next/link';
import { Plus, Clock, MapPin, Phone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatTime } from '@/lib/utils';
import OrderDetailModal from '@/components/shared/OrderDetailModal';

const TABS: { label: string; status: OrderStatus | 'ALL' }[] = [
  { label: 'All',       status: 'ALL' },
  { label: 'Pending',   status: 'PENDING' },
  { label: 'Preparing', status: 'PREPARING' },
  { label: 'Ready',     status: 'READY' },
  { label: 'Completed', status: 'COMPLETED' },
];

export default function WaiterOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab]     = useState<string>('ALL');
  const [selected, setSelected]       = useState<Order | null>(null);

  const counts: Record<string, number> = {
    ALL: orders.length,
    PENDING:   orders.filter(o => o.status === 'PENDING').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    READY:     orders.filter(o => o.status === 'READY').length,
    COMPLETED: orders.filter(o => o.status === 'COMPLETED').length,
  };

  const filtered = orders.filter(o => activeTab === 'ALL' || o.status === activeTab);

  function handleStatusChange(orderId: string, status: OrderStatus) {
    updateOrderStatus(orderId, status);
    // Refresh selected if open
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null);
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.status} onClick={() => setActiveTab(tab.status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.status ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-brand-brown-muted border border-brand-cream-dark hover:text-brand-brown'}`}>
            {tab.label}
            {counts[tab.status] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.status ? 'bg-white/20 text-white' : 'bg-brand-cream-dark text-brand-brown'}`}>
                {counts[tab.status]}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={activeTab === 'READY' ? '✅' : '📋'}
              title={activeTab === 'ALL' ? 'No orders yet' : `No ${activeTab.toLowerCase()} orders`}
              description={activeTab === 'ALL' ? "You haven't created any orders yet." : `No orders with status "${activeTab}"`}
              action={activeTab === 'ALL' ? (
                <Link href="/waiter/new-order" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-brand-orange-dark transition-colors">
                  <Plus className="w-4 h-4" /> Create Order
                </Link>
              ) : undefined}
            />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((order, i) => (
                <motion.div key={order.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}>
                  {/* Enhanced order card */}
                  <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelected(order)}>
                    {/* Color bar by status */}
                    <div className={`h-1 ${order.status === 'PENDING' ? 'bg-amber-400' : order.status === 'PREPARING' ? 'bg-blue-500' : order.status === 'READY' ? 'bg-green-500' : 'bg-gray-300'}`} />

                    <div className="p-4">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-brand-brown text-sm">{order.id}</p>
                          <p className="text-xs text-brand-brown-muted flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />{formatTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StatusBadge status={order.status} />
                          <PaymentBadge paid={order.paymentStatus === 'PAID'} />
                        </div>
                      </div>

                      {/* Customer */}
                      <div className="flex items-center gap-2 mb-3 p-2.5 bg-brand-cream/50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-brand-cream-dark flex items-center justify-center text-brand-brown font-bold text-sm flex-shrink-0">
                          {order.customer.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-brown truncate">{order.customer.name}</p>
                          <div className="flex items-center gap-2 text-xs text-brand-brown-muted">
                            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />T-{order.customer.tableNumber}</span>
                            <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" />{order.customer.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="space-y-1 mb-3">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-brand-brown-muted">
                            <span className="w-4 h-4 rounded bg-brand-orange/10 text-brand-orange font-bold text-[10px] flex items-center justify-center flex-shrink-0">{item.quantity}</span>
                            <span className="truncate">{item.food.name}</span>
                            <span className="ml-auto font-medium text-brand-brown">{formatCurrency(item.food.price * item.quantity)}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-brand-brown-muted pl-6">+{order.items.length - 2} more items</p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-brand-cream-dark">
                        <span className="text-lg font-bold text-brand-orange">{formatCurrency(order.total)}</span>
                        <div className="flex items-center gap-2">
                          {/* Quick action for READY orders */}
                          {order.status === 'READY' && order.paymentStatus === 'UNPAID' && (
                            <button
                              onClick={e => { e.stopPropagation(); handleStatusChange(order.id, 'COMPLETED'); }}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                              Mark Served
                            </button>
                          )}
                          <span className="text-xs text-brand-brown-muted flex items-center gap-1 group-hover:text-brand-orange transition-colors">
                            View <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Order detail modal */}
      <AnimatePresence>
        {selected && (
          <OrderDetailModal
            order={selected}
            onClose={() => setSelected(null)}
            allowItemRemoval={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
