'use client';
import { useState } from 'react';
import { Order, FoodItem, OrderItem } from '@/types';
import { useStore } from '@/store';
import { formatCurrency, formatDateTime, formatTime } from '@/lib/utils';
import { X, Plus, Minus, Trash2, Search, ShoppingBag, CheckCircle, Clock, ChefHat, UtensilsCrossed, CreditCard, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  order: Order;
  onClose: () => void;
  allowItemRemoval?: boolean;
}

const TIMELINE_STEPS: { status: string; label: string; icon: React.ReactNode }[] = [
  { status: 'PENDING',   label: 'Order Created',  icon: <ShoppingBag className="w-4 h-4" /> },
  { status: 'PREPARING', label: 'Preparing',       icon: <ChefHat className="w-4 h-4" /> },
  { status: 'READY',     label: 'Ready to Serve',  icon: <UtensilsCrossed className="w-4 h-4" /> },
  { status: 'COMPLETED', label: 'Served',           icon: <CheckCircle className="w-4 h-4" /> },
  { status: 'PAID',      label: 'Payment Done',    icon: <CreditCard className="w-4 h-4" /> },
];

const STATUS_ORDER = ['PENDING','PREPARING','READY','COMPLETED','PAID'];

export default function OrderDetailModal({ order, onClose, allowItemRemoval = true }: Props) {
  const { menuItems, updateOrderItems } = useStore();
  const [items, setItems] = useState<OrderItem[]>(order.items.map(i => ({ ...i })));
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const canEdit = order.paymentStatus !== 'PAID';
  const total   = items.reduce((s, i) => s + i.food.price * i.quantity, 0);
  const changed = JSON.stringify(items.map(i=>({id:i.food.id,q:i.quantity}))) !== JSON.stringify(order.items.map(i=>({id:i.food.id,q:i.quantity})));

  function changeQty(foodId: string, delta: number) {
    setItems(prev => {
      const updated = prev
        .map(i => {
          if (i.food.id !== foodId) return i;
          const nextQuantity = i.quantity + delta;
          return { ...i, quantity: allowItemRemoval ? nextQuantity : Math.max(1, nextQuantity) };
        })
        .filter(i => allowItemRemoval ? i.quantity > 0 : true);
      return updated;
    });
  }

  function addFood(food: FoodItem) {
    const exists = items.find(i => i.food.id === food.id);
    if (exists) changeQty(food.id, 1);
    else setItems(prev => [...prev, { food, quantity: 1 }]);
    setShowFoodPicker(false);
    setSearch('');
  }

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateOrderItems(order.id, items);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const currentStepIdx = STATUS_ORDER.indexOf(
    order.paymentStatus === 'PAID' ? 'PAID' : order.status
  );

  const filteredMenu = menuItems.filter(f =>
    f.isAvailable && (!search || f.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity:0, scale:0.96, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.96 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-cream-dark bg-brand-cream/40 flex-shrink-0">
          <div>
            <h2 className="font-display text-lg font-bold text-brand-brown">{order.id}</h2>
            <p className="text-xs text-brand-brown-muted mt-0.5">Created {formatDateTime(order.createdAt)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-brand-cream-dark flex items-center justify-center text-brand-brown-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Customer info */}
          <div className="px-5 py-4 border-b border-brand-cream-dark bg-brand-cream/20">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown-muted mb-3">Customer</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-xs text-brand-brown-muted mb-0.5">Name</p><p className="font-semibold text-brand-brown">{order.customer.name}</p></div>
              <div><p className="text-xs text-brand-brown-muted mb-0.5">Phone</p><p className="font-semibold text-brand-brown">{order.customer.phone}</p></div>
              <div><p className="text-xs text-brand-brown-muted mb-0.5">Table</p><p className="font-semibold text-brand-brown">#{order.customer.tableNumber}</p></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-5 py-4 border-b border-brand-cream-dark">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown-muted mb-4">Order Timeline</h3>
            <div className="flex items-center gap-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const tl = order.timeline?.find(t => t.status === step.status);
                const done = idx <= currentStepIdx;
                const current = idx === currentStepIdx;
                return (
                  <div key={step.status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${done ? (current ? 'bg-brand-orange text-white ring-4 ring-brand-orange/20' : 'bg-green-500 text-white') : 'bg-brand-cream-dark text-brand-brown-muted'}`}>
                        {step.icon}
                      </div>
                      <p className={`text-xs mt-1.5 text-center leading-tight max-w-[60px] ${done ? 'text-brand-brown font-medium' : 'text-brand-brown-muted'}`}>{step.label}</p>
                      {tl && <p className="text-[10px] text-brand-brown-muted mt-0.5">{formatTime(tl.timestamp)}</p>}
                    </div>
                    {idx < TIMELINE_STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 mb-5 ${idx < currentStepIdx ? 'bg-green-500' : 'bg-brand-cream-dark'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown-muted">Ordered Items</h3>
              {canEdit && (
                <button onClick={() => setShowFoodPicker(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              )}
            </div>

            {!canEdit && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Order is paid — editing is disabled
              </div>
            )}

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.food.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/40 border border-brand-cream-dark">
                  <img src={item.food.image} alt={item.food.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-brown line-clamp-1">{item.food.name}</p>
                    <p className="text-xs text-brand-brown-muted">{formatCurrency(item.food.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-orange w-16 text-right">{formatCurrency(item.food.price * item.quantity)}</span>
                    {canEdit ? (
                      <div className="flex items-center gap-1">
                        {(allowItemRemoval || item.quantity > 1) && (
                          <button onClick={() => changeQty(item.food.id, -1)}
                            className="w-6 h-6 rounded-md bg-white border border-brand-cream-dark hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center text-brand-brown-muted transition-colors">
                            {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                          </button>
                        )}
                        <span className="w-7 text-center text-sm font-bold text-brand-brown">{item.quantity}</span>
                        <button onClick={() => changeQty(item.food.id, 1)}
                          className="w-6 h-6 rounded-md bg-brand-orange text-white hover:bg-brand-orange-dark flex items-center justify-center transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-brand-brown w-8 text-center">×{item.quantity}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-3 border-t border-brand-cream-dark flex items-center justify-between">
              <div>
                {changed && canEdit && <p className="text-xs text-amber-600 font-medium">⚠ Unsaved changes</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-brown-muted">Updated Total</p>
                <p className="text-xl font-bold text-brand-orange">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        {canEdit && (
          <div className="px-5 py-4 border-t border-brand-cream-dark bg-brand-cream/20 flex-shrink-0">
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-brand-cream-dark text-sm font-medium text-brand-brown-muted hover:bg-brand-cream-dark transition-colors">
                Close
              </button>
              <button onClick={handleSave} disabled={!changed || saving}
                className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                  : saved ? <><CheckCircle className="w-4 h-4" />Saved!</>
                  : 'Update Order'}
              </button>
            </div>
          </div>
        )}

        {!canEdit && (
          <div className="px-5 py-4 border-t border-brand-cream-dark flex-shrink-0">
            <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-brand-cream-dark text-sm font-medium text-brand-brown hover:bg-brand-cream transition-colors">Close</button>
          </div>
        )}
      </motion.div>

      {/* Food Picker Overlay */}
      <AnimatePresence>
        {showFoodPicker && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-60 p-4" style={{zIndex:60}}>
            <motion.div initial={{ y:40, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:40, opacity:0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-brand-cream-dark">
                <h3 className="font-semibold text-brand-brown">Add Item to Order</h3>
                <button onClick={() => { setShowFoodPicker(false); setSearch(''); }}
                  className="w-8 h-8 rounded-lg hover:bg-brand-cream-dark flex items-center justify-center text-brand-brown-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 border-b border-brand-cream-dark">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown-muted" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes…" autoFocus
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-cream-dark bg-brand-cream/50 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-colors" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredMenu.map(food => {
                  const inOrder = items.find(i => i.food.id === food.id);
                  return (
                    <div key={food.id} className="flex items-center gap-3 p-3 rounded-xl border border-brand-cream-dark hover:border-brand-orange/30 hover:bg-brand-cream/40 transition-colors cursor-pointer" onClick={() => addFood(food)}>
                      <img src={food.image} alt={food.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        onError={e => { (e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-brown line-clamp-1">{food.name}</p>
                        <p className="text-xs text-brand-brown-muted">{food.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-brand-orange">{formatCurrency(food.price)}</p>
                        {inOrder && <p className="text-xs text-green-600">Already ×{inOrder.quantity}</p>}
                      </div>
                    </div>
                  );
                })}
                {filteredMenu.length === 0 && (
                  <div className="text-center py-8 text-brand-brown-muted text-sm">No items found</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
