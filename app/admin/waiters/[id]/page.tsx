'use client';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { StatusBadge, PaymentBadge, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WaiterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const { staff, orders } = useStore();

  const waiter = staff.find(s => s.id === id && s.role === 'waiter');
  if (!waiter) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-4xl mb-4">🤷</p>
      <h3 className="font-semibold text-brand-brown mb-2">Waiter not found</h3>
      <button onClick={() => router.back()} className="text-brand-orange text-sm hover:underline">Go back</button>
    </div>
  );

  const waiterOrders = orders.filter(o => waiter.orderIds.includes(o.id));
  const totalRevenue = waiterOrders.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + o.total, 0);
  const completed    = waiterOrders.filter(o => o.status === 'COMPLETED').length;
  const active       = waiterOrders.filter(o => o.status !== 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-brand-brown-muted hover:text-brand-brown transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Waiters
      </button>

      {/* Profile header */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        className="bg-white rounded-2xl shadow-card border border-brand-cream-dark p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
            {waiter.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-2xl font-bold text-brand-brown">{waiter.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${waiter.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                {waiter.isActive ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-6 text-sm text-brand-brown-muted">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-orange" />{waiter.email}</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-orange" />{waiter.phone}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-orange" />Joined {formatDate(waiter.joinDate)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Orders',   value: waiterOrders.length, icon: ShoppingBag, bg:'bg-blue-50',   color:'text-blue-600' },
          { label:'Active Orders',  value: active,              icon: Clock,       bg:'bg-amber-50',  color:'text-amber-600' },
          { label:'Completed',      value: completed,           icon: CheckCircle, bg:'bg-green-50',  color:'text-green-600' },
          { label:'Revenue Served', value: formatCurrency(totalRevenue), icon: TrendingUp, bg:'bg-orange-50', color:'text-brand-orange' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card border border-brand-cream-dark">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-brand-brown">{s.value}</p>
            <p className="text-xs text-brand-brown-muted">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Order history */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}>
        <h3 className="text-base font-semibold text-brand-brown mb-4">Order History</h3>
        {waiterOrders.length === 0 ? (
          <EmptyState icon="📋" title="No orders yet" description="This waiter hasn't handled any orders yet." />
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-cream-dark bg-brand-cream/50">
                    {['Order ID','Customer','Table','Items','Total','Status','Payment','Date'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-brand-brown-muted uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {waiterOrders.map(o => (
                    <tr key={o.id} className="hover:bg-brand-cream/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono font-medium text-brand-brown">{o.id}</td>
                      <td className="px-4 py-3 text-sm text-brand-brown">{o.customer.name}</td>
                      <td className="px-4 py-3 text-sm text-brand-brown-muted">#{o.customer.tableNumber}</td>
                      <td className="px-4 py-3 text-sm text-brand-brown-muted">{o.items.reduce((s,i)=>s+i.quantity,0)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-brand-orange">{formatCurrency(o.total)}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3"><PaymentBadge paid={o.paymentStatus==='PAID'} /></td>
                      <td className="px-4 py-3 text-xs text-brand-brown-muted">{formatDateTime(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
