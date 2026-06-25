'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FoodItem, Order, OrderItem, OrderStatus, User, StaffMember } from '@/types';
import { MENU_ITEMS, MOCK_ORDERS, DEMO_ACCOUNTS, MOCK_STAFF } from '@/lib/mockData';
import { generateCustomerId, generateOrderId } from '@/lib/utils';

interface AppState {
  // Auth
  currentUser: User | null;
  loginWithEmail: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  // Staff (waiters + chefs)
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id' | 'orderIds'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  // Menu
  menuItems: FoodItem[];
  addMenuItem: (item: Omit<FoodItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteMenuItem: (id: string) => void;

  // Orders
  orders: Order[];
  addOrder: (
    customer: { name: string; phone: string; tableNumber: string },
    items: OrderItem[],
    waiterId?: string
  ) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItems: (orderId: string, items: OrderItem[]) => void;
  markPaymentReceived: (orderId: string) => void;

  // Cart
  cart: OrderItem[];
  addToCart: (item: FoodItem, quantity?: number) => void;
  removeFromCart: (foodId: string) => void;
  updateCartQty: (foodId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth ────────────────────────────────────────────────────────
      currentUser: null,
      loginWithEmail: (email, password) => {
        const account = DEMO_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );
        if (!account) return { success: false, error: 'Invalid email or password.' };
        const { password: _pw, ...user } = account;
        set({ currentUser: user });
        return { success: true };
      },
      logout: () => set({ currentUser: null, cart: [] }),

      // ── Staff ────────────────────────────────────────────────────────
      staff: MOCK_STAFF,
      addStaff: (member) => {
        const newMember: StaffMember = { ...member, id: `staff-${Date.now()}`, orderIds: [] };
        set((s) => ({ staff: [...s.staff, newMember] }));
      },
      updateStaff: (id, updates) => {
        set((s) => ({ staff: s.staff.map((m) => (m.id === id ? { ...m, ...updates } : m)) }));
      },
      deleteStaff: (id) => {
        set((s) => ({ staff: s.staff.filter((m) => m.id !== id) }));
      },

      // ── Menu ─────────────────────────────────────────────────────────
      menuItems: MENU_ITEMS,
      addMenuItem: (item) => {
        const newItem: FoodItem = { ...item, id: `f-${Date.now()}` };
        set((s) => ({ menuItems: [...s.menuItems, newItem] }));
      },
      updateMenuItem: (id, updates) => {
        set((s) => ({
          menuItems: s.menuItems.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },
      deleteMenuItem: (id) => {
        set((s) => ({ menuItems: s.menuItems.filter((m) => m.id !== id) }));
      },

      // ── Orders ───────────────────────────────────────────────────────
      orders: MOCK_ORDERS,
      addOrder: (customer, items, waiterId) => {
        const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
        const id = generateOrderId();
        const now = new Date().toISOString();
        const order: Order = {
          id,
          customer: { ...customer, id: generateCustomerId() },
          items,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          total,
          createdAt: now,
          updatedAt: now,
          waiterId,
          timeline: [{ status: 'PENDING', timestamp: now }],
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        // Attach to staff
        if (waiterId) {
          set((s) => ({
            staff: s.staff.map((m) =>
              m.id === waiterId ? { ...m, orderIds: [...m.orderIds, id] } : m
            ),
          }));
        }
        return id;
      },
      updateOrderStatus: (orderId, status) => {
        const now = new Date().toISOString();
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  updatedAt: now,
                  timeline: [...(o.timeline || []), { status, timestamp: now }],
                }
              : o
          ),
        }));
      },
      updateOrderItems: (orderId, items) => {
        const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
        const now = new Date().toISOString();
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, items, total, updatedAt: now } : o
          ),
        }));
      },
      markPaymentReceived: (orderId) => {
        const now = new Date().toISOString();
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  paymentStatus: 'PAID',
                  updatedAt: now,
                  timeline: [...(o.timeline || []), { status: 'PAID', timestamp: now }],
                }
              : o
          ),
        }));
      },

      // ── Cart ─────────────────────────────────────────────────────────
      cart: [],
      addToCart: (food, quantity = 1) => {
        const cart = get().cart;
        const existing = cart.find((i) => i.food.id === food.id);
        if (existing) {
          set({ cart: cart.map((i) => i.food.id === food.id ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({ cart: [...cart, { food, quantity }] });
        }
      },
      removeFromCart: (foodId) => {
        set((s) => ({ cart: s.cart.filter((i) => i.food.id !== foodId) }));
      },
      updateCartQty: (foodId, quantity) => {
        if (quantity <= 0) { get().removeFromCart(foodId); return; }
        set((s) => ({ cart: s.cart.map((i) => (i.food.id === foodId ? { ...i, quantity } : i)) }));
      },
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'anna-kitchen-store-v2',
      partialize: (state) => ({
        currentUser: state.currentUser,
        menuItems: state.menuItems,
        orders: state.orders,
        staff: state.staff,
      }),
    }
  )
);
