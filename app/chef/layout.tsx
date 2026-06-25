import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout requiredRole="chef">{children}</DashboardLayout>;
}
