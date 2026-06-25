'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import FoodCard from '@/components/shared/FoodCard';
import { Button, Input, EmptyState } from '@/components/ui';
import { FoodItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Search, ShoppingCart, Trash2, X, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All','Biryani','Dosa','Curries','Snacks','Desserts','Beverages'];

export default function NewOrderPage() {
  const router = useRouter();
  const { menuItems, cart, addToCart, removeFromCart, updateCartQty, clearCart, addOrder, currentUser, staff } = useStore();

  const [search, setSearch]               = useState('');
  const [category, setCategory]           = useState('All');
  const [customerName, setCustomerName]   = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber]     = useState('');
  const [errors, setErrors]               = useState<Record<string,string>>({});
  const [success, setSuccess]             = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Find staff record for current waiter to attach waiterId
  const waiterStaff = staff.find(s => s.email === currentUser?.email && s.role === 'waiter');

  const filtered = menuItems.filter(item => {
    const matchCat    = category === 'All' || item.category === category;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.isAvailable;
  });

  const cartTotal = cart.reduce((s, i) => s + i.food.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = Math.round(cartTotal * 1.05);

  function handleAdd(food: FoodItem) { addToCart(food, 1); }
  function handleRemove(food: FoodItem) {
    const ex = cart.find(i => i.food.id === food.id);
    if (ex && ex.quantity > 1) updateCartQty(food.id, ex.quantity - 1);
    else removeFromCart(food.id);
  }

  function validate() {
    const e: Record<string,string> = {};
    if (!customerName.trim())                                      e.name  = 'Customer name is required';
    if (!customerPhone.trim() || customerPhone.replace(/\D/g,'').length < 10) e.phone = 'Valid 10-digit number required';
    if (!tableNumber.trim())                                       e.table = 'Table number is required';
    if (cart.length === 0)                                         e.cart  = 'Add at least one item';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePlaceOrder() {
    if (!validate()) return;
    addOrder(
      { name: customerName.trim(), phone: customerPhone.trim(), tableNumber: tableNumber.trim() },
      cart,
      waiterStaff?.id
    );
    clearCart();
    setSuccess(true);
    setTimeout(() => router.push('/waiter/orders'), 1800);
  }

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:15 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </motion.div>
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <h2 className="font-display text-3xl font-bold text-brand-brown mb-2">Order Placed!</h2>
        <p className="text-brand-brown-muted">The kitchen has been notified. Redirecting…</p>
      </motion.div>
    </div>
  );

  const CartPanel = () => (
    <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dark flex flex-col h-full">
      <div className="p-5 border-b border-brand-cream-dark flex items-center justify-between">
        <h3 className="font-semibold text-brand-brown flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-brand-orange" />
          Order Summary
          {cartCount > 0 && <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">{cartCount}</span>}
        </h3>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <ShoppingCart className="w-10 h-10 text-brand-brown-muted/20 mb-3" />
            <p className="text-sm text-brand-brown-muted">No items yet</p>
            <p className="text-xs text-brand-brown-muted/60 mt-1">Select from the menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {cart.map(ci => (
                <motion.div key={ci.food.id} layout initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }}
                  className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold flex items-center justify-center flex-shrink-0">{ci.quantity}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-brown line-clamp-1">{ci.food.name}</p>
                    <p className="text-xs text-brand-brown-muted">{formatCurrency(ci.food.price * ci.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateCartQty(ci.food.id, ci.quantity - 1)} className="w-6 h-6 rounded-md bg-brand-cream-dark hover:bg-red-100 hover:text-red-600 text-brand-brown text-sm flex items-center justify-center transition-colors">−</button>
                    <button onClick={() => updateCartQty(ci.food.id, ci.quantity + 1)} className="w-6 h-6 rounded-md bg-brand-cream-dark hover:bg-green-100 hover:text-green-600 text-brand-brown text-sm flex items-center justify-center transition-colors">+</button>
                    <button onClick={() => removeFromCart(ci.food.id)} className="w-6 h-6 rounded-md hover:bg-red-100 text-brand-brown-muted hover:text-red-500 flex items-center justify-center transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-brand-cream-dark space-y-4">
        {cart.length > 0 && (
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-brand-brown-muted"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
            <div className="flex justify-between text-brand-brown-muted"><span>GST (5%)</span><span>{formatCurrency(Math.round(cartTotal * 0.05))}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-brand-cream-dark pt-2 mt-1">
              <span className="text-brand-brown">Grand Total</span>
              <span className="text-brand-orange">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        )}
        {errors.cart && <p className="text-xs text-red-600">{errors.cart}</p>}
        <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
          Place Order <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      <div className="flex-1 space-y-5 min-w-0">
        {/* Customer details */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-brand-cream-dark">
          <h3 className="font-semibold text-brand-brown mb-4">Customer Details</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Name *" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Suresh Menon" error={errors.name} />
            <Input label="Phone *" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="9876543210" error={errors.phone} />
            <Input label="Table *" value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="e.g. 5" error={errors.table} />
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-brand-cream-dark">
          <h3 className="font-semibold text-brand-brown mb-4">Select Items</h3>
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-cream-dark bg-brand-cream/60 text-sm text-brand-brown placeholder:text-brand-brown-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-colors" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === cat ? 'bg-brand-orange text-white shadow-sm' : 'bg-brand-cream-dark text-brand-brown-muted hover:text-brand-brown'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon="🍽️" title="No items found" description="Try a different search or category." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => {
                const inCart = cart.find(i => i.food.id === item.id);
                return <FoodCard key={item.id} item={item} quantity={inCart?.quantity || 0} onAdd={handleAdd} onRemove={handleRemove} selectable />;
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Desktop cart */}
      <div className="hidden xl:block xl:w-80 xl:flex-shrink-0">
        <div className="sticky top-4 h-[calc(100vh-6rem)]"><CartPanel /></div>
      </div>

      {/* Mobile sticky cart button */}
      {cartCount > 0 && (
        <div className="xl:hidden fixed bottom-6 left-4 right-4 z-40">
          <button onClick={() => setMobileCartOpen(true)}
            className="w-full bg-brand-orange text-white rounded-2xl py-4 px-5 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white/20 text-white text-sm font-bold flex items-center justify-center">{cartCount}</span>
              <span className="font-semibold">View Order</span>
            </div>
            <span className="font-bold">{formatCurrency(grandTotal)}</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {mobileCartOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setMobileCartOpen(false)} className="xl:hidden fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }} transition={{ type:'spring', damping:28, stiffness:300 }}
              className="xl:hidden fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-brand-cream rounded-t-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-brand-cream-dark flex-shrink-0">
                <h3 className="font-semibold text-brand-brown">Your Order</h3>
                <button onClick={() => setMobileCartOpen(false)} className="w-8 h-8 rounded-full bg-brand-cream-dark flex items-center justify-center">
                  <X className="w-4 h-4 text-brand-brown-muted" />
                </button>
              </div>
              <div className="flex-1 min-h-0"><CartPanel /></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
