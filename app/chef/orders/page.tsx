'use client';
import { useStore } from '@/store';
import OrderCard from '@/components/shared/OrderCard';
import { EmptyState } from '@/components/ui';

export default function ChefOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  const chefOrders = orders.filter(o => o.status !== 'COMPLETED');

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-brown-muted">{chefOrders.length} active orders requiring attention</p>

      {chefOrders.length === 0 ? (
        <EmptyState
          icon="🍳"
          title="No active orders"
          description="All orders have been completed. Great work!"
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {chefOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              role="chef"
              onStatusChange={updateOrderStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
