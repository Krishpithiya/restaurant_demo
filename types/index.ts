export type Role = 'admin' | 'chef' | 'waiter';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';

export type PaymentStatus = 'UNPAID' | 'PAID';

export type DateFilter = 'today' | 'week' | 'month';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone?: string;
  avatar?: string;
  joinDate?: string;
  password?: string; // stored for demo only
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'waiter' | 'chef';
  avatar: string;
  joinDate: string;
  password: string;
  isActive: boolean;
  orderIds: string[]; // orders handled / prepared
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isVeg: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot';
}

export interface OrderItem {
  food: FoodItem;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  tableNumber: string;
}

export interface OrderTimeline {
  status: OrderStatus | 'PAID';
  timestamp: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  timeline: OrderTimeline[];
  waiterId?: string;
}
