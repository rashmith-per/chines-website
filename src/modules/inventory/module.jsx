import { lazy } from 'react'
import { Boxes } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { subscribe, publish, EVENTS } from '@/core/events/eventBus'
import { useInventoryStore, stockStatus } from './store/inventory.store'
import { consumptionFor } from './data/inventory.data'

const InventoryPage = lazy(() => import('./pages/InventoryPage'))

export default defineModule({
  id: 'inventory',
  name: 'Inventory Management',
  adminRoutes: [{ path: 'inventory', element: <InventoryPage />, permission: 'inventory.manage' }],
  adminNav: [
    {
      path: '/admin/inventory',
      label: 'Inventory',
      icon: Boxes,
      group: 'Business',
      order: 20,
      permission: 'inventory.manage',
      useBadge: () => useInventoryStore((s) => s.items.filter((i) => stockStatus(i) !== 'ok').length),
      badgeTone: 'amber',
    },
  ],
  register() {
    // Auto-deduct stock from every order and raise low-stock events.
    return subscribe(EVENTS.ORDER_PLACED, (order) => {
      const deltas = order.items.flatMap((l) => consumptionFor(l, order.type)).map(([id, q]) => [id, -q])
      if (['takeaway', 'delivery'].includes(order.type)) deltas.push(['pack-bags', -1])
      const crossed = useInventoryStore.getState().apply(deltas, `Order ${order.code}`)
      crossed.forEach((item) => publish(EVENTS.INVENTORY_LOW, item))
    })
  },
})
