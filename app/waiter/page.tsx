'use client';
import Link from 'next/link';
import { useStore } from '@/store';
import { StatCard, EmptyState } from '@/components/ui';
import OrderCard from '@/components/shared/OrderCard';
import { ShoppingBag, Clock, CheckCircle, Plus, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item    = { hidden: { opacity:0, y:16 }, show: { opacity:1, y:0 } };

export default function WaiterDashboard() {
  const { orders, updateOrderStatus } = useStore();
  const activeOrders   = orders.filter(o => o.status !== 'COMPLETED');
  const readyOrders    = orders.filter(o => o.status === 'READY');
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Orders Today',     value: orders.length,     icon: ShoppingBag, iconBg:'bg-orange-50',  iconColor:'text-brand-orange' },
          { title: 'Active Orders',    value: activeOrders.length, icon: Clock,      iconBg:'bg-blue-50',   iconColor:'text-blue-600', subtitle:'In progress' },
          { title: 'Ready to Serve',   value: readyOrders.length,  icon: Bell,       iconBg:'bg-green-50',  iconColor:'text-green-600', subtitle: readyOrders.length ? 'Needs your attention!' : 'All clear' },
          { title: 'Completed',        value: completedCount,      icon: CheckCircle, iconBg:'bg-gray-50',  iconColor:'text-gray-500' },
        ].map(s => (
          <motion.div key={s.title} variants={item}><StatCard {...s} /></motion.div>
        ))}
      </motion.div>

      {/* Ready alert */}
      {readyOrders.length > 0 && (
        <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-green-600 animate-bounce" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-green-800">
              {readyOrders.length} order{readyOrders.length > 1 ? 's' : ''} ready to serve!
            </p>
            <p className="text-sm text-green-600 mt-0.5">
              {readyOrders.map(o => `Table ${o.customer.tableNumber} (${o.customer.name})`).join(' · ')}
            </p>
          </div>
          <Link href="/waiter/orders" className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
            View →
          </Link>
        </motion.div>
      )}

      {/* New order CTA */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <Link href="/waiter/new-order"
          className="flex items-center gap-4 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Create New Order</p>
            <p className="text-white/75 text-sm">Take a customer order at the table</p>
          </div>
        </Link>
      </motion.div>

      {/* Active orders */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-brand-brown">Active Orders</h3>
          <Link href="/waiter/orders" className="text-sm text-brand-orange font-medium hover:underline">View all →</Link>
        </div>
        {activeOrders.length === 0 ? (
          <EmptyState icon="🍽️" title="No active orders" description="All clear! Create a new order to get started."
            action={
              <Link href="/waiter/new-order" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-brand-orange-dark transition-colors">
                <Plus className="w-4 h-4" /> New Order
              </Link>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} role="waiter" onStatusChange={updateOrderStatus} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
