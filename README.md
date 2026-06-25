# 🍛 Anna Kitchen — Restaurant Management System (v2)

A **premium South Indian restaurant management web app** built with Next.js 14, TypeScript, Tailwind CSS, Zustand, and Framer Motion. Frontend-only, no backend required.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## 🔐 Login Credentials

| Role   | Email                | Password   |
|--------|----------------------|------------|
| Admin  | admin@gmail.com      | admin123   |
| Chef   | chef@gmail.com       | chef123    |
| Waiter | waiter@gmail.com     | waiter123  |

Features: show/hide password toggle, validation messages, wrong-credential error state, loading animation.

---

## ✨ What's New in v2

### 1. Email + Password Login
- Real login form with email/password fields
- Show/hide password toggle
- Field-level validation (empty, invalid email format, short password)
- Wrong-credential error alert
- Loading spinner on submit
- Auto-redirect by role after login
- Demo account hint buttons to fill credentials instantly

### 2. Dashboard Date Filters
- **Today / This Week / This Month** filter buttons on Admin Dashboard
- All 4 stat cards (Revenue, Total Orders, Completed, Pending Payments) update dynamically
- Active filter highlighted; order count shown

### 3. Waiter Management (`/admin/waiters`)
- Card grid of all waiters with avatar, name, email, phone, join date
- Total & active order counts per waiter
- **Create Waiter** modal — name, email, phone, password with validation
- **View Details** → `/admin/waiters/[id]` showing profile + stats + full order history table

### 4. Chef Management (`/admin/chefs`)
- Card grid of all chefs with on-duty status badge
- Orders prepared + completed counts
- **Create Chef** modal
- **View Details** → `/admin/chefs/[id]` showing profile + performance stats + prepared orders table

### 5. Order Detail & Edit (Waiter My Orders)
- Click any order card to open a full-screen detail modal
- **Customer section** — name, phone, table number
- **Order Timeline** — visual step-by-step progress bar (Created → Preparing → Ready → Served → Paid) with timestamps
- **Item editing** — increase/decrease quantity, remove items, add new items via food picker search
- **Grand total recalculates** automatically on every change
- **Save changes** button (disabled when no changes or after payment)
- Locked after payment with clear notice
- Waiter orders page now shows enhanced cards with status colour bar, customer info, item preview, and "Mark Served" quick action

### 6. Order–Waiter Linking
- Orders are linked to the waiter who created them via `waiterId`
- Waiter detail page shows only that waiter's orders
- New orders automatically attach to the logged-in waiter's staff record

---

## 📁 Project Structure

```
anna-kitchen/
├── app/
│   ├── login/                      # Email + password login
│   ├── admin/
│   │   ├── page.tsx                # Dashboard with date filters
│   │   ├── orders/                 # All orders with search + tabs
│   │   ├── menu/                   # Add / edit / delete menu items
│   │   ├── customers/              # Active & completed customers
│   │   ├── waiters/                # Waiter list + [id] detail
│   │   └── chefs/                  # Chef list + [id] detail
│   ├── chef/                       # Kitchen kanban + all orders
│   └── waiter/
│       ├── page.tsx                # Dashboard
│       ├── new-order/              # Create order with food picker
│       └── orders/                 # My orders + edit modal
├── components/
│   ├── layout/                     # Sidebar (with new links), Topbar, DashboardLayout
│   ├── shared/
│   │   ├── OrderCard.tsx           # Compact order card
│   │   ├── OrderDetailModal.tsx    # Full detail + edit + timeline
│   │   └── FoodCard.tsx
│   └── ui/                         # StatCard, Button, Input, Badge, EmptyState, Toast
├── lib/
│   ├── mockData.ts                 # 15 dishes, 6 orders, 5 staff members, timelines
│   └── utils.ts                   # filterOrdersByDate, formatDateTime, avatarInitials…
├── store/index.ts                  # loginWithEmail, staff CRUD, updateOrderItems, timelines
└── types/index.ts                  # DateFilter, StaffMember, OrderTimeline, updated Order
```

---

## 🎨 Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Zustand (localStorage) · Framer Motion · Lucide React
