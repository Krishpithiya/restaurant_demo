import { FoodItem, Order, User, StaffMember } from '@/types';

// Demo login accounts
export const DEMO_ACCOUNTS: (User & { password: string })[] = [
  { id: 'admin-1', name: 'Priya Sharma', role: 'admin', email: 'admin@gmail.com', password: 'admin123', avatar: 'PS', phone: '9876500001', joinDate: '2023-01-15' },
  { id: 'chef-1',  name: 'Rajan Kumar',  role: 'chef',  email: 'chef@gmail.com',  password: 'chef123',  avatar: 'RK', phone: '9876500002', joinDate: '2023-03-10' },
  { id: 'waiter-1',name: 'Arjun Nair',   role: 'waiter',email: 'waiter@gmail.com',password: 'waiter123',avatar: 'AN', phone: '9876500003', joinDate: '2023-06-01' },
];

export const MOCK_USERS: User[] = DEMO_ACCOUNTS.map(({ password, ...u }) => u);

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'w-1', name: 'Arjun Nair', email: 'waiter@gmail.com', phone: '9876500003',
    role: 'waiter', avatar: 'AN', joinDate: '2023-06-01', password: 'waiter123',
    isActive: true, orderIds: ['ORD-001', 'ORD-002', 'ORD-005'],
  },
  {
    id: 'w-2', name: 'Meena Pillai', email: 'meena@gmail.com', phone: '9876500004',
    role: 'waiter', avatar: 'MP', joinDate: '2023-08-15', password: 'meena123',
    isActive: true, orderIds: ['ORD-003', 'ORD-004'],
  },
  {
    id: 'w-3', name: 'Sunil Das', email: 'sunil@gmail.com', phone: '9900112233',
    role: 'waiter', avatar: 'SD', joinDate: '2024-01-20', password: 'sunil123',
    isActive: false, orderIds: [],
  },
  {
    id: 'c-1', name: 'Rajan Kumar', email: 'chef@gmail.com', phone: '9876500002',
    role: 'chef', avatar: 'RK', joinDate: '2023-03-10', password: 'chef123',
    isActive: true, orderIds: ['ORD-001', 'ORD-002', 'ORD-003', 'ORD-004', 'ORD-005'],
  },
  {
    id: 'c-2', name: 'Geetha Nambiar', email: 'geetha@gmail.com', phone: '9811223344',
    role: 'chef', avatar: 'GN', joinDate: '2023-05-22', password: 'geetha123',
    isActive: true, orderIds: [],
  },
];

export const MENU_ITEMS: FoodItem[] = [
  { id: 'f1', name: 'Chicken Chettinad Biryani', description: 'Aromatic basmati rice cooked with tender chicken in Chettinad spices, garnished with crispy onions and fresh coriander.', price: 320, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', category: 'Biryani', isAvailable: true, isVeg: false, spiceLevel: 'hot' },
  { id: 'f2', name: 'Vegetable Dum Biryani', description: 'Fragrant basmati rice layered with mixed vegetables and saffron, slow-cooked in a sealed pot.', price: 240, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80', category: 'Biryani', isAvailable: true, isVeg: true, spiceLevel: 'medium' },
  { id: 'f3', name: 'Mutton Biryani', description: 'Slow-cooked mutton with aged basmati, whole spices, and caramelized onions. A royal treat.', price: 420, image: 'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400&q=80', category: 'Biryani', isAvailable: true, isVeg: false, spiceLevel: 'hot' },
  { id: 'f4', name: 'Masala Dosa', description: 'Crispy golden crepe filled with spiced potato masala, served with coconut chutney and sambar.', price: 120, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', category: 'Dosa', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
  { id: 'f5', name: 'Ghee Roast Dosa', description: 'Paper-thin dosa roasted in generous ghee until golden and crisp, best eaten fresh off the tawa.', price: 140, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', category: 'Dosa', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
  { id: 'f6', name: 'Chicken Ghee Roast', description: 'Mangalorean specialty — tender chicken dry-roasted in ghee with tangy Byadgi chillies and aromatic spices.', price: 380, image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&q=80', category: 'Curries', isAvailable: true, isVeg: false, spiceLevel: 'hot' },
  { id: 'f7', name: 'Kerala Fish Curry', description: 'Fresh kingfish simmered in a tangy coconut milk gravy with Kodampuli, green chillies, and turmeric.', price: 360, image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80', category: 'Curries', isAvailable: true, isVeg: false, spiceLevel: 'hot' },
  { id: 'f8', name: 'Sambar', description: 'Classic Tamil Nadu lentil stew with pearl onions, tomatoes, and tamarind. A soul-warming staple.', price: 80, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', category: 'Curries', isAvailable: true, isVeg: true, spiceLevel: 'medium' },
  { id: 'f9', name: 'Avial', description: 'Kerala-style mixed vegetable curry in coconut and yogurt sauce, finished with fragrant coconut oil.', price: 160, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', category: 'Curries', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
  { id: 'f10', name: 'Medu Vada', description: 'Crispy lentil donuts with a fluffy interior, served hot with coconut chutney and tomato sambar.', price: 90, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', category: 'Snacks', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
  { id: 'f11', name: 'Idli Sambar', description: 'Soft steamed rice cakes paired with aromatic sambar and a trio of chutneys. A South Indian classic.', price: 100, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', category: 'Snacks', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
  { id: 'f12', name: 'Kothu Parotta', description: 'Flaky parottas shredded and stir-fried with eggs, onions, tomatoes, and spicy masala.', price: 200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', category: 'Snacks', isAvailable: true, isVeg: false, spiceLevel: 'medium' },
  { id: 'f13', name: 'Payasam', description: 'Kerala-style rice pudding cooked in coconut milk with jaggery, cardamom, and cashews.', price: 110, image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', category: 'Desserts', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
  { id: 'f14', name: 'Filter Coffee', description: 'Strong South Indian decoction mixed with hot milk, served in the traditional davara tumbler.', price: 60, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', category: 'Beverages', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
  { id: 'f15', name: 'Mango Lassi', description: 'Thick Alphonso mango blended with chilled yogurt and a touch of cardamom.', price: 120, image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&q=80', category: 'Beverages', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
];

const now = new Date();
const hoursAgo  = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysAgo   = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customer: { id: 'c1', name: 'Suresh Menon', phone: '9876543210', tableNumber: '3' },
    items: [{ food: MENU_ITEMS[0], quantity: 2 }, { food: MENU_ITEMS[13], quantity: 2 }],
    status: 'COMPLETED', paymentStatus: 'PAID', total: 760,
    createdAt: hoursAgo(3), updatedAt: hoursAgo(2), waiterId: 'w-1',
    timeline: [
      { status: 'PENDING',   timestamp: hoursAgo(3) },
      { status: 'PREPARING', timestamp: hoursAgo(2.5) },
      { status: 'READY',     timestamp: hoursAgo(2.2) },
      { status: 'COMPLETED', timestamp: hoursAgo(2) },
      { status: 'PAID',      timestamp: hoursAgo(1.8) },
    ],
  },
  {
    id: 'ORD-002',
    customer: { id: 'c2', name: 'Lakshmi Iyer', phone: '9123456789', tableNumber: '5' },
    items: [{ food: MENU_ITEMS[3], quantity: 1 }, { food: MENU_ITEMS[9], quantity: 2 }, { food: MENU_ITEMS[12], quantity: 1 }],
    status: 'COMPLETED', paymentStatus: 'PAID', total: 410,
    createdAt: daysAgo(2), updatedAt: daysAgo(2), waiterId: 'w-1',
    timeline: [
      { status: 'PENDING',   timestamp: daysAgo(2) },
      { status: 'PREPARING', timestamp: daysAgo(2) },
      { status: 'READY',     timestamp: daysAgo(2) },
      { status: 'COMPLETED', timestamp: daysAgo(2) },
      { status: 'PAID',      timestamp: daysAgo(2) },
    ],
  },
  {
    id: 'ORD-003',
    customer: { id: 'c3', name: 'Karthik Rajan', phone: '9654321870', tableNumber: '2' },
    items: [{ food: MENU_ITEMS[6], quantity: 1 }, { food: MENU_ITEMS[1], quantity: 1 }, { food: MENU_ITEMS[14], quantity: 2 }],
    status: 'READY', paymentStatus: 'UNPAID', total: 840,
    createdAt: hoursAgo(1), updatedAt: hoursAgo(0.5), waiterId: 'w-2',
    timeline: [
      { status: 'PENDING',   timestamp: hoursAgo(1) },
      { status: 'PREPARING', timestamp: hoursAgo(0.7) },
      { status: 'READY',     timestamp: hoursAgo(0.5) },
    ],
  },
  {
    id: 'ORD-004',
    customer: { id: 'c4', name: 'Deepa Krishnan', phone: '8765432109', tableNumber: '7' },
    items: [{ food: MENU_ITEMS[2], quantity: 1 }, { food: MENU_ITEMS[7], quantity: 1 }, { food: MENU_ITEMS[13], quantity: 1 }],
    status: 'PREPARING', paymentStatus: 'UNPAID', total: 560,
    createdAt: hoursAgo(0.75), updatedAt: hoursAgo(0.25), waiterId: 'w-2',
    timeline: [
      { status: 'PENDING',   timestamp: hoursAgo(0.75) },
      { status: 'PREPARING', timestamp: hoursAgo(0.25) },
    ],
  },
  {
    id: 'ORD-005',
    customer: { id: 'c5', name: 'Vijay Anand', phone: '9988776655', tableNumber: '1' },
    items: [{ food: MENU_ITEMS[5], quantity: 1 }, { food: MENU_ITEMS[10], quantity: 2 }, { food: MENU_ITEMS[14], quantity: 1 }],
    status: 'PENDING', paymentStatus: 'UNPAID', total: 700,
    createdAt: hoursAgo(0.2), updatedAt: hoursAgo(0.2), waiterId: 'w-1',
    timeline: [{ status: 'PENDING', timestamp: hoursAgo(0.2) }],
  },
  {
    id: 'ORD-006',
    customer: { id: 'c6', name: 'Anitha Reddy', phone: '9900123456', tableNumber: '4' },
    items: [{ food: MENU_ITEMS[0], quantity: 1 }, { food: MENU_ITEMS[8], quantity: 1 }],
    status: 'COMPLETED', paymentStatus: 'PAID', total: 480,
    createdAt: daysAgo(5), updatedAt: daysAgo(5), waiterId: 'w-1',
    timeline: [
      { status: 'PENDING',   timestamp: daysAgo(5) },
      { status: 'PREPARING', timestamp: daysAgo(5) },
      { status: 'READY',     timestamp: daysAgo(5) },
      { status: 'COMPLETED', timestamp: daysAgo(5) },
      { status: 'PAID',      timestamp: daysAgo(5) },
    ],
  },
];
