'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import { StatCard } from '@/components/ui';
import OrderCard from '@/components/shared/OrderCard';
import { formatCurrency, filterOrdersByDate } from '@/lib/utils';
import { DateFilter } from '@/types';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const FILTERS: { key: DateFilter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item      = { hidden: { opacity:0, y:16 }, show: { opacity:1, y:0, transition: { duration:0.3 } } };

export default function AdminDashboard() {
  const { orders, menuItems, updateOrderStatus, markPaymentReceived } = useStore();
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');

  const filtered   = filterOrdersByDate(orders, dateFilter);
  const revenue    = filtered.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + o.total, 0);
  const totalOrders = filtered.length;
  const completed  = filtered.filter(o => o.status === 'COMPLETED').length;
  const pending    = filtered.filter(o => o.status === 'COMPLETED' && o.paymentStatus === 'UNPAID').length;

  const activeOrders    = orders.filter(o => o.status !== 'COMPLETED');
  const pendingPayments = orders.filter(o => o.status === 'COMPLETED' && o.paymentStatus === 'UNPAID');

  const stats = [
    { title: 'Revenue',          value: formatCurrency(revenue), icon: IndianRupee, iconBg:'bg-orange-50', iconColor:'text-brand-orange', subtitle: dateFilter === 'today' ? "Today's earnings" : dateFilter === 'week' ? "This week" : "This month" },
    { title: 'Total Orders',     value: totalOrders,   icon: ShoppingBag, iconBg:'bg-blue-50', iconColor:'text-blue-600',  subtitle: `${activeOrders.length} currently active` },
    { title: 'Completed Orders', value: completed,     icon: CheckCircle, iconBg:'bg-green-50', iconColor:'text-green-600', subtitle: 'Fully served' },
    { title: 'Pending Payments', value: pending,       icon: Clock,       iconBg:'bg-amber-50', iconColor:'text-amber-600', subtitle: 'Awaiting collection' },
  ];

  return (
    <div className="space-y-6">
      {/* Date filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-brand-brown-muted">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Filter:</span>
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setDateFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dateFilter === f.key ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-brand-brown-muted border border-brand-cream-dark hover:text-brand-brown'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-brand-brown-muted ml-auto">
          Showing {filtered.length} orders
        </span>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <motion.div key={s.title} variants={item}><StatCard {...s} /></motion.div>
        ))}
      </motion.div>

      {/* Live queue */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-brand-brown">Live Active Orders</h3>
            <span className="text-xs bg-brand-orange/10 text-brand-orange font-semibold px-2.5 py-1 rounded-full border border-brand-orange/20">{activeOrders.length} orders</span>
          </div>
          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card border border-brand-cream-dark">
                <p className="text-4xl mb-3">🍽️</p>
                <p className="text-brand-brown font-medium mb-1">Kitchen is clear</p>
                <p className="text-brand-brown-muted text-sm">No active orders right now</p>
              </div>
            ) : (
              activeOrders.slice(0, 4).map(o => (
                <OrderCard key={o.id} order={o} role="admin" onStatusChange={updateOrderStatus} onMarkPaid={markPaymentReceived} />
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.36 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-brand-brown">Pending Payments</h3>
            <span className="text-xs bg-rose-100 text-rose-700 font-semibold px-2.5 py-1 rounded-full border border-rose-200">{pendingPayments.length} pending</span>
          </div>
          <div className="space-y-4">
            {pendingPayments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card border border-brand-cream-dark">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-brand-brown font-medium mb-1">All payments collected!</p>
                <p className="text-brand-brown-muted text-sm">No pending bills</p>
              </div>
            ) : (
              pendingPayments.map(o => (
                <OrderCard key={o.id} order={o} role="admin" onStatusChange={updateOrderStatus} onMarkPaid={markPaymentReceived} />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Menu overview */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }}
        className="bg-white rounded-2xl p-5 shadow-card border border-brand-cream-dark">
        <h3 className="text-base font-semibold text-brand-brown mb-4">Menu at a Glance</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {['Biryani','Dosa','Curries','Snacks','Desserts','Beverages'].map(cat => (
            <div key={cat} className="text-center p-3 rounded-xl bg-brand-cream-dark hover:bg-brand-orange/10 transition-colors">
              <p className="text-xl font-bold text-brand-brown">{menuItems.filter(m => m.category === cat).length}</p>
              <p className="text-xs text-brand-brown-muted mt-0.5">{cat}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
