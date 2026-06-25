import DashboardLayout from '@/components/layout/DashboardLayout';

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout requiredRole="waiter">{children}</DashboardLayout>;
}
