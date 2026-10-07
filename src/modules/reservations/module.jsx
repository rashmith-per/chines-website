import { lazy } from 'react'
import { CalendarDays } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { subscribe, EVENTS } from '@/core/events/eventBus'
import { todayISO } from '@/core/lib/format'
import { useTablesStore } from '@/modules/tables'
import { useReservationsStore } from './store/reservations.store'

const ReservationPage = lazy(() => import('./pages/ReservationPage'))
const ReservationsAdminPage = lazy(() => import('./pages/admin/ReservationsAdminPage'))

export default defineModule({
  id: 'reservations',
  name: 'Reservations',
  publicRoutes: [{ path: 'reservations', element: <ReservationPage /> }],
  adminRoutes: [{ path: 'reservations', element: <ReservationsAdminPage />, permission: 'reservations.manage' }],
  adminNav: [
    {
      path: '/admin/reservations',
      label: 'Reservations',
      icon: CalendarDays,
      group: 'Operations',
      order: 40,
      permission: 'reservations.manage',
      useBadge: () => useReservationsStore((s) => s.reservations.filter((r) => r.status === 'pending' && r.date === todayISO()).length),
    },
  ],
  register() {
    // Hold the table on the floor plan when a same-day booking lands on a free table.
    return subscribe(EVENTS.RESERVATION_CREATED, (r) => {
      if (r.date !== todayISO() || !r.tableId) return
      const table = useTablesStore.getState().getTable(r.tableId)
      if (table?.status === 'available') useTablesStore.getState().reserve(r.tableId, r.name)
    })
  },
})
