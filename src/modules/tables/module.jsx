import { lazy } from 'react'
import { LayoutGrid } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { subscribe, EVENTS } from '@/core/events/eventBus'
import { useTablesStore } from './store/tables.store'

const TablesPage = lazy(() => import('./pages/TablesPage'))

export default defineModule({
  id: 'tables',
  name: 'Table Management',
  adminRoutes: [{ path: 'tables', element: <TablesPage />, permission: 'tables.manage' }],
  adminNav: [{ path: '/admin/tables', label: 'Tables', icon: LayoutGrid, group: 'Operations', order: 30, permission: 'tables.manage' }],
  register() {
    // A dine-in order on a free table seats it automatically.
    return subscribe(EVENTS.ORDER_PLACED, (order) => {
      if (order.type !== 'dine-in' || !order.tableId) return
      const t = useTablesStore.getState().getTable(order.tableId)
      if (t && t.status !== 'occupied') useTablesStore.getState().seat(order.tableId, { guest: order.customer?.name, waiter: order.waiter })
    })
  },
})
