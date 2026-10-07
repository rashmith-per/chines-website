import { lazy } from 'react'
import { ChefHat } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { useOrdersStore } from '@/modules/ordering'

const KdsPage = lazy(() => import('./pages/KdsPage'))

export default defineModule({
  id: 'kds',
  name: 'Kitchen Display System',
  adminRoutes: [{ path: 'kds', element: <KdsPage />, permission: 'kds.view' }],
  adminNav: [
    {
      path: '/admin/kds',
      label: 'Kitchen (KDS)',
      icon: ChefHat,
      group: 'Operations',
      order: 25,
      permission: 'kds.view',
      useBadge: () => useOrdersStore((s) => s.orders.filter((o) => ['received', 'confirmed', 'preparing'].includes(o.status)).length),
    },
  ],
})
