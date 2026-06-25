'use client';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { StatusBadge, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, Calendar, ChefHat, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChefDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const { staff, orders } = useStore();

  const chef = staff.find(s => s.id === id && s.role === 'chef');
  if (!chef) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-4xl mb-4">🤷</p>
      <h3 className="font-semibold text-brand-brown mb-2">Chef not found</h3>
      <button onClick={() => router.back()} className="text-brand-orange text-sm hover:underline">Go back</button>
    </div>
  );

  const chefOrders = orders.filter(o => chef.orderIds.includes(o.id));
  const completed  = chefOrders.filter(o => o.status === 'COMPLETED').length;
  const preparing  = chefOrders.filter(o => o.status === 'PREPARING').length;
  const ready      = chefOrders.filter(o => o.status === 'READY').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-brand-brown-muted hover:text-brand-brown transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Chefs
      </button>

      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        className="bg-white rounded-2xl shadow-card border border-brand-cream-dark p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
            {chef.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-2xl font-bold text-brand-brown">{chef.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${chef.isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                {chef.isActive ? '● On Duty' : '○ Off Duty'}
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-y-2 gap-x-6 text-sm text-brand-brown-muted">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-orange" />{chef.email}</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-orange" />{chef.phone}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-orange" />Joined {formatDate(chef.joinDate)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Prepared', value: chefOrders.length, bg:'bg-blue-50',   color:'text-blue-600' },
          { label:'Completed',      value: completed,         bg:'bg-green-50',  color:'text-green-600' },
          { label:'Preparing',      value: preparing,         bg:'bg-amber-50',  color:'text-amber-600' },
          { label:'Ready',          value: ready,             bg:'bg-purple-50', color:'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card border border-brand-cream-dark text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-brand-brown-muted mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}>
        <h3 className="text-base font-semibold text-brand-brown mb-4">Prepared Orders</h3>
        {chefOrders.length === 0 ? (
          <EmptyState icon="🍳" title="No orders yet" description="This chef hasn't prepared any orders yet." />
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-cream-dark bg-brand-cream/50">
                    {['Order ID','Customer','Table','Items','Total','Status','Prepared At'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-brand-brown-muted uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {chefOrders.map(o => (
                    <tr key={o.id} className="hover:bg-brand-cream/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono font-medium text-brand-brown">{o.id}</td>
                      <td className="px-4 py-3 text-sm text-brand-brown">{o.customer.name}</td>
                      <td className="px-4 py-3 text-sm text-brand-brown-muted">#{o.customer.tableNumber}</td>
                      <td className="px-4 py-3 text-sm text-brand-brown-muted">{o.items.reduce((s,i)=>s+i.quantity,0)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-brand-orange">{formatCurrency(o.total)}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3 text-xs text-brand-brown-muted">{formatDateTime(o.updatedAt)}</td>
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
