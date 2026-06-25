'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import OrderCard from '@/components/shared/OrderCard';
import { EmptyState } from '@/components/ui';
import { OrderStatus } from '@/types';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS: { label: string; status: OrderStatus | 'ALL' }[] = [
  { label: 'All',       status: 'ALL' },
  { label: 'Pending',   status: 'PENDING' },
  { label: 'Preparing', status: 'PREPARING' },
  { label: 'Ready',     status: 'READY' },
  { label: 'Completed', status: 'COMPLETED' },
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, markPaymentReceived } = useStore();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const counts: Record<string, number> = {
    ALL:       orders.length,
    PENDING:   orders.filter(o => o.status === 'PENDING').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    READY:     orders.filter(o => o.status === 'READY').length,
    COMPLETED: orders.filter(o => o.status === 'COMPLETED').length,
  };

  const filtered = orders.filter(o => {
    const matchTab    = activeTab === 'ALL' || o.status === activeTab;
    const matchSearch = !search ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.tableNumber.includes(search);
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer, order ID, or table…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm text-brand-brown placeholder:text-brand-brown-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-colors" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.status} onClick={() => setActiveTab(tab.status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.status ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-brand-brown-muted border border-brand-cream-dark hover:text-brand-brown'
            }`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.status ? 'bg-white/20 text-white' : 'bg-brand-cream-dark text-brand-brown'}`}>
              {counts[tab.status]}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab + search} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}>
          {filtered.length === 0 ? (
            <EmptyState icon="📋" title="No orders found" description={search ? `No results for "${search}"` : 'No orders in this category.'} />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((order, i) => (
                <motion.div key={order.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.04 }}>
                  <OrderCard order={order} role="admin" onStatusChange={updateOrderStatus} onMarkPaid={markPaymentReceived} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
