'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { Button, EmptyState, Input } from '@/components/ui';
import { avatarInitials, formatDate } from '@/lib/utils';
import { Plus, X, Eye, Phone, Mail, Calendar, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultForm = { name:'', email:'', password:'', phone:'' };

export default function ChefsPage() {
  const router = useRouter();
  const { staff, addStaff, orders } = useStore();
  const chefs = staff.filter(s => s.role === 'chef');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);

  function getChefOrders(chefId: string) {
    return orders.filter(o => staff.find(s=>s.id===chefId)?.orderIds.includes(o.id));
  }

  function validate() {
    const e: Record<string,string> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.replace(/\D/g,'').length < 10) e.phone = 'Valid 10-digit phone required';
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    addStaff({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password, role: 'chef', avatar: avatarInitials(form.name), joinDate: new Date().toISOString(), isActive: true });
    setShowModal(false);
    setForm(defaultForm);
    setErrors({});
    setSaving(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-brown-muted">{chefs.length} chefs registered</p>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Chef</Button>
      </div>

      {chefs.length === 0 ? (
        <EmptyState icon="👨‍🍳" title="No chefs yet" description="Add your first chef to the kitchen."
          action={<Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" />Add Chef</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {chefs.map((c, i) => {
            const chefOrders = getChefOrders(c.id);
            const completed = chefOrders.filter(o => o.status === 'COMPLETED').length;
            return (
              <motion.div key={c.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
                className="bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden hover:shadow-card-hover transition-shadow">
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-brand-brown">{c.name}</h3>
                        <span className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                      <div className="space-y-1 mt-1.5">
                        <p className="text-xs text-brand-brown-muted flex items-center gap-1.5"><Mail className="w-3 h-3" />{c.email}</p>
                        <p className="text-xs text-brand-brown-muted flex items-center gap-1.5"><Phone className="w-3 h-3" />{c.phone}</p>
                        <p className="text-xs text-brand-brown-muted flex items-center gap-1.5"><Calendar className="w-3 h-3" />Joined {formatDate(c.joinDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-brand-cream-dark rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-brand-brown">{chefOrders.length}</p>
                      <p className="text-xs text-brand-brown-muted">Orders Prepared</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                      <p className="text-xl font-bold text-blue-700">{completed}</p>
                      <p className="text-xs text-blue-600">Completed</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-brand-brown-muted">Current Status</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${c.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {c.isActive ? 'On Duty' : 'Off Duty'}
                    </span>
                  </div>

                  <Button variant="secondary" className="w-full" size="sm" onClick={() => router.push(`/admin/chefs/${c.id}`)}>
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-brand-cream-dark">
                <h2 className="font-display text-lg font-bold text-brand-brown">Add New Chef</h2>
                <button onClick={() => { setShowModal(false); setErrors({}); setForm(defaultForm); }}
                  className="w-8 h-8 rounded-lg hover:bg-brand-cream-dark flex items-center justify-center text-brand-brown-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <Input label="Full Name *" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Rajan Kumar" error={errors.name} />
                <Input label="Email *" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="rajan@gmail.com" error={errors.email} />
                <Input label="Phone *" type="tel" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} placeholder="9876543210" error={errors.phone} />
                <Input label="Password *" type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} placeholder="Min. 6 characters" error={errors.password} />
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={() => { setShowModal(false); setErrors({}); setForm(defaultForm); }}>Cancel</Button>
                  <Button className="flex-1" loading={saving} onClick={handleSave}>Add Chef</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
