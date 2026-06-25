'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import { FoodItem } from '@/types';
import { Button, Input, EmptyState, SectionHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit2, Trash2, Search, Flame, X } from 'lucide-react';

const CATEGORIES = ['Biryani', 'Dosa', 'Curries', 'Snacks', 'Desserts', 'Beverages'];
const SPICE_LEVELS = ['mild', 'medium', 'hot'] as const;

const defaultForm = {
  name: '', description: '', price: '', image: '', category: 'Biryani',
  isVeg: true, isAvailable: true, spiceLevel: 'mild' as const,
};

export default function AdminMenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ['All', ...CATEGORIES];

  const filtered = menuItems.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function openAdd() {
    setEditItem(null);
    setForm(defaultForm);
    setShowForm(true);
  }

  function openEdit(item: FoodItem) {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      spiceLevel: item.spiceLevel || 'mild',
    });
    setShowForm(true);
  }

  function handleSubmit() {
    if (!form.name || !form.price) return;
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      image: form.image || 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
      category: form.category,
      isVeg: form.isVeg,
      isAvailable: form.isAvailable,
      spiceLevel: form.spiceLevel,
    };
    if (editItem) {
      updateMenuItem(editItem.id, payload);
    } else {
      addMenuItem(payload);
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    deleteMenuItem(id);
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search menu items…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm text-brand-brown placeholder:text-brand-brown-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-colors"
          />
        </div>
        <Button onClick={openAdd} className="whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-white text-brand-brown-muted border border-brand-cream-dark hover:text-brand-brown'
            }`}
          >
            {cat}
            <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-white/70' : 'text-brand-brown-muted'}`}>
              ({cat === 'All' ? menuItems.length : menuItems.filter(m => m.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Menu table */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No items found"
            description="Try adjusting your search or add a new menu item."
            action={<Button onClick={openAdd}><Plus className="w-4 h-4" />Add Item</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-cream-dark bg-brand-cream/50">
                  <th className="text-left text-xs font-semibold text-brand-brown-muted uppercase tracking-wider px-5 py-3">Item</th>
                  <th className="text-left text-xs font-semibold text-brand-brown-muted uppercase tracking-wider px-3 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-brand-brown-muted uppercase tracking-wider px-3 py-3">Price</th>
                  <th className="text-left text-xs font-semibold text-brand-brown-muted uppercase tracking-wider px-3 py-3 hidden md:table-cell">Status</th>
                  <th className="text-right text-xs font-semibold text-brand-brown-muted uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80'; }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium text-brand-brown">{item.name}</span>
                          </div>
                          <p className="text-xs text-brand-brown-muted line-clamp-1 max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="text-xs bg-brand-cream-dark text-brand-brown px-2 py-1 rounded-lg font-medium">{item.category}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm font-bold text-brand-orange">{formatCurrency(item.price)}</span>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <button
                        onClick={() => updateMenuItem(item.id, { isAvailable: !item.isAvailable })}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          item.isAvailable
                            ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-brand-cream-dark">
              <h2 className="font-display text-lg font-bold text-brand-brown">
                {editItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-brand-cream-dark flex items-center justify-center text-brand-brown-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <Input
                label="Item Name *"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Masala Dosa"
              />

              <div>
                <label className="text-sm font-medium text-brand-brown block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe this dish…"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm text-brand-brown placeholder:text-brand-brown-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Price (₹) *"
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="120"
                />

                <div>
                  <label className="text-sm font-medium text-brand-brown block mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-colors"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <Input
                label="Image URL"
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                placeholder="https://…"
              />

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-brand-brown block mb-1.5">Spice Level</label>
                  <select
                    value={form.spiceLevel}
                    onChange={e => setForm(f => ({ ...f, spiceLevel: e.target.value as typeof form.spiceLevel }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm text-brand-brown outline-none focus:border-brand-orange transition-colors"
                  >
                    {SPICE_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-brand-brown">Type</label>
                  <div className="flex gap-2 mt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="veg" checked={form.isVeg} onChange={() => setForm(f => ({...f, isVeg: true}))} className="accent-green-600" />
                      <span className="text-xs text-brand-brown">Veg</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="veg" checked={!form.isVeg} onChange={() => setForm(f => ({...f, isVeg: false}))} className="accent-red-600" />
                      <span className="text-xs text-brand-brown">Non-veg</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-brand-brown">Available</label>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, isAvailable: !f.isAvailable }))}
                    className={`mt-1 h-7 w-12 rounded-full transition-colors relative ${form.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${form.isAvailable ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {form.image && (
                <div className="rounded-xl overflow-hidden h-32 bg-brand-cream-dark">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80'; }} />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editItem ? 'Save Changes' : 'Add to Menu'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-brand-brown mb-2">Delete Item?</h3>
            <p className="text-sm text-brand-brown-muted mb-6">This will permanently remove the item from your menu.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
